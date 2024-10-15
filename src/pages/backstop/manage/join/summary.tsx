import { Gasicon } from "@/assets/icons";
import { DetailsRow } from "@/components/other/details-row";
import { useTheme } from "@/contexts/theme";
import { toBalance } from "@/utils/formatter";
import { SorobanRpc } from "@stellar/stellar-sdk";

const Summary = ({
  amount,
  currency,
  simResponse,
  decimals = 7,
  isJoin,
  maxBLNDIn,
  maxUSDCIn,
  blndBalance,
  usdcBalance,
  lpBalance,
  toMint,
}: {
  amount: string | number;
  currency: string;
  simResponse: SorobanRpc.Api.SimulateTransactionResponse | undefined;
  maxBLNDIn: number;
  maxUSDCIn: number;
  toMint: number;
  lpBalance?: bigint;
  usdcBalance?: string | number;
  blndBalance?: string | number;
  isJoin: boolean;
  decimals?: number;
}) => {
  const { theme } = useTheme();
  return (
    <div className="mb-6">
      <DetailsRow
        amount={{
          label: "Amount",
          value: amount?.toString(),
          currency: currency as any,
        }}
        mode={theme}
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
          currency: "XLM" as any,
        }}
        mode={theme}
      />
      {isJoin && (
        <>
          <DetailsRow
            amount={{
              label: "Max BLND to deposit",
              value: maxBLNDIn.toString(),
              currency: "BLND" as any,
            }}
            mode={theme}
          />
          <DetailsRow
            exchangeRate={{
              label: "Your BLND tokens",
              start: {
                value: blndBalance?.toString() || "",
                currency: "BLND" as any,
                digits: decimals,
              },
              end: {
                value: (+(blndBalance || "0") - maxBLNDIn).toString(),
                currency: "BLND" as any,
                digits: decimals,
              },
            }}
            mode={theme}
          />
          <DetailsRow
            amount={{
              label: "Max USDC to deposit",
              value: maxUSDCIn.toString(),
              currency: "USDC" as any,
            }}
            mode={theme}
          />
          <DetailsRow
            exchangeRate={{
              label: "Your USDC tokens",
              start: {
                value: usdcBalance?.toString() || "",
                currency: "USDC" as any,
                digits: decimals,
              },
              end: {
                value: (+(usdcBalance || "0") - maxUSDCIn).toString(),
                currency: "USDC",
                digits: decimals,
              },
            }}
            mode={theme}
          />
        </>
      )}
      {!isJoin && (
        <>
          <DetailsRow
            amount={{
              label: "Min BLND-USDC LP tokens minted",
              value: toMint.toString(),
              currency: "BLND-USDC LP" as any,
              digits: decimals,
            }}
            mode={theme}
          />
          <DetailsRow
            exchangeRate={{
              label: "Your LP tokens",
              start: {
                value: (Number(lpBalance) / 10 ** 7)?.toString() || "",
                currency: "BLND-USDC LP" as any,
                digits: decimals,
              },
              end: {
                value: lpBalance
                  ? (Number(lpBalance) / 10 ** 7 + toMint).toString()
                  : toMint.toString(),
                currency: "BLND-USDC LP" as any,
                digits: decimals,
              },
            }}
            mode={theme}
          />
        </>
      )}
    </div>
  );
};

export default Summary;
