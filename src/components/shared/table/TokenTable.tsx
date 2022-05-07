import { substring } from "../../../utils/utils";
import Erc20TokenBalanceAllowance from "../form/TokenBalanceAllowance";
import { ManageAllApprovals } from "../form/ManageAllApprovals";
import { ManageApprovals } from "../form/ManageApprovals";
import { TokenInfos } from "../Interfaces";
import { useContext } from "react";
import AppContext from "../../../AppContext";
import { format } from "js-conflux-sdk";

interface Props {
  tokens: TokenInfos[];
  addressInput: string;
}

export const TokenTable = ({ tokens, addressInput }: Props) => {
  const { space } = useContext(AppContext);
  let scan_url = "https://www.confluxscan.io/";
  if (space === "EVM") {
    scan_url = "https://evm.confluxscan.io/";
  }
  //
  const headers = [
    { name: "Txn Hash" },
    { name: "Contract" },
    { name: "Approved Spender" },
    { name: "Token" },
    { name: "Balance" },
    {
      name: "Managed amount",
      tooltip:
        "For some contracts (cUSDT, cEHT,....), to modify your managed amount it's necessary to revoke it to 0 before.",
    },
  ];

  if (!tokens || tokens.length === 0) {
    return <p>No approvals found</p>;
  }

  return (
    <table className="min-w-full overflow-x-auto leading-normal">
      <thead>
        <tr>
          {headers.map((hd, index) => (
            <th
              key={hd.name + index}
              scope="col"
              className="px-5 py-3 font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200 text-md"
            >
              {hd.name}
              {hd.tooltip && (
                <div className="ml-2 tooltip">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    height="16"
                    width="16"
                    viewBox="0 0 24 24"
                    color="neutral4"
                  >
                    <path d="M12 2C6.48583 2 2 6.48583 2 12C2 17.5142 6.48583 22 12 22C17.5142 22 22 17.5142 22 12C22 6.48583 17.5142 2 12 2ZM14.215 17.2367C13.6642 17.4533 11.755 18.365 10.655 17.3958C10.3267 17.1075 10.1633 16.7417 10.1633 16.2975C10.1633 15.4658 10.4367 14.7408 10.9292 13C11.0158 12.6708 11.1217 12.2442 11.1217 11.9058C11.1217 11.3217 10.9 11.1667 10.2992 11.1667C10.0058 11.1667 9.68083 11.2708 9.38667 11.3808L9.54917 10.715C10.205 10.4483 11.0283 10.1233 11.7333 10.1233C12.7908 10.1233 13.5692 10.6508 13.5692 11.6542C13.5692 11.9433 13.5192 12.45 13.4142 12.8L12.8058 14.9517C12.68 15.3867 12.4525 16.3458 12.805 16.63C13.1517 16.9108 13.9725 16.7617 14.3775 16.5708L14.215 17.2367ZM13.21 8.66667C12.52 8.66667 11.96 8.10667 11.96 7.41667C11.96 6.72667 12.52 6.16667 13.21 6.16667C13.9 6.16667 14.46 6.72667 14.46 7.41667C14.46 8.10667 13.9 8.66667 13.21 8.66667Z"></path>
                  </svg>
                  <span className="tooltiptext">{hd.tooltip}</span>
                </div>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, index) => {
          return (
            <tr key={(token.name || "") + index}>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <a
                  rel="noreferrer"
                  href={`${scan_url}transaction/${token.transaction?.hash}`}
                  target="_blank"
                  className="relative block text-gray-700 hover:underline"
                >
                  {substring(20, token.transaction?.hash || "")}
                </a>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <a
                  rel="noreferrer"
                  href={`${scan_url}address/${token.transaction?.to}`}
                  target="_blank"
                  className="relative flex text-gray-700 hover:underline"
                >
                  <img
                    alt="contract"
                    className="w-4 h-4 mr-2"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC+ElEQVRYR+2WXYhMYRzGn+edWVazkZSS5MJHImKFXJA7WeVKo0Rx4SNfxYw9+3V2duawu2fmzAWlfKbEBblQUpvvIkq04oq1JR9XWi3t+piZ8/511NamNecsB5Fze57zPr//83/f8/6JP/wwbP9kw/451DKLuuJWNmu88ls/VIBkrbVRgBOAkGB/VMmS9vbmznIQoQIkDOsRBcUIudMVuQzitGObW38aoK6ubWxJ3KWAjpVbTASHCDwGcRiCvJAvCDlAxd7YyPE3W1q2fPj2e98EvJ6KqzsgMsGvn+UrZVeEFQtsu+7dYF1ZAM8crr4uIuNAvFcqWqN0qTcIiCu8JJSnUWB3SalquPoUyc2ObR4LBDBgDshHCN8KIXnbnFvOvL6+dTqAnra2hp6EkXnitcOxm1cnc7mYvPnYp6gac3ZTqy/A19hL7jUSn1jBZVLAQSEm+gEkjEwXwSuObW77YYDBlXvmuX1md7LWuhQEIFmbeQ3FK067ueGHAPY2WdN0Qe4AHAMlOwg+gzAmkCMUdDpZc2W5FiQM6xWBG45trk8YmW4IHuSzzfHALUga1lkRiQ9h0stItMZpa7hbHiDTQXAhgPMisglUqbzdlAkMkDAy9ymYpCLcpAV9nhkZKSqtHn17fIYC8TZh0XXPCDCblI5Y5bh16fT2vuEBgD2ObS4PctSCav4tgFRKlF/lLS3ebUQZ0IWWQNKwbojIMj8AgEUVVQtzrY0PPW1oAN4mc12Z7AcgERYWzJt6Ox6Pu6EC+Bl/731oCSQNy7tmF/mBCFFQFViX22d2hZpAbb21SjRn+gIAhVjl6OPp9K73oQL4Gf/yFvwH+CsSSKVOVn74/HKthhoRUezKtjZeC+0YBknAmymkgItCGUnwnmOba34rwFCQwwHooHAGomoVle4PUnEgTYnVWutzUNiSb28++t2hNGHsX0G4F0QwItDCwxERz6sqq+an03velp2K9zZZU6Qoi8nwILRmb9WoMVcH/oy+Y/lwCvtZ7RctByg/8/PeZAAAAABJRU5ErkJggg=="
                  ></img>{" "}
                  {substring(25, token.name || "")}
                </a>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {token?.spender?.address && (
                  <a
                    rel="noreferrer"
                    href={`${scan_url}address/${
                      space === "EVM"
                        ? format.hexAddress(token?.spender?.address || "")
                        : token?.spender?.address
                    }`}
                    target="_blank"
                    className="relative block text-gray-700 hover:underline"
                  >
                    {token?.spender?.name ||
                      substring(
                        20,
                        space === "EVM"
                          ? format.hexAddress(token?.spender?.address || "")
                          : token?.spender?.address
                      )}
                  </a>
                )}
              </td>
              <td className="flex items-center gap-2 px-5 py-8 text-sm bg-white border-b border-gray-200">
                <img
                  src={
                    token.iconUrl ||
                    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzNweCIgaGVpZ2h0PSIzM3B4IiB2aWV3Qm94PSIwIDAgMzMgMzMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5Ub2tlbnM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aG16Z2iLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnlLvmnb8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NzUuMDAwMDAwLCAtMzEuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJUb2tlbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2My4wMDAwMDAsIDE4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ik1haW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjAwMDAwMCwgMTMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE0LjA5Mzc5NDEsOS42MTI5NjI4NiBDMTMuODI1MTcwNSw5LjIzMjgzNDcgMTMuMzU0NjM0MSw5LjAwMTM2MzM1IDEyLjg0Nzc5NjcsOSBMNC4xNTUyOTU4Niw5IEMzLjY0NTgzNTIxLDguOTk5MTE2MzYgMy4xNzE5MzgxMiw5LjIzMDg3MDA1IDIuOTAxOTI0ODUsOS42MTI5NjI4NyBMMC4yMjU2MTM1MjcsMTMuNDAxNDg4OCBDLTAuMTE4NTc4MzcxLDEzLjg4NjUyMzggLTAuMDY0NzQ2MDY4OCwxNC41MTMzOTYyIDAuMzU4MzIzMzY0LDE0Ljk0Njg4NyBMNy45Mzc1MjYzNCwyMi43NzE3MTM4IEM4LjIwMjE2NjI4LDIzLjA0NTQxMDcgOC42Njc1Njc0MywyMy4wNzc1NDY0IDguOTc3MDMwNTIsMjIuODQzNDkxNiBDOS4wMDYxNTA3MywyMi44MjE0NjcyIDkuMDMzMjg1MzEsMjIuNzk3NDY4NiA5LjA1ODE4NzY5LDIyLjc3MTcxMzggTDE2LjYzNzM5MDcsMTQuOTQ2ODg3IEMxNy4wNjI4MDQxLDE0LjUxNDg3ODIgMTcuMTE5NjMzNywxMy44ODc5MTQzIDE2Ljc3NzQ3MzIsMTMuNDAxNDg4OCBMMTQuMDkzNzk0MSw5LjYxMjk2Mjg2IFoiIGlkPSLot6/lvoQiIGZpbGw9IiNDNEM2RDIiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNi43Nzc2MDcyLDE4LjQ2NTY5MjYgQzI2LjU3MjE4OTIsMTguMTc2ODkzOSAyNi4yMTIzNjczLDE4LjAwMTAzNTggMjUuODI0Nzg1NywxOCBMMTkuMTc3NTc5MiwxOCBDMTguNzg3OTkxNiwxNy45OTkzMjg3IDE4LjQyNTU5OTcsMTguMTc1NDAxMyAxOC4yMTkxMTksMTguNDY1NjkyNiBMMTYuMTcyNTI4LDIxLjM0Mzk4ODIgQzE1LjkwOTMyMjQsMjEuNzEyNDg4OSAxNS45NTA0ODgzLDIyLjE4ODc0OSAxNi4yNzQwMTIsMjIuNTE4MDg5NCBMMjIuMDY5ODczMSwyOC40NjI5MjU0IEMyMi4yNzIyNDQ4LDI4LjY3MDg2NCAyMi42MjgxMzk4LDI4LjY5NTI3ODcgMjIuODY0Nzg4LDI4LjUxNzQ1NzkgQzIyLjg4NzA1NjQsMjguNTAwNzI1MSAyMi45MDc4MDY0LDI4LjQ4MjQ5MjQgMjIuOTI2ODQ5NCwyOC40NjI5MjU0IEwyOC43MjI3MTA1LDIyLjUxODA4OTQgQzI5LjA0ODAyNjYsMjIuMTg5ODc1IDI5LjA5MTQ4NDYsMjEuNzEzNTQ1MiAyOC44Mjk4MzI1LDIxLjM0Mzk4ODIgTDI2Ljc3NzYwNzIsMTguNDY1NjkyNiBaIiBpZD0i6Lev5b6EIiBmaWxsPSIjN0Y4Mjk2IiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjUuNTgwOTM0MiwzLjc0NDMxMjcyIEMyNS4yNjQ5MDY1LDMuMjgyNzI4MTEgMjQuNzExMzM0MywzLjAwMTY1NTQ5IDI0LjExNTA1NSwzIEwxMy44ODg1ODM0LDMgQzEzLjI4OTIxNzksMi45OTg5MjcwMSAxMi43MzE2OTE5LDMuMjgwMzQyNDYgMTIuNDE0MDI5MiwzLjc0NDMxMjc0IEw5LjI2NTQyNzY4LDguMzQ0NjY5ODMgQzguODYwNDk2MDMsOC45MzM2NDE0OSA4LjkyMzgyODE1LDkuNjk0ODQ0MzMgOS40MjE1NTY5LDEwLjIyMTIyNjUgTDE4LjMzODI2NjMsMTkuNzIyODEwNiBDMTguNjQ5NjA3NCwyMC4wNTUxNTcxIDE5LjE5NzEzODIsMjAuMDk0MTc5MSAxOS41NjEyMTI0LDE5LjgwOTk2OTUgQzE5LjU5NTQ3MTQsMTkuNzgzMjI1NSAxOS42MjczOTQ1LDE5Ljc1NDA4NDMgMTkuNjU2NjkxNCwxOS43MjI4MTA2IEwyOC41NzM0MDA4LDEwLjIyMTIyNjUgQzI5LjA3Mzg4NzEsOS42OTY2NDM5NSAyOS4xNDA3NDU2LDguOTM1MzI5ODggMjguNzM4MjAzOCw4LjM0NDY2OTgyIEwyNS41ODA5MzQyLDMuNzQ0MzEyNzIgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzRDNEY2MCIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InNwYXJrIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMTAuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE0LjAwMDAwMCwgNC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtMTQuMDAwMDAwLCAtNC42MDAwMDApICIgeD0iMTAiIHk9IjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjAwMDAwMCwgOC42MDAwMDApIHJvdGF0ZSg0Ny4wMDAwMDApIHRyYW5zbGF0ZSgtNC4wMDAwMDAsIC04LjYwMDAwMCkgIiB4PSIwLjUiIHk9IjgiIHdpZHRoPSI3IiBoZWlnaHQ9IjEuMiIgcng9IjAuNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5LjI1MDAwMCwgMTUuNjAwMDAwKSByb3RhdGUoNDcuMDAwMDAwKSB0cmFuc2xhdGUoLTE5LjI1MDAwMCwgLTE1LjYwMDAwMCkgIiB4PSIxNyIgeT0iMTUiIHdpZHRoPSI0LjUiIGhlaWdodD0iMS4yIiByeD0iMC42Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9IuakreWchuW9oiIgY3g9IjEwIiBjeT0iMC41IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTMiIGN4PSIwLjUiIGN5PSI1IiByPSIxIj48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0i5qSt5ZyG5b2i5aSH5Lu9LTQiIGN4PSIxNi41IiBjeT0iMTIuNSIgcj0iMSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                  }
                  className="w-6"
                />

                <a
                  rel="noreferrer"
                  href={`${scan_url}token/${token?.transaction?.toTokenInfo?.address}`}
                  target="_blank"
                  className="relative block text-gray-700 hover:underline"
                >
                  {token.transaction?.toTokenInfo.symbol ||
                    token.transaction?.toTokenInfo.name}
                </a>
              </td>
              <td className="px-5 py-5 text-sm text-center bg-white border-b border-gray-200">
                <Erc20TokenBalanceAllowance
                  price={token.price}
                  transferType={token.transferType || "ERC20"}
                  symbol={token.name || token.symbol || ""}
                  balance={token?.balance?.toString() || "0"}
                  decimals={token.decimals || 18}
                />
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {token.isApprovalsForAll ? (
                  <ManageAllApprovals
                    allowance={token.allowance}
                    addressInput={addressInput}
                    spender={token.spender?.address}
                    tokenAddress={token.transaction?.toTokenInfo.address}
                    contractAddress={token.transaction?.toContractInfo.address}
                  />
                ) : (
                  <ManageApprovals
                    totalSupply={token.totalSupply || "0"}
                    allowance={token.allowance}
                    addressInput={addressInput}
                    decimal={token.decimals || 18}
                    spender={token.spender?.address}
                    tokenAddress={token.transaction?.toTokenInfo.address}
                    contractAddress={token.transaction?.toContractInfo.address}
                  />
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
