import { useWindowSize } from "@/hooks/use-window-size";
import { formatDate } from "@/utils";
import { DetailsRow } from "@clickpesa/components-library.details-row";

const Summary = ({ amount }: { amount: string }) => {
  const amountPerQuarter = PMT(Number(amount));

  const { width } = useWindowSize();
  const isMobile = width <= 767;

  return (
    <div>
      <DetailsRow
        amount={{
          currency: "USDC",
          value: amount,
          label: "Amount",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Duration",
          value: "9 Months",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Annual Percentage Yield (APY)",
          value: "12%",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Payback Period",
          value: "Quarterly",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        amount={{
          label: "Payment Every Quarter",
          value: amountPerQuarter + "",
          currency: "USDC",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        amount={{
          label: "Total Interest Income",
          value: amountPerQuarter * 3 - Number(amount) + "",
          currency: "USDC",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        amount={{
          label: "Total Amount",
          value: amountPerQuarter * 3 + "",
          currency: "USDC",
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "First Repayment Date",
          value: formatDate(new Date("03-31-2025").toISOString()),
        }}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Last Repayment Date",
          value: formatDate(new Date("09-30-2025").toISOString()),
        }}
        isMobile={isMobile}
      />
    </div>
  );
};

export const PMT = (
  principal: number,
  r: number = 0.03,
  n: number = 3
): number => {
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

export default Summary;
