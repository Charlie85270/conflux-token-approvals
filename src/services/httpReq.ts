import qs from "query-string";
import { TokenData, Transaction } from "../components/shared/Interfaces";
import fetch from "./request";

export const v1Prefix = "/v1";
export const statPrefix = "/stat";

const conflux_url = "https://www.confluxscan.io";
const conflux_evm_url = "https://evm.confluxscan.io";

type Space = "EVM" | "CORE";

export const sendRequest = (config: {
  url: string;
  query?: any;
  type?: string;
  body?: any;
  headers?: any;
  space?: Space;
}) => {
  const url =
    config.url.startsWith("/stat") || config.url.startsWith("http")
      ? config.url
      : `${v1Prefix}${
          config.url.startsWith("/") ? config.url : "/" + config.url
        }`;
  return fetch(
    qs.stringifyUrl({
      url: (config.space === "EVM" ? conflux_evm_url : conflux_url) + url,
      query: config.query,
    }),
    {
      method: config.type || "GET",
      body: config.body,
      headers: config.headers,
    }
  );
};

export const reqTransactions = (
  address: string,
  space: "EVM" | "CORE",
  limit?: number,
  skip?: number
): Promise<{ list: Transaction[] }> => {
  return sendRequest({
    url: `/transaction?accountAddress=${address}&limit=${limit || 100}&skip=${
      skip || 0
    }&tab=transaction`,
    space,
  });
};

export const reqUserCoreTokens = (
  address: string,
  space?: Space
): Promise<{ list: TokenData[] }> => {
  return sendRequest({
    url: `/token?accountAddress=${address}`,
    space,
  });
};

export const reqContractAndToken = (
  address: string,
  space?: Space
): Promise<{ list: TokenData[] }> => {
  return sendRequest({
    url: `/contract-and-token?address=${address}`,
    space,
  });
};

export const reqDetailTransaction = (
  id: string,
  space?: Space
): Promise<{ data: string }> => {
  return sendRequest({
    url: `/transaction/${id}`,
    space,
  });
};

export const reqContract = (id: string, space?: Space): Promise<any> => {
  return sendRequest({
    url: `/contract/${id}`,
    space,
  });
};
export const reqToken = (id: string, space?: Space): Promise<any> => {
  return sendRequest({
    url: `/token/${id}`,
    space,
  });
};
