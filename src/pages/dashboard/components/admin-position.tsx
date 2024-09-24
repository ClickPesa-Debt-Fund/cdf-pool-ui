import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";
import { useState } from "react";
import {
  ASSET_ID,
  //  CPYT_ASSET,
  POOL_ID,
} from "@/constants";
import { usePool, usePoolOracle, usePoolUser } from "@/services";
import { FixedMath, PositionsEstimate } from "@blend-capital/blend-sdk";
import Spinner from "@/components/other/spinner";
// import { requiresTrustline } from "@/utils/horizon";
// import { useHorizonAccount } from "../services";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";
import { Button } from "@/components/ui/button";
import { toBalance, toPercentage } from "@/utils/formatter";
import SupplyModal from "../supply";
import BorrowModal from "../borrow";
import RepayModal from "../repay";

const AdminPosition = () => {
  const { connected, connect } = useWallet();
  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const [openBorrowModal, setOpenBorrowModal] = useState(false);
  const [openRepayModal, setOpenRepayModal] = useState(false);
  const safePoolId =
    typeof POOL_ID == "string" && /^[0-9A-Z]{56}$/.test(POOL_ID) ? POOL_ID : "";
  const { data: pool } = usePool(safePoolId, true);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: userPoolData } = usePoolUser(pool);

  const reserve = pool?.reserves.get(ASSET_ID);

  const maxUtilFloat = reserve
    ? FixedMath.toFloat(BigInt(reserve.config.max_util), 7)
    : 1;
  const totalSupplied = reserve ? reserve.totalSupplyFloat() : 0;
  const availableToBorrow = reserve
    ? totalSupplied * maxUtilFloat - reserve.totalLiabilitiesFloat()
    : 0;
  // const emissionsPerAsset =
  //   reserve !== undefined ? reserve.emissionsPerYearPerBorrowedAsset() : 0;

  // const { data: account } = useHorizonAccount();

  if (pool === undefined || userPoolData === undefined) {
    return <Spinner />;
  }

  // const { emissions, claimedTokens } = userPoolData.estimateEmissions(pool);
  // const hasCPYTTrustLine = !requiresTrustline(account, CPYT_ASSET);

  const userEst = poolOracle
    ? PositionsEstimate.build(pool, poolOracle, userPoolData.positions)
    : undefined;

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <h3 className="text-font-semi-bold mb-6">Admin Position</h3>
      <Row gutter={[12, 12]}>
        <Col md={18} span={24}>
          <Row gutter={[12, 12]}>
            <DetailContentItem
              title="Borrow APR"
              content={
                <span className="text-font-semi-bold">
                  {toPercentage(reserve?.borrowApr)}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Liability factor"
              content={
                <span className="text-font-semi-bold">
                  {toPercentage(reserve?.getLiabilityFactor())}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Borrowed"
              content={
                <span className="text-font-semi-bold">
                  ${toBalance(reserve?.totalLiabilitiesFloat())}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Maximum Borrow Cap"
              content={
                <span className="text-font-semi-bold">
                  ${nFormatter(userEst?.borrowCap || 0, 3)}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Available To Borrow"
              content={
                <span className="text-font-semi-bold">
                  ${toBalance(availableToBorrow, reserve?.config.decimals)}
                </span>
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
            Supply Collateral
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenBorrowModal(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenBorrowModal(true);
                  } else {
                    notification.error({
                      message: "Unable to connect wallet.",
                    });
                  }
                });
              }
            }}
          >
            Borrow USDC
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenRepayModal(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenRepayModal(true);
                  } else {
                    notification.error({
                      message: "Unable to connect wallet.",
                    });
                  }
                });
              }
            }}
          >
            Repay
          </Button>
        </Col>
      </Row>
      <SupplyModal
        asset="CPYT"
        open={openSupplyModal}
        close={() => setOpenSupplyModal(false)}
      />
      <BorrowModal
        open={openBorrowModal}
        close={() => setOpenBorrowModal(false)}
      />
      <RepayModal
        open={openRepayModal}
        close={() => setOpenRepayModal(false)}
      />
    </div>
  );
};

export default AdminPosition;