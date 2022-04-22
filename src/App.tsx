import { useEffect, useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import "react-toastify/dist/ReactToastify.css";
import AddressInput from "./components/shared/form/AddressInput";
import AppContext from "./AppContext";
import TokensApprovals from "./components/shared/form/TokensApprovals";

function App() {
  const [hideZeroAllowance, setHideZeroAllowance] = useState<boolean>(false);

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
          className="mb-20"
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
                the conflux network
              </h2>
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
