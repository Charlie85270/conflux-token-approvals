import { useContext, useState } from "react";
import { useConflux } from "../../../hooks/useConflux";
import { ethers } from "ethers";
import { ERC20 } from "../Abi";
import {
  useAccount as useFluentAccount,
  connect as connectFluent,
} from "@cfxjs/use-wallet";
import {
  connect as connectMetaMask,
  useAccount as useEvmAccount,
} from "@cfxjs/use-wallet/dist/ethereum";
import { ToastContainer } from "react-toastify";
import AppContext from "../../../AppContext";
import BigNumber from "bignumber.js";
import { format } from "js-conflux-sdk";
import { isSameAddress } from "../../../utils/utils";
import { formatBalance } from "../../../utils/format";

interface Props {
  spender?: string;
  contractAddress?: string;
  tokenAddress?: string;
  decimal?: number;
  addressInput?: string;
  totalSupply?: string;
  allowance?: string | number | boolean | undefined;
}

export const ManageApprovals = ({
  contractAddress,
  spender,
  decimal,
  addressInput,
  allowance,
  totalSupply,
}: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { conflux } = useConflux();
  const { space } = useContext(AppContext);
  const coreAccount = useFluentAccount();
  const evmAccount = useEvmAccount();

  const totalAllowance =
    typeof allowance === "boolean"
      ? allowance
      : BigInt(parseFloat(totalSupply?.toString() || "0")) <
        BigInt(allowance?.toString() || "0")
      ? -1
      : parseFloat(formatBalance(allowance?.toString(), decimal || 18, true)) <
        1
      ? "<1"
      : formatBalance(allowance?.toString(), decimal || 18, false);
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
      setIsEditMode(true);
    } catch (err: any) {}
  };

  const sendTransaction = async (account: string, amount: number) => {
    if (spender) {
      if (space === "CORE") {
        //@ts-ignore
        conflux.provider = window.conflux;
        const contract = conflux.Contract({
          address: contractAddress,
          abi: ERC20,
        });

        try {
          setIsLoading(true);
          //@ts-ignore
          const tx = await contract.approve(spender, amount).sendTransaction({
            from: account,
          });
          tx.wait().finally(() => {
            setIsLoading(false);
          });
        } catch (err) {
          setIsLoading(false);
        }
      } else {
        //@ts-ignore
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x406",
              rpcUrls: ["https://evm.confluxrpc.com"],
              chainName: "Conflux eSpace",
              nativeCurrency: {
                name: "CFX",
                symbol: "CFX",
                decimals: 18,
              },
              blockExplorerUrls: ["https://evm.confluxscan.io/"],
            },
          ],
        });
        // @ts-ignore
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          format.hexAddress(contractAddress) || "",
          ERC20,
          provider
        );

        const signedContract = contract.connect(signer);
        setIsLoading(true);
        signedContract
          .approve(format.hexAddress(spender), amount.toString())
          .then((tx: any) => {
            tx.wait().finally(() => {
              setIsLoading(false);
            });
          })
          .catch((err: any) => {
            console.log(err);
            setIsLoading(false);
          });
      }
    }
  };

  const manage = async (amount?: number) => {
    if (Number.isNaN(amount) || amount === undefined || isLoading) {
      return null;
    }
    const formatedAmount = new BigNumber(amount)
      .multipliedBy(new BigNumber(10).pow(decimal || 18))
      .toNumber();
    if (space === "CORE") {
      try {
        if (!coreAccount) await connectWallet(connectFluent);
        if (coreAccount) sendTransaction(coreAccount, formatedAmount);
      } catch (err) {
        console.log(err);
      }
    }
    if (space === "EVM") {
      await connectWallet(connectMetaMask);
      if (evmAccount) sendTransaction(evmAccount, formatedAmount);
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
  return (
    <div className="flex flex-col items-center gap-2">
      <ToastContainer />

      <div className="flex w-full">
        {!isEditMode ? (
          <div className="flex items-center justify-between w-full">
            <div className="w-4/5 text-center">
              <p className="text-lg font-semibold text-blue-500">
                {totalAllowance !== -1 && totalAllowance !== false
                  ? totalAllowance
                  : "∞"}
              </p>
            </div>
            <button
              onClick={() => {
                if (
                  (coreAccount && space === "CORE") ||
                  (evmAccount && space === "EVM")
                ) {
                  setIsEditMode(true);
                }
                if (
                  (!coreAccount && space === "CORE") ||
                  (!evmAccount && space === "EVM")
                ) {
                  connectWallet();
                }
              }}
              className="h-10 p-2 text-gray-500 bg-gray-100 border-gray-500 hover:bg-gray-200 hover:text-blue-500 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18px"
                height="18px"
                className="w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.361 2.91158C16.5764 1.69614 18.547 1.69614 19.7625 2.91158L21.0884 4.23753C22.3039 5.45297 22.3039 7.4236 21.0884 8.63904L8.63904 21.0884C8.05536 21.6721 7.26373 22 6.43828 22H2.84882C2.38003 22 2 21.62 2 21.1512V17.5617C2 16.7363 2.32791 15.9446 2.91158 15.361L15.361 2.91158ZM18.5621 4.112C18.0096 3.55952 17.1138 3.55952 16.5614 4.112L14.2351 6.43828L17.5617 9.76491L19.888 7.43863C20.4405 6.88615 20.4405 5.99042 19.888 5.43794L18.5621 4.112ZM16.3613 10.9653L13.0347 7.6387L4.112 16.5614C3.84669 16.8267 3.69764 17.1865 3.69764 17.5617V20.3024H6.43828C6.81349 20.3024 7.17332 20.1533 7.43863 19.888L16.3613 10.9653Z"
                  fill="#030D45"
                />
              </svg>
            </button>
          </div>
        ) : (space === "CORE" && coreAccount) ||
          (space === "EVM" && evmAccount) ? (
          isSameAddresses ? (
            <p>You're not the owner of this address</p>
          ) : (
            <>
              <input
                type="number"
                className="flex-1 w-24 px-4 py-2 text-base text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="0"
                step=".01"
                defaultValue={0}
                min={0}
                value={amount}
                onChange={event => setAmount(parseFloat(event.target.value))}
              />
              <div className="flex w-full">
                <button
                  type="button"
                  disabled={Number.isNaN(amount)}
                  onClick={() => manage(amount)}
                  className={`w-32 text-center flex justify-center ml-2 items-center px-4 py-2 text-sm font-semibold leading-6 text-white transition duration-150 ease-in-out bg-blue-500 rounded-md shadow ${
                    Number.isNaN(amount) && "cursor-not-allowed"
                  } hover:bg-blue-600  ${Number.isNaN(amount) && "opacity-30"}`}
                >
                  {isLoading && (
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="white"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}

                  {isLoading ? "Processing" : "Validate"}
                </button>
              </div>
            </>
          )
        ) : (
          <button
            type="button"
            onClick={() => connectWallet()}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold leading-6 text-white bg-blue-500 rounded"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};
