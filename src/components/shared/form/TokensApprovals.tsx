import { TokenData, TokenMapping, Transaction } from "../Interfaces";
import { useContext, useEffect, useState } from "react";
import { getFullTokenMapping, removeDoubleItem } from "../../../utils/utils";
import { reqTransactionsAll, reqUserTokens } from "../../../services/httpReq";
import AppContext from "../../../AppContext";
import { ERC1155, ERC20, ERC721 } from "../Abi";
import TokenList from "./TokenList";
import { useConflux } from "../../../hooks/useConflux";

interface Props {
  address?: string;
}

function TokensApprovals({ address }: Props) {
  const [tokenMapping, setTokenMapping] = useState<TokenMapping>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userTokens, setUserTokens] = useState<TokenData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { space } = useContext(AppContext);
  const { conflux } = useConflux();
  const loadData = (address: string) => {
    if (!space) {
      return null;
    }
    setLoading(true);
    Promise.all([
      reqTransactionsAll(address, space),
      reqUserTokens(address, space),
      getFullTokenMapping(1029, "CORE"),
      getFullTokenMapping(1030, "EVM"),
    ])
      .then(async data => {
        setUserTokens(data[1].list);
        setTokenMapping({ ...data[2], ...data[3] });
        removeDoubleItem(
          data[0].list.filter(
            tx =>
              tx.method === "approve(address,uint256)" ||
              tx.method === "setApprovalForAll(address,bool)"
          ),
          space,
          conflux
        )
          .then(txs => {
            setTransactions(txs);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setUserTokens([]);
    setTokenMapping(undefined);
    setTransactions([]);
    if (address) {
      loadData(address);
    }
  }, [address]);

  const [openTab, setOpenTab] = useState(1);

  const erc20tx = transactions.filter(
    tx => tx.toTokenInfo.tokenType === "ERC20"
  );
  const erc721tx = transactions.filter(
    tx => tx.toTokenInfo.tokenType === "ERC721"
  );
  const erc1155tx = transactions.filter(
    tx => tx.toTokenInfo.tokenType === "ERC1155"
  );

  return (
    <div className="flex flex-wrap mb-40">
      <div className="w-full">
        <ul
          className="flex flex-row flex-wrap pt-3 pb-4 mb-0 list-none"
          role="tablist"
        >
          <li className="flex-auto text-center last:mr-0">
            <a
              className={
                "text-xs font-bold rounded-l-md uppercase px-5 py-3 shadow-lg block leading-normal " +
                (openTab === 1
                  ? "text-blue-500 border-b-2 bg-white border-blue-600"
                  : "text-slate-600 bg-gray-200 hover:bg-white hover:border-b-2 border-blue-600")
              }
              onClick={e => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              ERC20
            </a>
          </li>
          <li className="flex-auto text-center last:mr-0">
            <a
              className={
                "text-xs font-bold uppercase px-5 py-3 shadow-lg block leading-normal " +
                (openTab === 2
                  ? "text-blue-500 border-b-2 bg-white border-blue-600"
                  : "text-slate-600 bg-gray-200 hover:bg-white hover:border-b-2 border-blue-600")
              }
              onClick={e => {
                e.preventDefault();
                setOpenTab(2);
              }}
              data-toggle="tab"
              href="#link2"
              role="tablist"
            >
              ERC-721
            </a>
          </li>
          <li className="flex-auto text-center last:mr-0">
            <a
              className={
                "text-xs font-bold uppercase rounded-r-md px-5 py-3 shadow-lg block leading-normal " +
                (openTab === 3
                  ? "text-blue-500 border-b-2 bg-white border-blue-600"
                  : "text-slate-600 bg-gray-200 hover:bg-white hover:border-b-2 border-blue-600")
              }
              onClick={e => {
                e.preventDefault();
                setOpenTab(3);
              }}
              data-toggle="tab"
              href="#link3"
              role="tablist"
            >
              ERC-1155
            </a>
          </li>
        </ul>
        <div className="relative flex flex-col w-full min-w-0 mb-6 overflow-hidden break-words bg-white rounded shadow-lg">
          <div className="flex-auto px-4 py-5 overflow-x-auto">
            <div className="tab-content tab-space">
              <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                <TokenList
                  isLoading={isLoading}
                  userTokens={userTokens}
                  abi={ERC20}
                  transactions={erc20tx}
                  inputAddress={address}
                  tokenMapping={tokenMapping}
                />
              </div>
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <TokenList
                  abi={ERC721}
                  isLoading={isLoading}
                  userTokens={userTokens}
                  transactions={erc721tx}
                  inputAddress={address}
                  tokenMapping={tokenMapping}
                />
              </div>
              <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                <TokenList
                  abi={ERC1155}
                  isLoading={isLoading}
                  userTokens={userTokens}
                  transactions={erc1155tx}
                  inputAddress={address}
                  tokenMapping={tokenMapping}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokensApprovals;
