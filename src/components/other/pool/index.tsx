import { pools } from "@/pages/pools/data";
import { CurrencyLogos } from "@clickpesa/components-library.currency-logos";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import { formatAmount, formatDate } from "@/utils";
import FundingProgress from "../funding-progress";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { ArrowBgIcon } from "@/assets/icons";
import { DetailsRow } from "@clickpesa/components-library.details-row";
import { useWindowSize } from "@/hooks/use-window-size";
import { useState } from "react";
import BuyModal from "./buy";
import WithdrawModal from "./withdraw";
import Modal from "antd/lib/modal";
import { useFlags } from "flagsmith/react";

const Pool = ({
  name,
  status,
  goal,
  raised,
  duration,
  APY,
  payback,
  last_repayment,
  first_repayment,
  issuance_date,
}: (typeof pools)[0]) => {
  const { debtfund_investor_asset } = useFlags(["debtfund_investor_asset"]);
  const [open, setOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 767;

  const asset =
    status === "EARNING" ? "USDC" : (debtfund_investor_asset?.value as any);

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8 flex gap-8 md:flex-row flex-col">
      <div className="self-stretch flex-1 flex flex-col justify-between gap-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 [font-size:_clamp(22px,5vw,32px)] font-bold text-font-bold">
            <CurrencyLogos name={asset} />
            <span className="inline-flex h-[50px] min-w-[50px] bg-[#2775CA]/10 rounded-full justify-center items-center">
              <img
                src="/icons/logo.svg"
                alt=""
                className="md:h-[34px] h-[34px]"
              />
            </span>
            {asset}/{name}
          </div>
          <StatusTag
            name={status}
            color={
              status === "COMPLETED"
                ? "green"
                : status === "RAISING"
                ? "blue"
                : "gold"
            }
          />
        </div>
        <div className="space-y-3">
          <div
            className={cn(
              "flex gap-4 flex-wrap",
              status === "COMPLETED" ? "justify-center" : "justify-between"
            )}
          >
            {status !== "COMPLETED" && (
              <span>
                {status === "EARNING" ? "Earned" : "Raised"}&nbsp;
                {formatAmount(raised, 0)} {asset}
              </span>
            )}
            <span>
              {status === "EARNING"
                ? "Expected Earnings"
                : status === "COMPLETED"
                ? "Total Earnings"
                : "Goal"}
              &nbsp;
              {formatAmount(goal, 0)} {asset}
            </span>
          </div>
          <FundingProgress
            goal={goal}
            collected={raised}
            showText={false}
            currency={asset}
          />
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                setOpen(true);
              }}
              className="flex-1"
            >
              {status === "COMPLETED"
                ? "Withdraw Your Earnings"
                : status === "RAISING"
                ? "Participate"
                : "Track Your Earnings"}
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setContractOpen(true);
              }}
              className="flex-1 border-primary text-primary gap-2"
            >
              Verify Pool Contract <ArrowBgIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="self-stretch flex-1">
        <DetailsRow
          text={{
            label: "Duration",
            value: duration + " Months",
          }}
          isMobile={isMobile}
        />
        <DetailsRow
          text={{
            label: "Annual Percentage Yield (APY)",
            value: APY + "%",
          }}
          isMobile={isMobile}
        />
        <DetailsRow
          text={{
            label: "Payback Period",
            value: payback,
          }}
          isMobile={isMobile}
        />
        <DetailsRow
          text={{
            label: "First Repayment Date",
            value: formatDate(first_repayment),
          }}
          isMobile={isMobile}
        />
        <DetailsRow
          text={{
            label: "Last Repayment Date",
            value: formatDate(last_repayment),
          }}
          isMobile={isMobile}
        />
        <DetailsRow
          text={{
            label: "Issuance Date",
            value: formatDate(issuance_date),
          }}
          isMobile={isMobile}
        />
      </div>
      {status === "RAISING" && (
        <BuyModal close={() => setOpen(false)} open={open} />
      )}
      {status === "COMPLETED" && (
        <WithdrawModal close={() => setOpen(false)} open={open} />
      )}
      {status === "EARNING" && (
        <Modal open={open} onCancel={() => setOpen(false)} footer={false}>
          <p className="w-fit">
            <StatusTag name="Coming Soon" color="gold" />
          </p>
        </Modal>
      )}
      <Modal
        open={contractOpen}
        onCancel={() => setContractOpen(false)}
        footer={false}
      >
        <p className="w-fit">
          <StatusTag name="Coming Soon" color="gold" />
        </p>
      </Modal>
    </div>
  );
};

export default Pool;
