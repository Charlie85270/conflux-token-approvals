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

export const reqTransactionsAll = async (
  address: string,
  space: "EVM" | "CORE",
  limit?: number
): Promise<{ list: Transaction[] }> => {
  let transactions: Transaction[] = [];

  const skips = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const promises = skips.map(skip => getTransac(address, skip, space, limit));

  const result = await Promise.all(promises);
  result.forEach(result => {
    transactions = transactions.concat(result?.list || ["oui"]);
  });

  return Promise.resolve({ list: transactions });
};

const getTransac = (
  address: string,
  skip: number,
  space: "EVM" | "CORE",
  limit?: number
) => {
  return sendRequest({
    url: `/transaction?accountAddress=${address}&limit=${
      limit || 100
    }&skip=${skip}&tab=transaction`,
    space,
  });
};

export const reqUserTokens = (
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
): Promise<any> => {
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
