import { useContext } from "react";
import { useConflux } from "../../../hooks/useConflux";
import { ERC1155, ERC721 } from "../Abi";
import {
  useAccount as useFluentAccount,
  connect as connectFluent,
} from "@cfxjs/use-wallet";
import {
  connect as connectMetaMask,
  useAccount as useEvmAccount,
} from "@cfxjs/use-wallet/dist/ethereum";

import AppContext from "../../../AppContext";
import { isSameAddress } from "../../../utils/utils";

interface Props {
  spender?: string;
  allowance: string | number | boolean | undefined;
  contractAddress?: string;
  tokenAddress?: string;
  decimal?: number;
  addressInput?: string;
  tokenId?: string;
}

export const ManageAllApprovals = ({
  contractAddress,
  tokenAddress,
  addressInput,
  spender,
  allowance,
  tokenId,
}: Props) => {
  const { conflux } = useConflux();
  const { space } = useContext(AppContext);
  const coreAccount = useFluentAccount();
  const evmAccount = useEvmAccount();

  const connectWallet = async (connection?: () => Promise<void>) => {
    let connect = connection;
    if (!connect) {
      if (space === "CORE") {
        connect = connectFluent;
      } else {
        connect = connectMetaMask;
      }
    }
    try {
      await connect();
    } catch (err: any) {
      console.log(err);
    }
  };

  const sendTransaction = async (account: string) => {
    if (spender) {
      //@ts-ignore
      conflux.provider = window.conflux;
      const contract = conflux.Contract({
        address: contractAddress,
        abi: tokenId ? ERC721 : ERC1155,
      });

      try {
        //@ts-ignore
        if (contract.getApproved) {
          await contract
            //@ts-ignore
            .approve(
              allowance === false || allowance === 0
                ? spender
                : "cfx:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa0sfbnjm2",
              tokenId
            )
            .sendTransaction({
              from: account,
            });
        } else {
          await contract
            //@ts-ignore
            .setApprovalForAll(
              spender,
              allowance === false || allowance === 0 ? true : false
            )
            .sendTransaction({
              from: account,
            });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const revert = async () => {
    if (space === "CORE") {
      try {
        if (!coreAccount) await connectWallet(connectFluent);
        if (coreAccount) sendTransaction(coreAccount);
      } catch (err) {
        console.log(err);
      }
    }
    if (space === "EVM") {
      await connectWallet(connectMetaMask);
      if (evmAccount) sendTransaction(evmAccount);
    }
  };
  //@ts-ignore
  if (space === "CORE" && !window.conflux) {
    return <p>Install fluent wallet to continue</p>;
  }
  //@ts-ignore
  if (space === "EVM" && !window.ethereum) {
    return <p>Install Metamask wallet to continue</p>;
  }
  const isSameAddresses =
    (coreAccount && isSameAddress(addressInput, coreAccount)) ||
    (evmAccount && isSameAddress(addressInput, evmAccount));

  const approveLabel = tokenId ? "Approve" : "Approve all";
  const revokeLabel = tokenId ? "Revoke" : "Revoke all";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full">
        {(space === "CORE" && coreAccount) ||
        (space === "EVM" && evmAccount) ? (
          <div className="flex w-full">
            <div className="w-4/5 text-center">
              <p className="text-lg font-semibold text-blue-500">
                {allowance === false || allowance === 0 ? "0" : "∞"}
              </p>
            </div>
            {isSameAddresses ? (
              <button
                type="button"
                onClick={() => revert()}
                disabled={!contractAddress || !tokenAddress}
                className={`${
                  allowance === false || allowance === 0
                    ? "bg-green-500"
                    : "bg-red-500"
                }  w-44 text-center px-4 py-2 text-sm font-semibold leading-6 text-white rounded-md shadow`}
              >
                {allowance === false || allowance === 0
                  ? approveLabel
                  : revokeLabel}
              </button>
            ) : (
              <p>You're not the owner of this address</p>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => connectWallet()}
            className={`inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 text-white ${
              space === "CORE" ? "bg-violet-400" : "bg-orange-400"
            } rounded-md shadow`}
          >
            Connect {space === "CORE" ? "Fluent" : "Metamask"}
          </button>
        )}
      </div>
    </div>
  );
};
