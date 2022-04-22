import { formatBalance } from "../../../utils/format";

interface Props {
  symbol: string;
  icon: string;
  balance: string;
  totalSupply?: string;
  decimals: number;
  allowance?: number;
}

function Erc20TokenBalanceAllowance({ balance, decimals }: Props) {
  return (
    <div className="my-auto TokenBalance">
      <div className="flex justify-center">
        <div className="flex flex-col">
          <p className="text-lg font-semibold">
            {formatBalance(balance?.toString(), decimals || 18, true)}{" "}
            <span className="text-sm font-light text-gray-400">
              (
              {formatBalance(
                (balance || 0 * 11)?.toString(),
                decimals || 18,
                true
              ) || 0}{" "}
              $)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Erc20TokenBalanceAllowance;
