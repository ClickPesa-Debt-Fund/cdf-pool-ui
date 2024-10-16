import { formatAmount } from "@/utils";

const FundingProgress = ({
  goal,
  collected,
  currency = "USDC",
  showText = true,
}: {
  goal: number;
  collected: number;
  currency?: string;
  showText?: boolean;
}) => {
  return (
    <div className="space-y-3">
      {showText && (
        <div className="flex justify-between gap-4 flex-wrap">
          <span>
            Raised {formatAmount(collected, 2)} {currency}
          </span>
          <span>
            Goal {formatAmount(goal, 0)} {currency}
          </span>
        </div>
      )}
      <div className="bg-primary/40 w-full h-3 rounded-lg">
        <div
          style={{
            width: (collected / goal) * 100 + "%",
          }}
          className="transition-all bg-primary h-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default FundingProgress;
