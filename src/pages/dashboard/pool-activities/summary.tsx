import { COLLATERAL_ASSET_CODE } from "@/constants";
import { toBalance } from "@/utils/formatter";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import Row from "antd/lib/row";

const Summary = ({}: { walletAddress?: string }) => {
  return (
    <div>
      <Row gutter={[12, 12]} justify={"space-between"}>
        <DetailContentItem
          title="Current borrowed funds"
          content={
            <span className="text-font-semi-bold">${toBalance(120000, 7)}</span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Current borrowed funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(12000, 7)} {COLLATERAL_ASSET_CODE}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total borrowed funds"
          content={
            <span className="text-font-semi-bold">${toBalance(240000, 7)}</span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total borrowed funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(24000, 7)} {COLLATERAL_ASSET_CODE}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total repaid funds"
          content={
            <span className="text-font-semi-bold">${toBalance(240000, 7)}</span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total repaid funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(24000, 7)} {COLLATERAL_ASSET_CODE}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total supplied funds"
          content={
            <span className="text-font-semi-bold">${toBalance(240000, 7)}</span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total supplied funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(24000, 7)} {COLLATERAL_ASSET_CODE}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Current supplied funds"
          content={
            <span className="text-font-semi-bold">${toBalance(240000, 7)}</span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Current supplied funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(24000, 7)} {COLLATERAL_ASSET_CODE}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total withdrawn funds"
          content={
            <span className="text-font-semi-bold">${toBalance(240000, 7)}</span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Total withdrawn funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(24000, 7)} {COLLATERAL_ASSET_CODE}
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
