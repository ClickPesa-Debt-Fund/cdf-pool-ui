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
import Info from "@/components/other/info";

const AdminPosition = () => {
  const { connected, connect } = useWallet();
  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const [openBorrowModal, setOpenBorrowModal] = useState(false);
  const [openRepayModal, setOpenRepayModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const safePoolId =
    typeof POOL_ID == "string" && /^[0-9A-Z]{56}$/.test(POOL_ID) ? POOL_ID : "";
  const { data: pool } = usePool(safePoolId, true);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: userPoolData } = usePoolUser(pool);

  const assetToBase = poolOracle?.getPriceFloat(USDC_ASSET_ID);

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

  const curPositionsEstimate =
    pool && poolOracle && userPoolData
      ? PositionsEstimate.build(pool, poolOracle, userPoolData.positions)
      : undefined;

  let userAvailableAmountToBorrow = 0;

  if (curPositionsEstimate && reserve && assetToBase) {
    let to_bounded_hf =
      (curPositionsEstimate?.totalEffectiveCollateral -
        curPositionsEstimate?.totalEffectiveLiabilities *
          reserve?.getLiabilityFactor()) /
      reserve?.getLiabilityFactor();

    userAvailableAmountToBorrow = Math.min(
      to_bounded_hf / (assetToBase * reserve.getLiabilityFactor()),
      reserve.totalSupplyFloat() *
        (FixedMath.toFloat(BigInt(reserve.config.max_util), 7) - 0.01) -
        reserve.totalLiabilitiesFloat()
    );
  }

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
              // @ts-ignore
              title={
                <span className="inline-flex items-center gap-2">
                  Supplied Collateral{" "}
                  <Info message="Your supply in USD added to the pool" />
                </span>
              }
              content={
                <span className="text-font-semi-bold">
                  {nFormatter(
                    poolUser?.[0]?.assetFloat || 0,
                    reserve?.config.decimals
                  )}{" "}
                  CPYT
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            {poolUser && reserve && (
              <DetailContentItem
                title="Total Owed"
                content={
                  <span className="text-font-semi-bold">
                    $
                    {nFormatter(
                      userPoolData?.getLiabilitiesFloat(reserve) || 0,
                      reserve?.config.decimals
                    )}
                  </span>
                }
                style={{
                  marginTop: 0,
                }}
              />
            )}
            <DetailContentItem
              // @ts-ignore
              title={
                <span className="inline-flex items-center gap-2">
                  Maximum Borrow Cap{" "}
                  <Info
                    message={`Your maximum that can be borrowed by with supplied ${COLLATERAL_ASSET_CODE}`}
                  />
                </span>
              }
              content={
                <span className="text-font-semi-bold">
                  ${nFormatter(userEst?.borrowCap || 0, 7)}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Available To Borrow"
              content={
                <span className="text-font-semi-bold">
                  ${nFormatter(availableToBorrow, reserve?.config.decimals)}
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Your Available To Borrow"
              content={
                <span className="text-font-semi-bold">
                  $
                  {nFormatter(
                    userAvailableAmountToBorrow,
                    reserve?.config.decimals
                  )}
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
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenWithdrawModal(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenWithdrawModal(true);
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
            Withdraw
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
      <TransactModal
        asset={COLLATERAL_ASSET_CODE}
        type={"WithdrawCollateral"}
        title={`Withdraw ${COLLATERAL_ASSET_CODE}`}
        open={openWithdrawModal}
        close={() => setOpenWithdrawModal(false)}
      />
    </div>
  );
};

export default AdminPosition;
