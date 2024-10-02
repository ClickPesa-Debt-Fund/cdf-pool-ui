import Row from "antd/lib/row";
import Col from "antd/lib/col";
import {
  usePool,
  // usePoolOracle,
  usePoolUser,
} from "@/services";
import Spinner from "@/components/other/spinner";
import {
  // PositionsEstimate,
  Reserve,
} from "@blend-capital/blend-sdk";
import { Button } from "@/components/ui/button";
import * as formatter from "@/utils/formatter";
import { useState } from "react";
import TransactModal from "../transact";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";
import { CurrencyLogos } from "@/components/other/currency-logos";
import { POOL_ID } from "@/constants";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";

const UserPositionDetails = () => {
  const { connected, connect } = useWallet();
  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  const { data: pool } = usePool(POOL_ID);
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

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <Row
        gutter={[12, 12]}
        align={"middle"}
        justify={"space-between"}
        className="mb-6"
      >
        <Col span={18} className="">
          <h3 className="text-font-semi-bold">Lending Position</h3>
        </Col>
        <Col span={6}>
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

      <Row gutter={[12, 12]}>
        <Col md={24} span={24}>
          <Row gutter={[12, 12]}>
            <Col span={6}>Asset</Col>
            <Col span={6}>Amount Supplied</Col>
            <Col span={6}>APR</Col>
          </Row>
          {Array.from(pool.reserves.values())
            .filter((reserve) => {
              const bTokens =
                poolUser.getSupplyBTokens(reserve) +
                poolUser.getCollateralBTokens(reserve);
              return (
                bTokens > BigInt(0) &&
                reserve?.tokenMetadata?.asset?.code === "USDC"
              );
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
      <Col span={6} className="text-font-semi-bold flex gap-2 items-center">
        <CurrencyLogos name="USDC" size="sm" /> USDC
      </Col>
      <Col span={6} className="text-font-semi-bold text-green-600">
        ${nFormatter(assetFloat, 7)}
      </Col>
      <Col span={6} className="text-font-semi-bold">
        {formatter.toPercentage(reserve.supplyApr)}
      </Col>
      <Col md={6} span={24}>
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => setWithdraw(true)}
        >
          Withdraw
        </Button>
      </Col>
      <TransactModal
        asset="USDC"
        type={"WithdrawCollateral"}
        title="Withdraw USDC"
        open={withdraw}
        close={() => setWithdraw(false)}
      />
    </Row>
  );
};

export default UserPositionDetails;
