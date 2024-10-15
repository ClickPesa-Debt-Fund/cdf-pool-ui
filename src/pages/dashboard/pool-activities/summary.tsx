import {
  COLLATERAL_ASSET_CODE,
  COLLATERAL_ASSET_ID,
  USDC_ASSET_ID,
} from "@/constants";
import { useRetroshades } from "@/services";
import { formatAmount } from "@/utils";
import { RETROSHADES_COMMANDS } from "@/utils/retroshades";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import Row from "antd/lib/row";

const Summary = ({
  walletAddress,
  type,
}: {
  walletAddress?: string;
  type: RETROSHADES_COMMANDS;
}) => {
  const { data: totalUSDCSupplied } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_USDC_SUPPLIED,
    walletAddress,
  });
  const { data: totalCollateralSupplied } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_COLLATERAL_SUPPLIED,
    walletAddress,
  });
  const { data: totalUSDCWithdraw } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_USDC_WITHDRAW,
    walletAddress,
  });

  const { data: totalCPYTWithdraw } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_COLLATERAL_WITHDRAW,
    walletAddress,
  });
  const { data: totalBorrowed } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_USDC_BORROWED,
    walletAddress,
  });
  const { data: repaidFunds } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_USDC_REPAID,
    walletAddress,
  });

  const USDCRepaidFunds = repaidFunds?.find(
    (repaidFund: { reserve_address: string }) =>
      repaidFund?.reserve_address === USDC_ASSET_ID
  )?.sum;

  const USDCTotalBorrowedFunds = totalBorrowed?.find(
    (repaidFund: { reserve_address: string }) =>
      repaidFund?.reserve_address === USDC_ASSET_ID
  )?.sum;

  const USDCTotalSuppliedFunds = totalUSDCSupplied?.find(
    (repaidFund: { reserve_address: string }) =>
      repaidFund?.reserve_address === USDC_ASSET_ID
  )?.sum;

  const CollateralTotalSuppliedFunds = totalCollateralSupplied?.find(
    (repaidFund: { reserve_address: string }) =>
      repaidFund?.reserve_address === COLLATERAL_ASSET_ID
  )?.sum;

  const USDCTotalWithdrawFunds = totalUSDCWithdraw?.find(
    (repaidFund: { reserve_address: string }) =>
      repaidFund?.reserve_address === USDC_ASSET_ID
  )?.sum;

  const CollateralTotalWithdrawFunds = totalCPYTWithdraw?.find(
    (repaidFund: { reserve_address: string }) =>
      repaidFund?.reserve_address === COLLATERAL_ASSET_ID
  )?.sum;

  return (
    <div className="my-4">
      <Row gutter={[12, 12]} justify={"space-between"}>
        {type === RETROSHADES_COMMANDS.BORROW_USDC_TRXS && (
          <DetailContentItem
            title="Total borrowed funds"
            content={
              <span className="text-font-semi-bold">
                ${formatAmount(USDCTotalBorrowedFunds || 0, 7)}
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
        {type === RETROSHADES_COMMANDS.REPAY_USDC_TRXS && (
          <DetailContentItem
            title="Total repaid funds"
            content={
              <span className="text-font-semi-bold">
                ${formatAmount(USDCRepaidFunds || 0, 7)}
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}

        {type === RETROSHADES_COMMANDS.SUPPLY_USDC_TRXS && (
          <DetailContentItem
            title="Total USDC supplied funds"
            content={
              <span className="text-font-semi-bold">
                ${formatAmount(USDCTotalSuppliedFunds || 0, 7)}
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
        {type === RETROSHADES_COMMANDS.SUPPLY_COLLATERAL_TRXS && (
          <DetailContentItem
            title="Total Collateral supplied funds"
            content={
              <span className="text-font-semi-bold">
                {formatAmount(CollateralTotalSuppliedFunds || 0, 7)}{" "}
                {COLLATERAL_ASSET_CODE}
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
        {/* <DetailContentItem
          title="Current supplied funds"
          content={
            <span className="text-font-semi-bold">
              $
              {formatAmount(
                totalSupplied?.[0]?.reserve_supply_adjusted || 0,
                7
              )}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        />
        <DetailContentItem
          title="Current supplied funds"
          content={
            <span className="text-font-semi-bold">
              {toBalance(24000, 7)} {COLLATERAL_ASSET_CODE}
            </span>
          }
          style={{
            marginTop: 0,
          }}
        /> */}
        {type === RETROSHADES_COMMANDS.WITHDRAW_USDC_TRXS && (
          <DetailContentItem
            title="Total USDC withdrawn funds"
            content={
              <span className="text-font-semi-bold">
                ${formatAmount(USDCTotalWithdrawFunds || 0, 7)}
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
        {type === RETROSHADES_COMMANDS.WITHDRAW_COLLATERAL_TRXS && (
          <DetailContentItem
            title="Total Collateral withdrawn funds"
            content={
              <span className="text-font-semi-bold">
                {formatAmount(CollateralTotalWithdrawFunds || 0, 7)}{" "}
                {COLLATERAL_ASSET_CODE}
              </span>
            }
            style={{
              marginTop: 0,
            }}
          />
        )}
      </Row>
    </div>
  );
};

export default Summary;
