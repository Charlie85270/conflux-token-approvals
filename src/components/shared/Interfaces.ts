import { Contract, providers } from "ethers";

export interface TokenData {
  accountAddress: string;
  address: string;
  transactionHash: string;
  balance: string;
  decimals: number;
  iconUrl: string;
  name: string;
  allowance: number;
  price: string;
  quoteUrl: string;
  symbol: string;
  totalPrice: string;
  totalSupply: string;
  transferType: string;
}

export interface Erc721TokenData {
  contract: Contract;
  icon: string;
  symbol: string;
  balance: string;
  registered: boolean;
  approvals: Array<providers.Log>;
  approvalsForAll: Array<providers.Log>;
}

export interface TokenFromList {
  chainId: number;
  address: string;
  iconUrl: string;
  name: string;
  totalSupply: string;
  price: string;
  balance: string;
  symbol: string;
  // Only for ERC20
  decimals?: number;
}

export interface TokenMapping {
  [index: string]: TokenFromList;
}

export type TokenStandard = "ERC20" | "ERC721";

export interface Transaction {
  from: string;
  hash: string;
  method: string;
  timestamp: number;
  to: string;
  toContractInfo: { address: string; name: string };
  toTokenInfo: {
    address: string;
    symbol: string;
    name: string;
    tokenType: string;
  };
}

export interface TokenInfos {
  symbol?: string;
  iconUrl?: string;
  price?: string;
  transaction?: Transaction;
  spender?: { name: string; address: string };
  name?: string;
  allowance?: any;
  decimals?: number;
  balance?: string | number;
  totalSupply?: string;
  isApprovalsForAll?: boolean;
}

export interface Allowance {
  spender: string;
  allowance: string;
}
