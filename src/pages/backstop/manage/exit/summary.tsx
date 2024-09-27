import { Gasicon } from "@/assets/icons";
import { DetailsRow } from "@/components/other/details-row";
import { toBalance } from "@/utils/formatter";
import { SorobanRpc } from "@stellar/stellar-sdk";

const Summary = ({
  amount,
  currency,
  simResponse,
  minBLNDOut,
  minUSDCOut,
  lpBalance,
  usdcBalance,
  blndBalance,
  decimals,
}: {
  amount: string | number;
  currency: string;
  simResponse: SorobanRpc.Api.SimulateTransactionResponse | undefined;
  minBLNDOut: number;
  minUSDCOut: number;
  lpBalance?: bigint;
  usdcBalance?: string | number;
  blndBalance?: string | number;
  decimals?: number;
}) => {
  return (
    <div className="mb-6">
      <DetailsRow
        amount={{
          label: "Amount to Borrow",
          value: amount?.toString(),
          currency: currency as any,
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
          value: `${toBalance(
            BigInt((simResponse as any)?.minResourceFee ?? 0),
            decimals
          )}`,
          currency: currency as any,
        }}
      />
      <DetailsRow
        exchangeRate={{
          label: "Your LP tokens",
          start: {
            value: (Number(lpBalance) / 10 ** 7)?.toString() || "",
            currency: "BLND-USDC LP" as any,
            digits: 7,
          },
          end: {
            value: lpBalance
              ? // @ts-ignore
                (Number(lpBalance) / 10 ** 7 - amount).toString()
              : "",
            currency: "BLND-USDC LP" as any,
            digits: 7,
          },
        }}
      />
      <DetailsRow
        amount={{
          label: "Min BLND to withdraw",
          value: minBLNDOut.toString(),
          currency: "BLND" as any,
        }}
      />
      <DetailsRow
        exchangeRate={{
          label: "Your BLND tokens",
          start: {
            value: blndBalance?.toString() || "",
            currency: "BLND" as any,
            digits: 7,
          },
          end: {
            value: (+(blndBalance || "0") + minBLNDOut).toString(),
            currency: "BLND" as any,
            digits: 7,
          },
        }}
      />
      <DetailsRow
        amount={{
          label: "Min USDC to withdraw",
          value: minUSDCOut.toString(),
          currency: "USDC" as any,
        }}
      />
      <DetailsRow
        exchangeRate={{
          label: "Your USDC tokens",
          start: {
            value: usdcBalance?.toString() || "",
            currency: "USDC" as any,
            digits: 7,
          },
          end: {
            value: (+(usdcBalance || "0") + minUSDCOut).toString(),
            currency: "USC" as any,
            digits: 7,
          },
        }}
      />
    </div>
  );
};

export default Summary;
