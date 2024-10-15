import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { usePool, usePoolUser } from "@/services";
import Spinner from "@/components/other/spinner";
import { Button } from "@/components/ui/button";
import * as formatter from "@/utils/formatter";
import { useState } from "react";
import TransactModal from "../transact";
import { CurrencyLogos } from "@/components/other/currency-logos";
import { CONNECTION_ERROR_MESSAGE, POOL_ID } from "@/constants";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";
import { formatAmount } from "@/utils";
import { useWindowSize } from "@/hooks/use-window-size";
import { useTheme } from "@/contexts/theme";
import { SectionTemplate } from "@clickpesa/components-library.section-template";

const UserPositionDetails = () => {
  const { theme } = useTheme();
  const { data: pool } = usePool(POOL_ID);
  const { data: poolUser, isLoading } = usePoolUser(pool);

  if (isLoading) {
    return <Spinner />;
  }

  if (!pool || !poolUser) {
    return <></>;
  }

  const suppliedAssets = Array.from(pool.reserves.values()).filter(
    (reserve) => {
      const bTokens =
        poolUser.getSupplyBTokens(reserve) +
        poolUser.getCollateralBTokens(reserve);
      return (
        bTokens > BigInt(0) && reserve?.tokenMetadata?.asset?.code === "USDC"
      );
    }
  );

  return (
    <SectionTemplate
      className="md:rounded-2xl rounded-lg"
      mode={theme}
      sectionTitle="Your Lending Position"
    >
      {!poolUser && (
        <div>You have not yet supplied any funds. Supply to start earning</div>
      )}

      {poolUser && (
        <Row gutter={[12, 12]}>
          <Col md={24} span={24}>
            {!suppliedAssets?.length ? (
              <PositionCard supplyApr={0} assetFloat={0} />
            ) : null}
            {suppliedAssets?.map((reserve, index) => {
              const bTokens =
                poolUser.getSupplyBTokens(reserve) +
                poolUser.getCollateralBTokens(reserve);
              const assetFloat = reserve.toAssetFromBTokenFloat(bTokens);
              return (
                <PositionCard
                  key={index}
                  supplyApr={reserve.supplyApr}
                  assetFloat={assetFloat}
                />
              );
            })}
          </Col>
        </Row>
      )}
    </SectionTemplate>
  );
};

const PositionCard = ({
  assetFloat,
  supplyApr,
}: {
  assetFloat: number;
  supplyApr: number;
}) => {
  const { width } = useWindowSize();
  const { connected, connect } = useWallet();
  const [withdraw, setWithdraw] = useState(false);
  const [openSupplyModal, setOpenSupplyModal] = useState(false);

  return (
    <div>
      <Row gutter={[12, 12]}>
        <Col md={6} span={8}>
          Asset
        </Col>
        <Col md={6} span={8}>
          Amount Supplied
        </Col>
        <Col md={6} span={8}>
          APR
        </Col>
        <Col md={6} span={0} className="space-y-4">
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
                      message: CONNECTION_ERROR_MESSAGE,
                    });
                  }
                });
              }
            }}
          >
            Supply USDC
          </Button>
        </Col>
      </Row>
      <Row gutter={[12, 12]} align={"middle"} className="py-3">
        <Col
          md={6}
          span={8}
          className="text-font-semi-bold flex gap-2 items-center"
        >
          <CurrencyLogos name="USDC" size={24} /> USDC
        </Col>
        <Col md={6} span={8} className="text-font-semi-bold text-green-600">
          ${formatAmount(assetFloat, 7)}
        </Col>
        <Col md={6} span={8} className="text-font-semi-bold">
          {formatter.toPercentage(supplyApr)}
        </Col>
        <Col md={6} span={24} className="space-y-4">
          {width < 767 && (
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
                        message: CONNECTION_ERROR_MESSAGE,
                      });
                    }
                  });
                }
              }}
            >
              Supply USDC
            </Button>
          )}

          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => setWithdraw(true)}
          >
            Withdraw USDC
          </Button>
        </Col>
        <TransactModal
          asset="USDC"
          type={"WithdrawCollateral"}
          title="Withdraw USDC"
          open={withdraw}
          close={() => setWithdraw(false)}
        />
        <TransactModal
          asset="USDC"
          type={"SupplyCollateral"}
          title="Supply USDC"
          open={openSupplyModal}
          close={() => setOpenSupplyModal(false)}
        />
      </Row>
    </div>
  );
};

export default UserPositionDetails;
