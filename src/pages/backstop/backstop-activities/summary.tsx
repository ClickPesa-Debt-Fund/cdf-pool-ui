import { toBalance } from "@/utils/formatter";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import Row from "antd/lib/row";

const Summary = ({}: { walletAddress?: string }) => {
  return (
    <div className="px-5 mb-4">
      <Row gutter={[12, 12]} justify={"space-between"}>
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
      </Row>
    </div>
  );
};

export default Summary;
