import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";
import { useState } from "react";
import { USDC_ASSET_ID, COLLATERAL_ASSET_CODE, POOL_ID } from "@/constants";
import { usePool, usePoolOracle, usePoolUser } from "@/services";
import { FixedMath, PositionsEstimate } from "@blend-capital/blend-sdk";
import Spinner from "@/components/other/spinner";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";
import { Button } from "@/components/ui/button";
import { toPercentage } from "@/utils/formatter";
import TransactModal from "../transact";

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

  const reserve = pool?.reserves.get(USDC_ASSET_ID);

  const maxUtilFloat = reserve
    ? FixedMath.toFloat(BigInt(reserve.config.max_util), 7)
    : 1;
  const totalSupplied = reserve ? reserve.totalSupplyFloat() : 0;
  const availableToBorrow = reserve
    ? totalSupplied * maxUtilFloat - reserve.totalLiabilitiesFloat()
    : 0;

  if (pool === undefined || userPoolData === undefined) {
    return <Spinner />;
  }

  const poolUser = Array.from(pool.reserves.values())
    .filter((reserve) => {
      const bTokens =
        userPoolData.getSupplyBTokens(reserve) +
        userPoolData.getCollateralBTokens(reserve);
      return (
        bTokens > BigInt(0) &&
        reserve?.tokenMetadata?.asset?.code === COLLATERAL_ASSET_CODE
      );
    })
    ?.map((reserve) => {
      const bTokens =
        userPoolData.getSupplyBTokens(reserve) +
        userPoolData.getCollateralBTokens(reserve);
      return {
        assetFloat: reserve.toAssetFromBTokenFloat(bTokens),
      };
    });

  const userEst = poolOracle
    ? PositionsEstimate.build(pool, poolOracle, userPoolData.positions)
    : undefined;

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <h3 className="text-font-semi-bold mb-6">Borrowing Position</h3>
      <Row gutter={[12, 12]} justify={"space-between"}>
        <Col md={16} span={24}>
          <Row gutter={[12, 12]} justify={"space-between"}>
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
              title="Total Supplied Collateral"
              content={
                <span className="text-font-semi-bold">
                  {nFormatter(poolUser?.[0]?.assetFloat || 0, 3)} CPYT
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
                  ${nFormatter(reserve?.totalLiabilitiesFloat() || 0, 3)}
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
                  ${nFormatter(availableToBorrow, reserve?.config.decimals)}
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
            className="w-full border-red-500 hover:border-red-600 text-red-500"
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
            variant={"outline"}
          >
            Borrow USDC
          </Button>
          <Button
            className="w-full border-green-600 text-green-600 hover:border-green-700"
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
            variant={"outline"}
          >
            Repay
          </Button>
        </Col>
      </Row>
      <TransactModal
        asset={COLLATERAL_ASSET_CODE}
        type={"SupplyCollateral"}
        title="Supply Collateral"
        open={openSupplyModal}
        close={() => setOpenSupplyModal(false)}
      />
      <TransactModal
        asset="USDC"
        type={"Borrow"}
        title="Borrow USDC"
        open={openBorrowModal}
        close={() => setOpenBorrowModal(false)}
      />
      <TransactModal
        asset="USDC"
        type={"Repay"}
        open={openRepayModal}
        title="Repay USDC"
        close={() => setOpenRepayModal(false)}
      />
    </div>
  );
};

export default AdminPosition;
