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
  const price2format = BigInt(parseFloat(balance) * parseFloat(price || "0"));
  const prices = formatBalance(
    (price2format || 0)?.toString(),
    decimals || 18,
    false
  );

  return (
    <div className="my-auto TokenBalance">
      <div className="flex justify-center">
        <div className="flex flex-col">
          <p className="text-lg font-semibold">
            {formatBalance(balance?.toString(), decimals || 18, false)}{" "}
            <span className="text-sm font-light text-gray-400">
              ({prices} $)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Erc20TokenBalanceAllowance;
