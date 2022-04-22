import { Conflux } from "js-conflux-sdk";

export const useConflux = (): {
  conflux: Conflux;
  confluxEVM: Conflux;
} => {
  // initialize a Conflux object
  const conflux = new Conflux({
    url: "https://main.confluxrpc.com",
    networkId: 1029, // networkId is also need to pass
  });

  const confluxEVM = new Conflux({
    url: "https://evm.confluxrpc.com",
    networkId: 1030, // networkId is also need to pass
  });

  return {
    conflux,
    confluxEVM,
  };
};
