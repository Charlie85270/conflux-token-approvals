import axios from "axios";
import { BigNumberish, BigNumber, providers } from "ethers";
import { Provider } from "js-conflux-sdk";
import { Filter, Log } from "@ethersproject/abstract-provider";
import { getAddress } from "ethers/lib/utils";
import { DAPP_LIST_BASE_URL, TRUSTWALLET_BASE_URL } from "./constants";
import {
  TokenFromList,
  TokenMapping,
  TokenStandard,
} from "../components/shared/Interfaces";

// Check if a token is registered in the token mapping
export function isRegistered(
  tokenAddress: string,
  tokenMapping?: TokenMapping
): boolean {
  // If we don't know a registered token mapping, we skip checking registration
  if (!tokenMapping) return true;
  return tokenMapping[getAddress(tokenAddress)] !== undefined;
}

export function shortenAddress(address: string): string {
  return (
    address &&
    `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`
  );
}

export function compareBN(a: BigNumberish, b: BigNumberish): number {
  a = BigNumber.from(a);
  b = BigNumber.from(b);
  const diff = a.sub(b);
  return diff.isZero() ? 0 : diff.lt(0) ? -1 : 1;
}

// Look up an address' App Name using the dapp-contract-list
export async function addressToAppName(
  address: string,
  networkName?: string
): Promise<string | undefined> {
  if (!networkName) return undefined;

  try {
    const { data } = await axios.get(
      `${DAPP_LIST_BASE_URL}/${networkName}/${getAddress(address)}.json`
    );
    return data.appName;
  } catch {
    return undefined;
  }
}

export async function lookupEnsName(
  address: string,
  provider: providers.Provider
): Promise<string | undefined> {
  try {
    return (await provider.lookupAddress(address)) || undefined;
  } catch {
    return undefined;
  }
}

export function getExplorerUrl(chainId: number): string | undefined {
  // Includes all Etherscan, BScScan, BlockScout, Matic, Avalanche explorers
  const mapping = {
    1: "https://etherscan.io/address",
    3: "https://ropsten.etherscan.io/address",
    4: "https://rinkeby.etherscan.io/address",
    5: "https://goerli.etherscan.io/address",
    6: "https://blockscout.com/etc/kotti/address",
    10: "https://optimistic.etherscan.io/address",
    30: "https://blockscout.com/rsk/mainnet/address",
    42: "https://kovan.etherscan.io/address",
    56: "https://bscscan.com/address",
    61: "https://blockscout.com/etc/mainnet/address",
    63: "https://blockscout.com/etc/mordor/address",
    77: "https://blockscout.com/poa/sokol/address",
    97: "https://testnet.bscscan.com/address",
    99: "https://blockscout.com/poa/core/address",
    100: "https://blockscout.com/poa/xdai/address",
    122: "https://explorer.fuse.io/address",
    137: "https://explorer-mainnet.maticvigil.com/address",
    1088: "https://andromeda-explorer.metis.io/address",
    10000: "https://smartscan.cash/address",
    42161: "https://arbiscan.io/address",
    43113: "https://cchain.explorer.avax-test.network/address",
    43114: "https://cchain.explorer.avax.network/address",
    80001: "https://explorer-mumbai.maticvigil.com/address",
  };

  //@ts-ignore
  return mapping[chainId];
}

export function getTrustWalletName(chainId: number): string | undefined {
  const mapping = {
    1: "ethereum",
    56: "smartchain",
    61: "classic",
  };
  //@ts-ignore
  return mapping[chainId];
}

export function getDappListName(chainId: number): string | undefined {
  const mapping = {
    1: "ethereum",
    56: "smartchain",
    100: "xdai",
    122: "fuse",
    137: "matic",
    1088: "metis",
    10000: "smartbch",
    42161: "arbitrum",
    43114: "avalanche",
  };
  //@ts-ignore
  return mapping[chainId];
}

export function isSupportedNetwork(chainId: number): boolean {
  // Supported for now are only ETH, xDAI, SmartBCH, Arbitrum, Metis & AVAX. Other chains fail on the RPC calls.
  const supportedNetworks = [
    1, 3, 4, 5, 42, 100, 122, 1088, 10000, 42161, 43113, 43114,
  ];
  return supportedNetworks.includes(chainId);
}

export async function getFullTokenMapping(
  chainId: number
): Promise<TokenMapping | undefined> {
  const erc20Mapping = await getTokenMapping(chainId, "ERC20");
  const erc721Mapping = await getTokenMapping(chainId, "ERC721");

  if (erc20Mapping === undefined && erc721Mapping === undefined)
    return undefined;

  const fullMapping = { ...erc721Mapping, ...erc20Mapping };
  return fullMapping;
}

async function getTokenMapping(
  chainId: number,
  standard: TokenStandard = "ERC20"
): Promise<TokenMapping | undefined> {
  const url = getTokenListUrl(chainId, standard);

  if (!url) return undefined;

  try {
    const res = await axios.get(url);
    const tokens: TokenFromList[] = res.data.tokens;

    const tokenMapping = {};
    for (const token of tokens) {
      //@ts-ignore
      tokenMapping[getAddress(token.address)] = token;
    }

    return tokenMapping;
  } catch {
    return undefined;
  }
}

function getTokenListUrl(
  chainId: number,
  standard: TokenStandard = "ERC20"
): string | undefined {
  const mapping = {
    ERC20: {
      1: "https://uniswap.mycryptoapi.com/",
      10: "https://static.optimism.io/optimism.tokenlist.json",
      56: "https://raw.githubusercontent.com/pancakeswap/pancake-swap-interface/master/src/constants/token/pancakeswap.json",
      100: "https://tokens.honeyswap.org",
      137: "https://unpkg.com/quickswap-default-token-list@1.0.28/build/quickswap-default.tokenlist.json",
      1088: "https://raw.githubusercontent.com/MetisProtocol/metis/master/tokenlist/toptoken.json",
      42161: "https://bridge.arbitrum.io/token-list-42161.json",
      43114:
        "https://raw.githubusercontent.com/pangolindex/tokenlists/main/aeb.tokenlist.json",
    },
    ERC721: {
      1: "https://raw.githubusercontent.com/vasa-develop/nft-tokenlist/master/mainnet_curated_tokens.json",
    },
  };
  //@ts-ignore
  return mapping[standard][chainId];
}

export function toFloat(n: number, decimals: number): string {
  return (n / 10 ** decimals).toFixed(3);
}

export const unpackResult = async (promise: Promise<any>) => (await promise)[0];

export const withFallback = async (promise: Promise<any>, fallback: any) => {
  try {
    return await promise;
  } catch {
    return fallback;
  }
};

export const convertString = async (promise: Promise<any>) =>
  String(await promise);
