import { formatBalance } from "../../../utils/format";

interface Props {
  symbol: string;
  balance: string;
  totalSupply?: string;
  decimals: number;
  price?: string;
  allowance?: number;
}

function Erc20TokenBalanceAllowance({ balance, decimals, price }: Props) {
  const prices =
    parseFloat(price || "1") *
    parseFloat(
      formatBalance((balance || 0 * 11)?.toString(), decimals || 18, false) ||
        "0"
    );

  return (
    <div className="my-auto TokenBalance">
      <div className="flex justify-center">
        <div className="flex flex-col">
          <p className="text-lg font-semibold">
            {formatBalance(balance?.toString(), decimals || 18, false)}{" "}
            <span className="text-sm font-light text-gray-400">
              ({prices.toFixed(2)} $)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Erc20TokenBalanceAllowance;
