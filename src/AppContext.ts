import React from "react";
import { AppState } from "./AppState";

export default React.createContext<AppState>({
  space: undefined,
  hideZeroAllowance: true,
  setHideZeroAllowance: (hide: boolean) => {},
  setSpace: (space?: "CORE" | "EVM") => {},
});
