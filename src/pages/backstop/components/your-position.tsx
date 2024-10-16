import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { CONNECTION_ERROR_MESSAGE, POOL_ID } from "@/constants";
import { useWallet } from "@/contexts/wallet";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
} from "@/pages/dashboard/services";
import {
  BackstopPoolUserEst,
  FixedMath,
  parseResult,
} from "@blend-capital/blend-sdk";
import { SorobanRpc, scValToBigInt, xdr } from "@stellar/stellar-sdk";
import { useEffect, useState } from "react";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { Button } from "@/components/ui/button";
import DepositModal from "../deposit";
import Q4WModal from "../q4w";
import { formatAmount } from "@/utils";
import { SectionTemplate } from "@clickpesa/components-library.section-template";
import { useTheme } from "@/contexts/theme";

const YourPosition = () => {
  const { theme } = useTheme();
  const { connected, cometSingleSidedDeposit, connect } = useWallet();
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [lpTokenEmissions, setLpTokenEmissions] = useState<bigint>();

  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: userBackstopPoolData } = useBackstopPoolUser(POOL_ID);

  const backstopUserEst =
    userBackstopPoolData !== undefined &&
    backstop !== undefined &&
    backstopPoolData !== undefined
      ? BackstopPoolUserEst.build(
          backstop,
          backstopPoolData,
          userBackstopPoolData
        )
      : undefined;

  const backstopDepositUSD =
    backstopUserEst?.tokens && backstop?.backstopToken.lpTokenPrice
      ? backstopUserEst?.tokens * backstop.backstopToken.lpTokenPrice
      : undefined;

  async function getLPEstimate(
    amount: bigint,
    depositTokenAddress: string,
    source: string
  ) {
    if (connected && backstop) {
      let response = await cometSingleSidedDeposit(
        backstop.config.backstopTkn,
        {
          depositTokenAddress: depositTokenAddress,
          depositTokenAmount: amount,
          minLPTokenAmount: BigInt(0),
          user: source,
        },
        true
      );
      if (response) {
        // @ts-ignore
        return SorobanRpc.Api.isSimulationSuccess(response)
          ? parseResult(response, (xdrString: string) => {
              return scValToBigInt(xdr.ScVal.fromXDR(xdrString, "base64"));
            })
          : BigInt(0);
      }
    }
    return BigInt(0);
  }

  useEffect(() => {
    const update = async () => {
      if (
        backstop?.config?.blndTkn !== undefined &&
        backstopUserEst?.emissions !== undefined &&
        backstopUserEst.emissions > 0
      ) {
        let emissions_as_bigint = FixedMath.toFixed(
          backstopUserEst.emissions,
          7
        );
        let lp_tokens_emitted = await getLPEstimate(
          emissions_as_bigint,
          backstop.config.blndTkn,
          backstop.id
        );
        setLpTokenEmissions(lp_tokens_emitted);
      } else if (lpTokenEmissions !== BigInt(0)) {
        setLpTokenEmissions(BigInt(0));
      }
    };
    update();
  }, [userBackstopPoolData]);

  return (
    <SectionTemplate
      className=" md:rounded-2xl rounded-lg"
      mode={theme}
      sectionTitle={"Your Position"}
    >
      <Row gutter={[12, 12]} justify={"space-between"}>
        <Col md={16} span={24}>
          <Row gutter={[12, 12]} justify={"space-between"}>
            <DetailContentItem
              title="Your backstop deposit"
              content={`${formatAmount(
                backstopUserEst?.tokens,
                7
              )} BLND-USDC LP`}
              style={{
                marginTop: 0,
              }}
              mode={theme}
            />
            <DetailContentItem
              title="Your backstop deposit (USD)"
              content={`$${formatAmount(backstopDepositUSD || 0, 7)}`}
              style={{
                marginTop: 0,
              }}
              mode={theme}
            />
            <div className="w-[30%]" />
          </Row>
        </Col>
        <Col md={6} span={24} className="space-y-3">
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenDeposit(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenDeposit(true);
                  } else {
                    notification.error({
                      message: CONNECTION_ERROR_MESSAGE,
                    });
                  }
                });
              }
            }}
          >
            Backstop Deposit
          </Button>
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => {
              if (connected) {
                setOpenWithdraw(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenWithdraw(true);
                  } else {
                    notification.error({
                      message: CONNECTION_ERROR_MESSAGE,
                    });
                  }
                });
              }
            }}
          >
            Queue For Withdraw
          </Button>
        </Col>
      </Row>
      <DepositModal
        open={openDeposit}
        close={() => {
          setOpenDeposit(false);
        }}
      />
      <Q4WModal
        open={openWithdraw}
        close={() => {
          setOpenWithdraw(false);
        }}
      />
    </SectionTemplate>
  );
};

export default YourPosition;
