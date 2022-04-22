import { substring } from "../../../utils/utils";
import Erc20TokenBalanceAllowance from "../form/TokenBalanceAllowance";
import { ManageAllApprovals } from "../form/ManageAllApprovals";
import { ManageApprovals } from "../form/ManageApprovals";
import { TokenInfos } from "../Interfaces";

interface Props {
  tokens: TokenInfos[];
  addressInput: string;
}

export const TokenTable = ({ tokens, addressInput }: Props) => {
  const headers = [
    { name: "Txn Hash" },
    { name: "Contract" },
    { name: "Approved Spender" },
    { name: "Token" },
    { name: "Balance" },
    {
      name: "Managed amount",
      tooltip:
        "You can set/revoke the total amount allowed to be managed by a contract on a given token. Revoke will set the amount to 0.",
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
                  href={`https://www.confluxscan.io/transaction/${token.transaction?.hash}`}
                  target="_blank"
                  className="relative block text-gray-700 hover:underline"
                >
                  {substring(20, token.transaction?.hash || "")}
                </a>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <a
                  rel="noreferrer"
                  href={`https://www.confluxscan.io/address/${token.transaction?.to}`}
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
                <a
                  rel="noreferrer"
                  href={`https://www.confluxscan.io/address/${token?.spender?.address}`}
                  target="_blank"
                  className="relative block text-gray-700 hover:underline"
                >
                  {token?.spender?.name ||
                    substring(20, token?.spender?.address || "")}
                </a>
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                <a
                  rel="noreferrer"
                  href={`https://www.confluxscan.io/token/${token?.transaction?.toTokenInfo?.address}`}
                  target="_blank"
                  className="relative block text-gray-700 hover:underline"
                >
                  {token.transaction?.toTokenInfo.symbol ||
                    token.transaction?.toTokenInfo.name}
                </a>
              </td>
              <td className="px-5 py-5 text-sm text-center bg-white border-b border-gray-200">
                <Erc20TokenBalanceAllowance
                  symbol={token.name || token.symbol || ""}
                  icon={token.icon || ""}
                  balance={token?.balance?.toString() || "0"}
                  decimals={token.decimals || 18}
                />
              </td>
              <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                {token.isApprovalsForAll ? (
                  <ManageAllApprovals
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
