export interface AppState {
  space?: "CORE" | "EVM";
  hideZeroAllowance: boolean;
  setHideZeroAllowance: (hide: boolean) => void;
  setSpace: (space?: "CORE" | "EVM") => void;
}
