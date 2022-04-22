import { Fragment } from "react";
import {
  connect as connectFluent,
  useAccount as useFluentAccount,
} from "@cfxjs/use-wallet";
import {
  connect as connectMetaMask,
  useAccount as useEvmAccount,
} from "@cfxjs/use-wallet/dist/ethereum";
import { ToastContainer } from "react-toastify";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const WalletModale = ({ visible, onClose }: Props) => {
  const coreAccount = useFluentAccount();
  const evmAccount = useEvmAccount();
  if (!visible) {
    return null;
  }

  const connectWallet = async (connection: () => Promise<void>) => {
    try {
      await connection();
      onClose();
    } catch (err) {
      if ((err as any)?.code === 4001) {
        onClose();
      }
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      <div className="fixed z-40 w-full">
        <div className="relative inset-0 z-40 w-full h-screen overflow-y-auto">
          <div className="absolute inset-0 w-full h-full bg-gray-500 opacity-75"></div>
          <div className="relative flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            ></span>

            <div
              className="relative inline-block overflow-hidden transition-all transform sm:align-middle sm:max-w-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="absolute right-4 top-4">
                <button
                  className="bg-transparent border border-transparent"
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-700"
                    viewBox="0 0 1792 1792"
                  >
                    <path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"></path>
                  </svg>
                </button>
              </div>
              <div>
                <div className="p-8 bg-white rounded-lg shadow">
                  <div className="bg-white">
                    <div className="z-20 flex w-full gap-6 px-4 py-12 mx-auto text-center sm:px-6 lg:py-16 lg:px-8">
                      <WalletButton
                        disabled={
                          Boolean(coreAccount) || !(window as any).conflux
                        }
                        noProvider={!(window as any).conflux}
                        img="/images/fluent.png"
                        title="Fluent"
                        onClick={() => connectWallet(connectFluent)}
                      />

                      <WalletButton
                        disabled={
                          Boolean(evmAccount) || !(window as any).ethereum
                        }
                        noProvider={!(window as any).ethereum}
                        img="/images/metamask.png"
                        title="Metamask"
                        onClick={() => connectWallet(connectMetaMask)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

interface WalletButtonProps {
  title: string;
  img: string;
  disabled?: boolean;
  noProvider?: boolean;
  onClick: () => void;
}

const WalletButton = ({
  title,
  img,
  onClick,
  disabled,
  noProvider,
}: WalletButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`flex flex-col relative items-center px-12 py-8 bg-white border-2 rounded-md hover:bg-gray-100 ${
        disabled ? "opacity-30" : ""
      }`}
      onClick={onClick}
    >
      <img src={img} alt="wallet" className="w-28"></img>
      {!noProvider && <span className="mt-6 text-lg">{title}</span>}
      {disabled && !noProvider && (
        <div className="absolute flex items-center bottom-2">
          <span className="w-3 h-3 pr-2 transform -translate-x-1/2 bg-green-500 rounded-full left-1/2 -bottom-2"></span>
          <span className=" text-md">Connected</span>
        </div>
      )}
      {noProvider && (
        <div className="flex items-start w-full mt-3">
          <span className="text-md">Extension not installed</span>
        </div>
      )}
    </button>
  );
};
