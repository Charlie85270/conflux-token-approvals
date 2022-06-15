import { useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import "react-toastify/dist/ReactToastify.css";
import AddressInput from "./components/shared/form/AddressInput";
import AppContext from "./AppContext";
import TokensApprovals from "./components/shared/form/TokensApprovals";

function App() {
  const [hideZeroAllowance, setHideZeroAllowance] = useState<boolean>(true);

  const [space, setSpace] = useState<"CORE" | "EVM">();
  const [inputAddress, setInputAddress] = useState<string>();

  const loadUserInfos = async (address: string, space: "EVM" | "CORE") => {
    setInputAddress(address);
  };

  return (
    <AppContext.Provider
      value={{
        space,
        hideZeroAllowance,
        setHideZeroAllowance,
        setSpace,
      }}
    >
      <AppLayout
        title="Conflux token approvals"
        desc="Manage your token approvals on the conflux nextork"
      >
        <div
          className="mb-56 md:mb-20"
          style={{
            backgroundImage: 'url("banner.svg")',
            backgroundPosition: "left",
          }}
        >
          <img
            src="swappiToken.png"
            className="absolute hidden w-28 md:block floatingImg top-52 right-36"
          />
          <img
            src="confluxToken.png"
            className="absolute hidden w-28 md:block floatingImg2 top-20 left-36"
          />
          <div className="relative px-4 mx-auto Dashboard max-w-7xl">
            <div className="px-6 py-32">
              <h1 className="text-5xl font-bold text-center text-white ">
                Manage your token approvals
              </h1>
              <h2 className="px-8 m-2 text-xl text-center text-gray-200">
                Check and verify your tokens approvals on the Core and eSpace of
                the Conflux Network
              </h2>
              <div className="flex items-center justify-center w-full mt-4 text-sm text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  height="30"
                  width="30"
                  viewBox="0 0 24 24"
                  color="neutral4"
                >
                  <path d="M12 2C6.48583 2 2 6.48583 2 12C2 17.5142 6.48583 22 12 22C17.5142 22 22 17.5142 22 12C22 6.48583 17.5142 2 12 2ZM14.215 17.2367C13.6642 17.4533 11.755 18.365 10.655 17.3958C10.3267 17.1075 10.1633 16.7417 10.1633 16.2975C10.1633 15.4658 10.4367 14.7408 10.9292 13C11.0158 12.6708 11.1217 12.2442 11.1217 11.9058C11.1217 11.3217 10.9 11.1667 10.2992 11.1667C10.0058 11.1667 9.68083 11.2708 9.38667 11.3808L9.54917 10.715C10.205 10.4483 11.0283 10.1233 11.7333 10.1233C12.7908 10.1233 13.5692 10.6508 13.5692 11.6542C13.5692 11.9433 13.5192 12.45 13.4142 12.8L12.8058 14.9517C12.68 15.3867 12.4525 16.3458 12.805 16.63C13.1517 16.9108 13.9725 16.7617 14.3775 16.5708L14.215 17.2367ZM13.21 8.66667C12.52 8.66667 11.96 8.10667 11.96 7.41667C11.96 6.72667 12.52 6.16667 13.21 6.16667C13.9 6.16667 14.46 6.72667 14.46 7.41667C14.46 8.10667 13.9 8.66667 13.21 8.66667Z"></path>
                </svg>
                <span className="ml-2 text-center text-white">
                  Conflux tokens approvals is a BETA. Due to technicals
                  limitations some data (old transactions) may not be displayed.
                </span>
              </div>
            </div>
            <div className="absolute w-4/5 m-auto transform -translate-x-1/2 md:w-3/5 left-1/2 -bottom-20">
              <AddressInput search={loadUserInfos} />
            </div>
          </div>
        </div>
        <div className="px-4 mx-auto Dashboard max-w-7xl">
          {inputAddress && <TokensApprovals address={inputAddress} />}
        </div>
      </AppLayout>
    </AppContext.Provider>
  );
}

export default App;
