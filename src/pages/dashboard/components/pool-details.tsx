import { Button } from "@/components/ui/button";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";
import { useState } from "react";
import { ArrowUpCircle } from "lucide-react";
import { usePool, usePoolOracle } from "@/services";
import {
  USDC_ASSET_ID,
  COLLATERAL_ASSET_CODE,
  PARTICIPATING_MFIs,
  POOL_ID,
  STELLER_EXPERT_URL,
  CPYT_ASSET_ID,
} from "@/constants";
import { BackstopPoolEst, PoolEstimate } from "@blend-capital/blend-sdk";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";
import Spinner from "@/components/other/spinner";
import { toCompactAddress, toPercentage } from "@/utils/formatter";
import { useBackstop, useBackstopPool } from "../services";
import TransactModal from "../transact";
import { useNavigate } from "react-router-dom";

const PoolDetails = () => {
  const navigate = useNavigate();
  const { connected, connect } = useWallet();
  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const safePoolId =
    typeof POOL_ID == "string" && /^[0-9A-Z]{56}$/.test(POOL_ID) ? POOL_ID : "";
  const { data: pool, isLoading } = usePool(safePoolId, true);
  const { data: backstop, isLoading: backstopLoading } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(pool?.id || "");
  const { data: poolOracle } = usePoolOracle(pool);

  const reserve = pool?.reserves.get(USDC_ASSET_ID);
  const collateralReserve = pool?.reserves.get(CPYT_ASSET_ID);

  if (isLoading || backstopLoading) {
    return <Spinner />;
  }

  if (!backstop || !backstopPoolData || !pool) {
    return <></>;
  }

  const backstopPoolEst = BackstopPoolEst.build(
    backstop?.backstopToken,
    backstopPoolData?.poolBalance
  );

  const marketSize =
    poolOracle !== undefined && pool !== undefined
      ? PoolEstimate.build(pool.reserves, poolOracle).totalSupply
      : 0;

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <Row gutter={[12, 12]} justify={"space-between"}>
        <Col md={16} span={24}>
          <Row gutter={[12, 12]} justify={"space-between"}>
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
              content={
                <span className="text-font-semi-bold">
                  {toPercentage(
                    Array.from(pool?.reserves.values())?.find(
                      (reserve) =>
                        reserve?.tokenMetadata?.asset?.code === "USDC"
                    )?.borrowApr
                  )}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Supplied Funds"
              content={
                <span className="text-font-semi-bold">
                  ${nFormatter(marketSize || 0, 7)}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Supplied Collateral"
              content={
                <span className="text-font-semi-bold">
                  {nFormatter(collateralReserve?.totalSupplyFloat() || 0, 7)}{" "}
                  {COLLATERAL_ASSET_CODE}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Backstop Size"
              content={
                <div className="flex gap-3 items-center">
                  <span className="text-font-semi-bold">
                    ${nFormatter(backstopPoolEst.totalSpotValue || 0, 3)}
                  </span>
                  <Button
                    className="justify-start gap-4 "
                    variant={"link"}
                    onClick={() => navigate("/dashboard/backstop")}
                  >
                    Backstop
                  </Button>
                </div>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Borrowed Funds"
              content={
                <span className="text-font-semi-bold">
                  ${nFormatter(reserve?.totalLiabilitiesFloat() || 0, 7)}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Repaid Funds"
              content={<span className="text-font-semi-bold">$12k</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Number of Participating MFIs"
              content={
                <span className="text-font-semi-bold">
                  {PARTICIPATING_MFIs}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />

            <DetailContentItem
              title="Number of Participating Funders"
              content={<span className="text-font-semi-bold">24</span>}
              style={{
                marginTop: 0,
              }}
            />
          </Row>
        </Col>
        <Col md={6} span={24} className="space-y-4">
          <DetailContentItem
            title={`Pool`}
            full_width
            content={
              <div>
                <p className="!mb-0">{toCompactAddress(pool?.id)}</p>
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
              </div>
            }
          />
          <DetailContentItem
            title={`Oracle`}
            full_width
            content={
              <div>
                <p className="!mb-0">
                  {toCompactAddress(pool?.config?.oracle)}
                </p>
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
              </div>
            }
          />
          <DetailContentItem
            title={`Admin`}
            full_width
            content={
              <div>
                <p className="!mb-0">{toCompactAddress(pool?.config.admin)}</p>
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
              </div>
            }
          />
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
      <TransactModal
        asset="USDC"
        type={"SupplyCollateral"}
        title="Supply USDC"
        open={openSupplyModal}
        close={() => setOpenSupplyModal(false)}
      />
    </div>
  );
};

export default PoolDetails;
