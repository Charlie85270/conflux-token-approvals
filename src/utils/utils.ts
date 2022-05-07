import axios from "axios";
import { BigNumberish, BigNumber } from "ethers";
import { format } from "js-conflux-sdk";
import {
  TokenData,
  TokenFromList,
  TokenMapping,
  TokenStandard,
  Transaction,
} from "../components/shared/Interfaces";

// Check if a token is registered in the token mapping
export function isRegistered(
  tokenAddress: string,
  tokenMapping?: TokenMapping
): boolean {
  // If we don't know a registered token mapping, we skip checking registration
  if (!tokenMapping) return true;
  return tokenMapping[tokenAddress] !== undefined;
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

export function isSupportedNetwork(chainId: number): boolean {
  // Supported for now are conflux
  const supportedNetworks = [1030, 1029];
  return supportedNetworks.includes(chainId);
}

export async function getFullTokenMapping(
  chainId: number,
  space: "CORE" | "EVM"
): Promise<TokenMapping | undefined> {
  const tokens = await getTokenMapping(chainId, space, "ERC20");
  return tokens;
}

async function getTokenMapping(
  chainId: number,
  space: "CORE" | "EVM",
  standard: TokenStandard = "ERC20"
): Promise<TokenMapping | undefined> {
  const url = getTokenListUrl(chainId, space, standard);

  if (!url) return undefined;

  try {
    const res = await axios.get(url);

    const tokens: TokenFromList[] = res.data.list;

    const tokenMapping = {};
    for (const token of tokens) {
      // @ts-ignore
      tokenMapping[token.address] = token;
    }

    return tokenMapping;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

function getTokenListUrl(
  chainId: number,
  space: "CORE" | "EVM",
  standard: TokenStandard = "ERC20"
): string | undefined {
  const mapping = {
    ERC20: {
      CORE: {
        1029: "https://confluxscan.io/stat/tokens/list?&fields=iconUrl&fields=price&fields=totalPrice&fields=quoteUrl&fields=transactionCount&fields=erc20TransferCount&limit=1000&orderBy=totalPrice&reverse=true&skip=0&transferType=ERC20",
      },
      EVM: {
        1030: "https://evm.confluxscan.net/stat/tokens/list?fields=transferCount&fields=iconUrl&fields=price&fields=totalPrice&fields=quoteUrl&fields=transactionCount&fields=erc20TransferCount&limit=1000&orderBy=holderCount&reverse=true&skip=0&transferType=ERC20",
      },
    },
    ERC721: {
      1: "https://raw.githubusercontent.com/vasa-develop/nft-tokenlist/master/mainnet_curated_tokens.json",
    },
  };

  // @ts-ignore
  return mapping[standard][space][chainId];
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

export const isValidAddress = (address: string) => {
  let isValid = false;
  let space = undefined;
  try {
    isValid = !!format.address(address, 1030);
    if (isValid) {
      if (address.startsWith("cfx")) {
        space = "CORE";
      } else {
        space = "EVM";
      }
    }
  } catch {
    isValid = false;
  }
  return { space, isValid };
};

export const substring = (start: number, text: string) => {
  if (text.length <= start) {
    return text;
  }
  return `${text.substring(0, start)}...`;
};

export const removeDoubleItem = (list: Transaction[]) => {
  const alreadyHave: string[] = [];
  const finalList: Transaction[] = [];
  list.forEach(item => {
    if (alreadyHave.indexOf(item.toTokenInfo.address) === -1) {
      finalList.push(item);
      alreadyHave.push(item.toTokenInfo.address);
    }
  });
  return finalList;
};

export const isSameAddress = (address1?: string, address2?: string) => {
  return (
    address1 &&
    address2 &&
    address1?.toLocaleLowerCase() !== address2?.toLocaleLowerCase()
  );
};

export async function getTokenData(
  address: string,
  tokenInfos: {
    decimals: 18;
    totalSupply: 0;
  },
  userTokens: TokenData[],
  tokenMapping?: TokenMapping
) {
  const token = tokenMapping && tokenMapping[address];

  const userToken = userTokens.find(tok => tok.address === address);

  console.log(address);
  console.log(userTokens);
  console.log(userToken);

  return {
    iconUrl: token?.iconUrl,
    symbol: token?.symbol || userToken?.symbol,
    price: userToken?.price,
    decimals: tokenInfos.decimals || token?.decimals || userToken?.decimals,
    totalSupply:
      tokenInfos.totalSupply || token?.totalSupply || userToken?.totalSupply,
    balance: userToken?.balance || 0,
  };
}
