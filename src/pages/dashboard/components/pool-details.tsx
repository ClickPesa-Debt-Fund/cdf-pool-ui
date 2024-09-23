import { Button } from "@/components/ui/button";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";
import { useState } from "react";
import Supply from "../supply";
import { ArrowUpCircle } from "lucide-react";
import { usePool, usePoolOracle } from "@/services";
import { POOL_ID, STELLER_EXPERT_URL } from "@/constants";
import { PoolEstimate } from "@blend-capital/blend-sdk";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";
import Spinner from "@/components/other/spinner";
import { toCompactAddress } from "@/utils/formatter";

const PoolDetails = () => {
  const { connected, connect } = useWallet();
  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const safePoolId =
    typeof POOL_ID == "string" && /^[0-9A-Z]{56}$/.test(POOL_ID) ? POOL_ID : "";
  const { data: pool, isLoading } = usePool(safePoolId, true);

  const { data: poolOracle } = usePoolOracle(pool);

  const marketSize =
    poolOracle !== undefined && pool !== undefined
      ? PoolEstimate.build(pool.reserves, poolOracle).totalSupply
      : 0;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <h3 className="text-font-semi-bold mb-6">Pool</h3>
      <Row gutter={[12, 12]}>
        <Col md={18} span={24}>
          <Row gutter={[12, 12]}>
            <DetailContentItem
              title="Pool Status"
              content={
                <span className="w-fit flex text-font-semi-bold">
                  <StatusTag name="Active" color="green" />
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="APR"
              content={<span className="text-font-semi-bold">12%</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Supplied Funds"
              content={
                <span className="text-font-semi-bold">
                  {nFormatter(marketSize || 0, 3)} USDC
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Supplied Collateral"
              content={<span className="text-font-semi-bold">28k CPYT</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Borrowed Funds"
              content={<span className="text-font-semi-bold">30.6k USDC</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Repaid Funds"
              content={<span className="text-font-semi-bold">12k USDC</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Number of Participation MFIs"
              content={<span className="text-font-semi-bold">128</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Number of Participation Funders"
              content={<span className="text-font-semi-bold">24</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title={`Pool ${toCompactAddress(pool?.id)}`}
              content={
                <Button
                  className="w-full justify-start gap-4 -ml-4"
                  variant={"link"}
                  onClick={() => {
                    window.open(
                      `${STELLER_EXPERT_URL}/contract/${pool?.id}`,
                      "_blank"
                    );
                  }}
                >
                  View Contract
                  <ArrowUpCircle className="rotate-45" size={14} />
                </Button>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title={`Oracle ${toCompactAddress(pool?.config?.oracle)}`}
              content={
                <Button
                  className="w-full justify-start gap-4 -ml-4"
                  variant={"link"}
                  onClick={() => {
                    window.open(
                      `${STELLER_EXPERT_URL}/contract/${pool?.config?.oracle}`,
                      "_blank"
                    );
                  }}
                >
                  View Contract
                  <ArrowUpCircle className="rotate-45" size={14} />
                </Button>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title={`Admin ${toCompactAddress(pool?.config.admin)}`}
              content={
                <Button
                  className="w-full justify-start gap-4 -ml-4"
                  variant={"link"}
                  onClick={() => {
                    if (pool?.config.admin.charAt(0) === "G") {
                      window.open(
                        `${STELLER_EXPERT_URL}/account/${pool?.config.admin}`,
                        "_blank"
                      );
                    } else {
                      window.open(
                        `${STELLER_EXPERT_URL}/contract/${pool?.config.admin}`,
                        "_blank"
                      );
                    }
                  }}
                >
                  View Contract
                  <ArrowUpCircle className="rotate-45" size={14} />
                </Button>
              }
              style={{
                marginTop: 0,
              }}
            />
          </Row>
        </Col>
        <Col md={6} span={24} className="space-y-4">
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenSupplyModal(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenSupplyModal(true);
                  } else {
                    notification.error({
                      message: "Unable to connect wallet.",
                    });
                  }
                });
              }
            }}
          >
            Supply
          </Button>
        </Col>
      </Row>
      <Supply open={openSupplyModal} close={() => setOpenSupplyModal(false)} />
    </div>
  );
};

export default PoolDetails;
