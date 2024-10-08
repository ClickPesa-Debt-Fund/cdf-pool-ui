import { Gasicon } from "@/assets/icons";
import { DetailsRow } from "@/components/other/details-row";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";
import { toBalance } from "@/utils/formatter";
import { PoolUser, Positions, Reserve } from "@blend-capital/blend-sdk";
import { SorobanRpc } from "@stellar/stellar-sdk";

const WithdrawSummary = ({
  amount,
  simResponse,
  parsedSimResult,
  decimals,
  reserve,
  poolUser,
  curBorrowCap,
  nextBorrowCap,
  curBorrowLimit,
  nextBorrowLimit,
}: {
  amount: string;
  simResponse: SorobanRpc.Api.SimulateTransactionResponse | undefined;
  parsedSimResult: Positions | undefined;
  decimals: number;
  reserve?: Reserve;
  poolUser?: PoolUser;
  curBorrowCap?: number;
  nextBorrowCap?: number;
  curBorrowLimit?: number;
  nextBorrowLimit?: number;
}) => {
  const { walletAddress } = useWallet();
  const newPoolUser =
    parsedSimResult && new PoolUser(walletAddress, parsedSimResult, new Map());
  const symbol = (reserve?.tokenMetadata.symbol ?? "USDC") as any;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-font-semi-bold text-lg">Transaction Overview</p>
        <div>
          <DetailsRow
            amount={{
              label: "Amount to supply",
              value: amount,
              currency: "USDC",
            }}
          />
          <DetailsRow
            amount={{
              // @ts-ignore
              label: (
                <>
                  <Gasicon /> Gas
                </>
              ),
              value: `${
                toBalance(
                  BigInt((simResponse as any)?.minResourceFee ?? 0),
                  decimals
                ) || 0
              }`,
              currency: "XLM",
              digits: 2,
            }}
          />
          {reserve && (
            <DetailsRow
              exchangeRate={{
                label: "Withdraw Amount",
                start: {
                  currency: symbol,
                  value: `${nFormatter(
                    poolUser?.getCollateralFloat(reserve) || 0,
                    decimals
                  )}`,
                },
                end: {
                  currency: symbol,
                  value: `${nFormatter(
                    newPoolUser?.getCollateralFloat(reserve) || 0,
                    decimals
                  )}`,
                },
              }}
            />
          )}
          <DetailsRow
            exchangeRate={{
              label: "Borrow capacity",
              start: {
                value: `${curBorrowCap}`,
                currency: symbol,
              },
              end: {
                value: `${nextBorrowCap}`,
                currency: symbol,
              },
            }}
          />
          <DetailsRow
            exchangeRate={{
              label: "Borrow limit",
              start: {
                value: `${curBorrowLimit}`,
                currency: "%" as any,
              },
              end: {
                value: `${nextBorrowLimit}`,
                currency: "%" as any,
              },
            }}
          />
        </div>
      </div>
      <Button className="w-full">Continue</Button>
    </div>
  );
};

export default WithdrawSummary;
