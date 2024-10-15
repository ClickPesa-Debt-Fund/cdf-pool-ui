import { Gasicon } from "@/assets/icons";
import { DetailsRow } from "@/components/other/details-row";
import { POOL_ID } from "@/constants";
import { useTheme } from "@/contexts/theme";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
} from "@/pages/dashboard/services";
import { toBalance } from "@/utils/formatter";
import { BackstopPoolUserEst, FixedMath, Q4W } from "@blend-capital/blend-sdk";
import { SorobanRpc } from "@stellar/stellar-sdk";

const Summary = ({
  amount,
  simResponse,
  decimals = 7,
  parsedSimResult,
}: {
  simResponse: SorobanRpc.Api.SimulateTransactionResponse | undefined;
  amount: string | number;
  decimals?: number;
  parsedSimResult: Q4W | undefined;
}) => {
  const { theme } = useTheme();
  const { data: backstop } = useBackstop();
  const { data: backstopUserData } = useBackstopPoolUser(POOL_ID);
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const sharesToTokens =
    Number(backstopPoolData?.poolBalance.tokens) /
    Number(backstopPoolData?.poolBalance.shares);
  const currentTokensQ4WFloat = backstopUserData
    ? FixedMath.toFloat(backstopUserData.balance.totalQ4W, 7) * sharesToTokens
    : 0;
  const backstopUserEst =
    backstopUserData !== undefined &&
    backstop !== undefined &&
    backstopPoolData !== undefined
      ? BackstopPoolUserEst.build(backstop, backstopPoolData, backstopUserData)
      : undefined;

  return (
    <div className="mb-6">
      <DetailsRow
        amount={{
          label: "Amount to Queue",
          value: amount?.toString(),
          currency: "BLND-USDC LP",
          digits: decimals,
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
          currency: "XLM",
        }}
        mode={theme}
      />
      <DetailsRow
        text={{
          type: "date",
          label: "New queue expiration",
          value: (parsedSimResult
            ? new Date(Number(parsedSimResult.exp) * 1000)
            : new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
          )?.toISOString(),
        }}
        mode={theme}
      />
      <DetailsRow
        exchangeRate={{
          label: "Your total amount queued",
          start: {
            value: currentTokensQ4WFloat?.toString(),
            currency: "BLND-USDC LP",
            digits: 7,
          },
          end: {
            value: (backstopUserEst && parsedSimResult
              ? currentTokensQ4WFloat +
                FixedMath.toFloat(parsedSimResult.amount, 7) * sharesToTokens
              : 0
            )?.toString(),
            currency: "BLND-USDC LP",
            digits: 7,
          },
        }}
        mode={theme}
      />
    </div>
  );
};

export default Summary;
