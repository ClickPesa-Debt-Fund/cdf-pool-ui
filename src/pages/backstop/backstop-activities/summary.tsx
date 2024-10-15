import { useTheme } from "@/contexts/theme";
import { formatAmount } from "@/utils";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import Row from "antd/lib/row";

const Summary = ({
  type,
}: {
  walletAddress?: string;
  type: "DEPOSIT" | "WITHDRAW" | "q4w";
}) => {
  const { theme } = useTheme();
  return (
    <div className="my-4">
      <Row gutter={[12, 12]} justify={"space-between"}>
        {type === "DEPOSIT" && (
          <DetailContentItem
            title="Current deposit"
            content={
              <span className="text-font-semi-bold">
                {formatAmount(120000, 7)} BLND-USDC LP
              </span>
            }
            style={{
              marginTop: 0,
            }}
            mode={theme}
          />
        )}
        {type === "DEPOSIT" && (
          <DetailContentItem
            title="Total deposit"
            content={
              <span className="text-font-semi-bold">
                {formatAmount(12000, 7)} BLND-USDC LP
              </span>
            }
            style={{
              marginTop: 0,
            }}
            mode={theme}
          />
        )}
        {type === "WITHDRAW" && (
          <DetailContentItem
            title="Total Withdraw"
            content={
              <span className="text-font-semi-bold">
                {formatAmount(240000, 7)} BLND-USDC LP
              </span>
            }
            style={{
              marginTop: 0,
            }}
            mode={theme}
          />
        )}
      </Row>
    </div>
  );
};

export default Summary;
