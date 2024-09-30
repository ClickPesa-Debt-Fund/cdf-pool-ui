import { POOL_ID } from "@/constants";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
} from "@/pages/dashboard/services";
import { FixedMath } from "@blend-capital/blend-sdk";
import Q4wItem from "./q4w-item";

const Q4w = () => {
  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: backstopUserData } = useBackstopPoolUser(POOL_ID);

  if (
    backstop === undefined ||
    backstopUserData === undefined ||
    backstopPoolData === undefined ||
    (backstopUserData.balance.totalQ4W == BigInt(0) &&
      backstopUserData.balance.unlockedQ4W == BigInt(0))
  ) {
    return <></>;
  }

  const sharesToTokens =
    Number(backstopPoolData.poolBalance.tokens) /
    Number(backstopPoolData.poolBalance.shares);
  return (
    <div className="space-y-6">
      {backstopUserData.balance.unlockedQ4W == BigInt(0) &&
      !backstopUserData.balance.q4w?.length ? (
        <p>No Wiathdraw Queue added yet!</p>
      ) : null}
      {backstopUserData.balance.unlockedQ4W != BigInt(0) && (
        <Q4wItem
          key={0}
          q4w={{ exp: BigInt(0), amount: backstopUserData.balance.unlockedQ4W }}
          inTokens={
            FixedMath.toFloat(backstopUserData.balance.unlockedQ4W) *
            sharesToTokens
          }
          first={true}
        />
      )}
      {backstopUserData.balance.q4w
        .sort((a, b) => Number(a.exp) - Number(b.exp))
        .map((q4w, index) => (
          <Q4wItem
            key={Number(q4w.exp)}
            q4w={q4w}
            inTokens={FixedMath.toFloat(q4w.amount) * sharesToTokens}
            first={
              backstopUserData.balance.unlockedQ4W == BigInt(0) && index == 0
            }
          />
        ))}
    </div>
  );
};

export default Q4w;
