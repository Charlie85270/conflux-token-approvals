import React, { Fragment, useState } from "react";

import { WalletModale } from "../../shared/modale/WalletModale";
import { WalletDropDown } from "../../shared/dropDown/WalletDropDown";

const AppHeader = () => {
  const [showWalletModale, setShowWalletModale] = useState(false);

  return (
    <Fragment>
      <WalletModale
        visible={showWalletModale}
        onClose={() => setShowWalletModale(false)}
      />

      <header className="absolute z-10 flex-none w-full py-4 mx-auto text-sm font-medium leading-6 text-gray-700 bg-transparent bg-white shadow md:px-0">
        <nav aria-label="Global" className="px-4 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-start w-full md:justify-between">
            <img src="White.png" className="w-40" />

            <p className="ml-2 text-xl text-white ">token approvals</p>

            <div className="flex items-center justify-around w-full mt-4 sm:mt-0 sm:w-auto sm:ml-auto">
              <WalletDropDown onConnect={() => setShowWalletModale(true)} />
            </div>
          </div>
        </nav>
      </header>
    </Fragment>
  );
};
export default AppHeader;
