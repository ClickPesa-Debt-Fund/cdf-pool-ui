import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Spinner from "@/components/other/spinner";
import { POOL_ID } from "@/constants";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
} from "@/pages/dashboard/services";
import { usePool, usePoolOracle } from "@/services";
import {
  BackstopPoolEst,
  BackstopPoolUserEst,
  FixedMath,
  PoolEstimate,
  parseResult,
} from "@blend-capital/blend-sdk";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { toPercentage } from "@/utils/formatter";
import { useWallet } from "@/contexts/wallet";
import { useEffect, useState } from "react";
import { SorobanRpc, scValToBigInt, xdr } from "@stellar/stellar-sdk";
import { nFormatter } from "@/pages/landing-page/earning-calculator/earning-graph";

const BackstopDetails = () => {
  const [lpTokenEmissions, setLpTokenEmissions] = useState<bigint>();
  const { connected, cometSingleSidedDeposit } = useWallet();

  const { data: pool } = usePool(POOL_ID);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: userBackstopPoolData } = useBackstopPoolUser(POOL_ID);

  const backstopPoolEst =
    backstop !== undefined && backstopPoolData !== undefined
      ? BackstopPoolEst.build(
          backstop.backstopToken,
          backstopPoolData.poolBalance
        )
      : undefined;

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

  let estBackstopApr: number | undefined = undefined;
  if (
    pool !== undefined &&
    poolOracle !== undefined &&
    backstop !== undefined &&
    backstopPoolData !== undefined
  ) {
    const poolEst = PoolEstimate.build(pool.reserves, poolOracle);
    const backstopPoolEst = BackstopPoolEst.build(
      backstop.backstopToken,
      backstopPoolData.poolBalance
    );
    estBackstopApr =
      (FixedMath.toFloat(BigInt(pool.config.backstopRate), 7) *
        poolEst.avgBorrowApr *
        poolEst.totalBorrowed) /
      backstopPoolEst.totalSpotValue;
  }

  if (!pool || !backstop || !backstopPoolData) {
    return <Spinner />;
  }

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <Row gutter={[12, 12]} justify={"space-between"}>
        <Col md={24} span={24}>
          <Row gutter={[12, 12]} justify={"space-between"}>
            <DetailContentItem
              title="Backstop APR"
              content={toPercentage(estBackstopApr)}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Q4W"
              content={toPercentage(backstopPoolEst?.q4wPercentage)}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Deposited"
              content={`$${nFormatter(
                backstopPoolEst?.totalSpotValue || 0,
                3
              )}`}
              style={{
                marginTop: 0,
              }}
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BackstopDetails;
