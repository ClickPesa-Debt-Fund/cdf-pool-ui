import Popover from "antd/lib/popover";

import { Button } from "@/components/ui/button";
import { POOL_ID } from "@/constants";
import { useWallet } from "@/contexts/wallet";
import { PoolBackstopActionArgs, Q4W } from "@blend-capital/blend-sdk";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import RoundedProgressBar from "@/components/other/circular-progress-bar";
import { CurrencyLogos } from "@/components/other/currency-logos";
import { toBalance, toTimeSpan } from "@/utils/formatter";

const Q4wItem = ({
  q4w,
  inTokens,
  first,
}: {
  q4w: Q4W;
  inTokens: number;
  first: boolean;
}) => {
  const {
    connected,
    walletAddress,
    backstopDequeueWithdrawal,
    backstopWithdraw,
  } = useWallet();

  const TOTAL_QUEUE_TIME_SECONDS = 21 * 24 * 60 * 60;

  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, Number(q4w.exp) - Math.floor(Date.now() / 1000))
  );
  const [openPopover, setOpenPopover] = useState(false);
  const timeWaitedPercentage = Math.min(
    1,
    1 - timeLeft / TOTAL_QUEUE_TIME_SECONDS
  );

  useEffect(() => {
    const timeInterval =
      Number(q4w.exp) - Math.floor(Date.now() / 1000) > 24 * 60 * 60
        ? 60 * 1000
        : 1000;
    const refreshInterval = setInterval(() => {
      setTimeLeft(Math.max(0, Number(q4w.exp) - Math.floor(Date.now() / 1000)));
    }, timeInterval);
    return () => clearInterval(refreshInterval);
  }, [q4w]);

  const handleClick = async (amount: bigint) => {
    if (connected) {
      let actionArgs: PoolBackstopActionArgs = {
        from: walletAddress,
        pool_address: POOL_ID,
        amount: BigInt(amount),
      };
      if (timeLeft > 0) {
        await backstopDequeueWithdrawal(actionArgs, false);
      } else {
        await backstopWithdraw(actionArgs, false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <CurrencyLogos name="BLND-USDC LP" size="md" />
        <div>
          <p className=" flex items-center gap-1">
            <strong className="text-font-semi-bold text-lg">
              {toBalance(inTokens)}
            </strong>{" "}
            <span>BLND-USDC LP</span>
          </p>
          <p className="flex items-center gap-2 opacity-60">
            {timeLeft > 0 ? (
              <div className="w-[15px]">
                <RoundedProgressBar
                  percent={timeWaitedPercentage * 100}
                  strokeWidth={1.5}
                  diameter={10}
                  ringClassName="text-neutral-200"
                />
              </div>
            ) : null}
            {timeLeft > 0 ? toTimeSpan(timeLeft) : "Unlocked"}
          </p>
        </div>
      </div>
      <Popover
        content={"You can only unqueue the oldest withdrawal"}
        trigger="hover"
        style={{
          width: "100%",
          display: "block",
        }}
        onOpenChange={(newOpen) => {
          if (!first) {
            setOpenPopover(newOpen);
          }
        }}
        open={openPopover}
      >
        {
          <Button
            size={"sm"}
            onClick={() => {
              if (first) {
                handleClick(q4w?.amount);
              }
            }}
            className={cn({
              "opacity-40 cursor-default": !first,
            })}
          >
            {timeLeft > 0 ? "Unqueue" : "Withdraw"}
          </Button>
        }
      </Popover>
    </div>
  );
};

export default Q4wItem;
