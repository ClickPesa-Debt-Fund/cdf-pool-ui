import { toBalance } from "@/utils/formatter";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import Row from "antd/lib/row";

const Summary = ({
  type,
}: {
  walletAddress?: string;
  type: "DEPOSIT" | "WITHDRAW" | "q4w";
}) => {
  return (
    <div className="my-4">
      <Row gutter={[12, 12]} justify={"space-between"}>
        {type === "DEPOSIT" && (
          <DetailContentItem
            title="Current deposit"
            content={
              <span className="text-font-semi-bold">
                {toBalance(120000, 7)} BLND-USDC LP
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
        {type === "DEPOSIT" && (
          <DetailContentItem
            title="Total deposit"
            content={
              <span className="text-font-semi-bold">
                {toBalance(12000, 7)} BLND-USDC LP
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
        {type === "WITHDRAW" && (
          <DetailContentItem
            title="Total Withdraw"
            content={
              <span className="text-font-semi-bold">
                {toBalance(240000, 7)} BLND-USDC LP
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
      </Row>
    </div>
  );
};

export default Summary;
