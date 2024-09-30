import { Gasicon } from "@/assets/icons";
import { DetailsRow } from "@/components/other/details-row";
import { POOL_ID } from "@/constants";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
} from "@/pages/dashboard/services";
import { toBalance } from "@/utils/formatter";
import { BackstopPoolUserEst } from "@blend-capital/blend-sdk";
import { SorobanRpc } from "@stellar/stellar-sdk";

const Summary = ({
  amount,
  simResponse,
  decimals = 7,
  lpBalance,
  parsedSimResult,
}: {
  simResponse: SorobanRpc.Api.SimulateTransactionResponse | undefined;
  parsedSimResult?: bigint;
  amount: string | number;
  lpBalance: string;
  decimals?: number;
}) => {
  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: userBackstopPoolData } = useBackstopPoolUser(POOL_ID);

  const backstopUserEst =
    userBackstopPoolData !== undefined &&
    backstop !== undefined &&
    backstopPoolData !== undefined
      ? BackstopPoolUserEst.build(
          backstop,
          backstopPoolData,
          userBackstopPoolData
        )
      : undefined;

  let sharesToTokens = backstopPoolData
    ? Number(backstopPoolData.poolBalance.tokens) /
      Number(backstopPoolData.poolBalance.shares) /
      1e7
    : 0;
  return (
    <div className="mb-6">
      <DetailsRow
        amount={{
          label: "Amount to Deposit",
          value: amount?.toString(),
          currency: "BLND-USDC LP",
          digits: decimals,
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
          currency: "XLM",
        }}
      />
      <DetailsRow
        exchangeRate={{
          label: "Your LP tokens",
          start: {
            value: Number(lpBalance)?.toString() || "",
            currency: "BLND-USDC LP",
            digits: 7,
          },
          end: {
            value: lpBalance
              ? // @ts-ignore
                (Number(lpBalance) - amount).toString()
              : "",
            currency: "BLND-USDC LP",
            digits: 7,
          },
        }}
      />
      <DetailsRow
        exchangeRate={{
          label: "Your total deposit",
          start: {
            value: Number(backstopUserEst?.tokens || "0")?.toString() || "",
            currency: "BLND-USDC LP",
            digits: 7,
          },
          end: {
            value: (parsedSimResult && backstopUserEst
              ? backstopUserEst.tokens +
                Number(parsedSimResult) * sharesToTokens
              : 0
            ).toString(),
            currency: "BLND-USDC LP",
            digits: 7,
          },
        }}
      />
    </div>
  );
};

export default Summary;
