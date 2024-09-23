import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { usePool, usePoolOracle, usePoolUser } from "@/services";
import Spinner from "@/components/other/spinner";
import { PositionsEstimate, Reserve } from "@blend-capital/blend-sdk";
import { Button } from "@/components/ui/button";
import { Alert } from "@clickpesa/components-library.alert";
import { toBalance } from "@/utils/formatter";
import * as formatter from "@/utils/formatter";
import { useState } from "react";
import WithdrawModal from "../withdraw";

const UserPositionDetails = () => {
  const poolId = import.meta.env.VITE_POOL_ID || "";
  const { data: pool } = usePool(poolId);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: poolUser, isLoading } = usePoolUser(pool);

  if (isLoading) {
    return <Spinner />;
  }

  if (
    !pool ||
    !poolUser?.userId ||
    (poolUser.positions.collateral.size === 0 &&
      poolUser.positions.supply.size === 0)
  ) {
    return <></>;
  }

  const poolUserEst =
    poolOracle !== undefined
      ? PositionsEstimate.build(pool, poolOracle, poolUser?.positions)
      : undefined;

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      {/*  */}
      <Alert
        color="green"
        subtitle={
          <div className="flex justify-between gap-6 w-full min-w-full">
            <h3 className="text-font-semi-bold">Your Supplied Position</h3>
            <span>
              Total supplied:&nbsp;
              <b className="text-font-semi-bold">
                {toBalance(poolUserEst?.totalSupplied ?? 0)}
              </b>
            </span>
          </div>
        }
        style={{
          marginBottom: "24px",
        }}
      />
      <Row gutter={[12, 12]}>
        <Col md={24} span={24}>
          <Row gutter={[12, 12]}>
            <Col span={9}>Amount Supplied</Col>
            <Col span={9}>APR</Col>
          </Row>
          {Array.from(pool.reserves.values())
            .filter((reserve) => {
              const bTokens =
                poolUser.getSupplyBTokens(reserve) +
                poolUser.getCollateralBTokens(reserve);
              return bTokens > BigInt(0);
            })
            ?.map((reserve, index) => {
              const bTokens =
                poolUser.getSupplyBTokens(reserve) +
                poolUser.getCollateralBTokens(reserve);
              return (
                <PositionCard key={index} reserve={reserve} bTokens={bTokens} />
              );
            })}
        </Col>
      </Row>
    </div>
  );
};

const PositionCard = ({
  reserve,
  bTokens,
}: {
  reserve: Reserve;
  bTokens: bigint;
}) => {
  const assetFloat = reserve.toAssetFromBTokenFloat(bTokens);
  const [withdraw, setWithdraw] = useState(false);

  return (
    <Row gutter={[12, 12]} align={"middle"} className="py-3">
      <Col span={9} className="text-font-semi-bold">
        {formatter.toBalance(assetFloat)}
      </Col>
      <Col span={9} className="text-font-semi-bold">
        {formatter.toPercentage(reserve.supplyApr)}
      </Col>
      <Col md={6} span={24}>
        <Button className="w-full" onClick={() => setWithdraw(true)}>
          Withdraw
        </Button>
      </Col>
      <WithdrawModal open={withdraw} close={() => setWithdraw(false)} />
    </Row>
  );
};

export default UserPositionDetails;
