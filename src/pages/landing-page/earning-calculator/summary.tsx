import { useTheme } from "@/contexts/theme";
import { useWindowSize } from "@/hooks/use-window-size";
import { formatDate } from "@/utils";
import { DetailsRow } from "@clickpesa/components-library.details-row";

const Summary = ({ amount }: { amount: string }) => {
  const { theme } = useTheme();
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
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Duration",
          value: "9 Months",
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Annual Percentage Yield (APR)",
          value: "12%",
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Payback Period",
          value: "Quarterly",
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        amount={{
          label: "Payment Every Quarter",
          value: amountPerQuarter + "",
          currency: "USDC",
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        amount={{
          label: "Total Interest Income",
          value: amountPerQuarter * 3 - Number(amount) + "",
          currency: "USDC",
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        amount={{
          label: "Total Amount",
          value: amountPerQuarter * 3 + "",
          currency: "USDC",
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "First Repayment Date",
          value: formatDate(
            new Date("03-31-2025".replace(/-/g, "/")).toISOString()
          ),
        }}
        mode={theme}
        isMobile={isMobile}
      />
      <DetailsRow
        text={{
          label: "Last Repayment Date",
          value: formatDate(
            new Date("09-30-2025".replace(/-/g, "/")).toISOString()
          ),
        }}
        mode={theme}
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
