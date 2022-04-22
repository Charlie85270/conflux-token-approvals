import React, { ChangeEvent, useContext, useState } from "react";
import AppContext from "../../../AppContext";
import { isValidAddress } from "../../../utils/utils";

interface Props {
  search: (address: string, space: "EVM" | "CORE") => void;
}

const AddressInput: React.FC<Props> = ({ search }) => {
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const { setHideZeroAllowance, hideZeroAllowance } = useContext(AppContext);
  const { setSpace } = useContext(AppContext);

  const handleFormInputChanged = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setAddress(event.target.value);
  };

  const submit = () => {
    const { isValid: valid, space } = isValidAddress(address);
    if (!valid) {
      setIsValid(valid);
      return;
    }
    setIsValid(true);
    setSpace(space as "CORE" | "EVM" | undefined);
    search(address, space as "CORE" | "EVM");
  };

  const handleFormAllowanceChanged = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setHideZeroAllowance(event.target.checked);
  };

  return (
    <div className="mb-6">
      <div className="relative flex w-full mb-2 ">
        {isValid === false && address && (
          <p className="absolute text-red-500 -bottom-8">Address is invalid</p>
        )}
        <input
          type="text"
          className={`flex-1 w-4/5 px-4 py-4 text-base text-gray-700 placeholder-gray-400 bg-white border-gray-300 rounded-l-lg shadow appearance-none h-14 focus:outline-none focus:ring-2 focus:border-transparent ${
            isValid === false && address
              ? "border-red-500 border-2"
              : "border-transparent border"
          }`}
          placeholder="Enter the address to check"
          value={address}
          onChange={handleFormInputChanged}
        />

        <button
          type="button"
          onClick={submit}
          className="inline-flex items-center px-8 py-4 text-sm font-semibold leading-6 text-white bg-blue-500 rounded-r-lg shadow hover:to-blue-600 h-14"
        >
          Search
        </button>
      </div>
      <div className="flex items-center justify-center">
        <div className="m-auto">
          <div className="relative inline-block w-10 mr-2 text-center align-middle select-none">
            <input
              type="checkbox"
              name="toggle"
              id="Blue"
              checked={hideZeroAllowance}
              onChange={handleFormAllowanceChanged}
              className="absolute block w-6 h-6 duration-200 ease-in bg-white border-4 rounded-full outline-none appearance-none cursor-pointer checked:bg-blue-500 focus:outline-none right-4 checked:right-0"
            />
            <label
              htmlFor="Blue"
              className="block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer"
            ></label>
          </div>
          <span className="font-medium text-gray-400">Hide 0 allowance</span>
        </div>
      </div>
    </div>
  );
};

export default AddressInput;
