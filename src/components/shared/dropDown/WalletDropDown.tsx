import { useRef, useState } from "react";
import {
  useStatus as useFluentStatus,
  useAccount as useFluentAccount,
} from "@cfxjs/use-wallet";
import {
  useStatus as useMetaMaskStatus,
  useAccount as useMetaMaskAccount,
} from "@cfxjs/use-wallet/dist/ethereum";
import { useOnClickOutside } from "../../../hooks/useClickOutside";

interface Props {
  onConnect: () => void;
}

export const WalletDropDown = ({ onConnect }: Props) => {
  const ref = useRef<any>();
  const [isOpen, setIsOpen] = useState(false);
  useOnClickOutside(ref, () => setIsOpen(false));
  const mmStatus = useMetaMaskStatus();
  const fluentStatus = useFluentStatus();
  const mmAccount = useMetaMaskAccount();
  const fluentAccount = useFluentAccount();

  const Label = () => {
    if (mmStatus === "active" || fluentStatus === "active") {
      return (
        <div className="flex">
          <div className="flex items-center">
            <span className="w-3 h-3 pr-2 transform -translate-x-1/2 bg-green-500 rounded-full left-1/2 -bottom-2"></span>
            {mmStatus === "active" && (
              <img
                src="/images/metamask.png"
                alt="metamask"
                className="w-5 mr-2"
              />
            )}
            {fluentStatus === "active" && (
              <img src="/images/fluent.png" alt="fluent" className="w-4" />
            )}
            <svg
              width="30"
              height="30"
              fill="currentColor"
              viewBox="0 0 1792 1792"
              className="pl-4"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z"></path>
            </svg>
          </div>
        </div>
      );
    } else {
      return (
        <span className="text-gray-100 hover:text-white">Connect wallet</span>
      );
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div>
        <button
          onClick={
            fluentAccount || mmStatus
              ? () => setIsOpen(!isOpen)
              : () => onConnect()
          }
          type="button"
          className="w-full px-4 py-2 text-base text-center text-gray-500 transition duration-200 ease-in border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 "
          id="options-menu"
        >
          {Label()}
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-40 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div
            className="py-1 divide-y divide-gray-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className="flex items-center w-full px-4 py-2 text-gray-700 text-md hover:bg-gray-100 hover:text-gray-900 "
              role="menuitem"
              onClick={fluentAccount ? () => null : () => onConnect()}
            >
              <img src="/images/fluent.png" alt="fluent" className="w-5" />
              <span className="flex flex-col">
                <span className="pl-2">
                  {fluentAccount
                    ? `${fluentAccount?.substring(0, 20)}...`
                    : "Not connected"}
                </span>
              </span>
            </button>
            <button
              className="flex items-center w-full px-4 py-2 text-gray-700 text-md hover:bg-gray-100 hover:text-gray-900 "
              role="menuitem"
              onClick={mmAccount ? () => null : () => onConnect()}
            >
              <img src="/images/metamask.png" alt="metamask" className="w-5" />
              <span className="flex flex-col">
                <span className="pl-2">
                  {mmAccount
                    ? `${mmAccount?.substring(0, 20)}...`
                    : "Not connected"}
                </span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
