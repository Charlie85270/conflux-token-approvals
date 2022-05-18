import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  TokenData,
  TokenInfos,
  TokenMapping,
  Transaction,
} from "../Interfaces";
import { ERC20, ERC721 } from "../Abi";
import { useConflux } from "../../../hooks/useConflux";
import {
  reqDetailTransaction,
  reqContract,
  reqToken,
} from "../../../services/httpReq";
import { Loader } from "./Loader";
import { TokenTable } from "../table/TokenTable";
import AppContext from "../../../AppContext";
import { format } from "js-conflux-sdk";
import { ToastContainer } from "react-toastify";
import { getTokenData } from "../../../utils/utils";

interface Props {
  transactions: Transaction[];
  tokenMapping?: TokenMapping;
  userTokens: TokenData[];
  inputAddress?: string;
  isLoading?: boolean;
  abi: any;
}

function TokenList({
  transactions,
  tokenMapping,
  inputAddress,
  userTokens,
  abi,
  isLoading,
}: Props) {
  const [tokens, setTokens] = useState<TokenInfos[]>([]);
  const { space, hideZeroAllowance } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);
  const { conflux } = useConflux();

  const loadData = async () => {
    setLoading(true);
    // Filter unique token contract addresses and convert all events to Contract instances
    const transactionsWithContractInfos = transactions
      .filter(tr => tr.toContractInfo)
      .map(event => {
        return {
          ...event,
          contract: conflux.Contract({
            address: event.toContractInfo.address,
            abi,
          }),
        };
      });

    const completeData = await Promise.all(
      transactionsWithContractInfos.map(async token => {
        const dataToDecode = await reqDetailTransaction(token.hash, space);

        try {
          const data = await token.contract.abi.decodeData(dataToDecode.data);
          const tokenInfos = await reqToken(token.toTokenInfo.address, space);
          let allowance = 0;
          let tokenId = null;
          try {
            if (space === "CORE") {
              //@ts-ignore
              if (!!token.contract.allowance) {
                //@ts-ignore
                allowance = await token.contract.allowance(
                  inputAddress,
                  data.object.spender || data.object.operator || data.object.to
                );
                //@ts-ignore
              } else if (!!token.contract.isApprovedForAll) {
                //@ts-ignore
                if (token.contract.getApproved && data.object.tokenId) {
                  tokenId = data.object.tokenId;

                  //@ts-ignore
                  const addresseAllow = await token.contract.getApproved(
                    data.object.tokenId
                  );
                  allowance =
                    addresseAllow ===
                    "cfx:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0sfbnjm2"
                      ? 0
                      : 1;
                } else {
                  //@ts-ignore
                  allowance = await token.contract.isApprovedForAll(
                    inputAddress,
                    data.object.spender ||
                      data.object.operator ||
                      data.object.to
                  );
                }
              }
            } else {
              const defaultProvider = new ethers.providers.JsonRpcProvider(
                "https://evm.confluxrpc.com"
              );
              const signer = defaultProvider.getSigner(
                "0xE8667043E2F7104196E9531330ADD20959B44B47"
              );

              const contract = new ethers.Contract(
                format.hexAddress(token.toContractInfo.address),
                ERC20,
                defaultProvider
              );

              const signedContract = contract.connect(signer);
              if (!!signedContract.allowance) {
                allowance = await signedContract.allowance(
                  inputAddress,
                  data.object.spender
                );
              } else if (!!signedContract.isApprovedForAll) {
                allowance = await signedContract.isApprovedForAll(
                  inputAddress,
                  data.object.spender || data.object.operator || data.object.to
                );
              }
            }
          } catch (err: any) {
            console.log(err);
          }

          const spenderData = await reqContract(
            data.object.spender || data.object.operator || data.object.to,
            space
          );

          const tokenData = await getTokenData(
            abi === ERC721 ? spenderData.address : token.toTokenInfo.address,
            tokenInfos,
            userTokens,
            tokenMapping
          );

          return {
            ...tokenData,
            tokenId,
            tokenType: token.toTokenInfo.tokenType,
            transactionHash: token.hash,
            iconUrl: tokenInfos.iconUrl || tokenData.iconUrl,
            spender: { name: spenderData.name, address: spenderData.address },
            transaction: token,
            name: token.toContractInfo.name || `${token.toTokenInfo.name}`,
            allowance,
            //@ts-ignore
            isApprovalsForAll: abi !== ERC20,
          };
        } catch (err) {
          console.log(err);
          // If the call to getTokenData() fails, the token is not an ERC20 token so
          // we do not include it in the token list (should not happen).
          return {};
        }
      })
    );

    setTokens(
      hideZeroAllowance
        ? //@ts-ignore
          completeData.filter(dt =>
            //@ts-ignore
            typeof dt.allowance !== "boolean"
              ? //@ts-ignore
                dt.allowance > 0
              : //@ts-ignore
                dt.allowance === true
          )
        : completeData || []
    );
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [transactions]);

  return loading || isLoading ? (
    <div className="flex items-center justify-center w-full">
      <Loader />
    </div>
  ) : (
    <>
      <ToastContainer />
      <TokenTable addressInput={inputAddress || ""} tokens={tokens} />
    </>
  );
}

export default TokenList;
