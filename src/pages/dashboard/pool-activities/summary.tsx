import LoadingBubbles from "@/components/other/loading-bubbles";
import {
  COLLATERAL_ASSET_CODE,
  COLLATERAL_ASSET_ID,
  USDC_ASSET_ID,
} from "@/constants";
import { useTheme } from "@/contexts/theme";
import { useRetroshades } from "@/services";
import { formatAmount } from "@/utils";
import { RETROSHADES_COMMANDS } from "@/utils/retroshades";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import Row from "antd/lib/row";

const Summary = ({
  walletAddress,
  type,
  search,
  dateRange,
}: {
  walletAddress?: string;
  type: RETROSHADES_COMMANDS;
  search?: string;
  dateRange?: string[];
}) => {
  const { theme } = useTheme();

  const { data: totalUSDCSupplied, isLoading: totalUSDCSuppliedLoading } =
    useRetroshades({
      command: RETROSHADES_COMMANDS.TOTAL_USDC_SUPPLIED,
      params: {
        walletAddress,
        search,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      },
    });
  const {
    data: totalCollateralSupplied,
    isLoading: totalCollateralSuppliedLoading,
  } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_COLLATERAL_SUPPLIED,
    params: {
      walletAddress,
      search,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    },
  });
  const { data: totalUSDCWithdraw, isLoading: totalUSDCWithdrawLoading } =
    useRetroshades({
      command: RETROSHADES_COMMANDS.TOTAL_USDC_WITHDRAW,
      params: {
        walletAddress,
        search,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      },
    });

  const { data: totalCPYTWithdraw, isLoading: totalCPYTWithdrawLoading } =
    useRetroshades({
      command: RETROSHADES_COMMANDS.TOTAL_COLLATERAL_WITHDRAW,
      params: {
        walletAddress,
        search,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      },
    });
  const { data: totalBorrowed, isLoading: totalBorrowedLoading } =
    useRetroshades({
      command: RETROSHADES_COMMANDS.TOTAL_USDC_BORROWED,
      params: {
        walletAddress,
        search,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      },
    });
  const { data: repaidFunds, isLoading: repaidFundsLoading } = useRetroshades({
    command: RETROSHADES_COMMANDS.TOTAL_USDC_REPAID,
    params: {
      walletAddress,
      search,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    },
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
      <Row gutter={[12, 12]}>
        {type === RETROSHADES_COMMANDS.BORROW_USDC_TRXS && (
          <DetailContentItem
            title="Total borrowed funds"
            content={
              <span className="text-font-semi-bold">
                {totalBorrowedLoading && <LoadingBubbles />}
                {!totalBorrowedLoading && (
                  <>
                    ${formatAmount(+(USDCTotalBorrowedFunds || 0) / 10 ** 7, 7)}
                  </>
                )}
              </span>
            }
            mode={theme}
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
                {repaidFundsLoading && <LoadingBubbles />}
                {!repaidFundsLoading && (
                  <>${formatAmount(+(USDCRepaidFunds || 0) / 10 ** 7, 7)}</>
                )}
              </span>
            }
            mode={theme}
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
                {totalUSDCSuppliedLoading && <LoadingBubbles />}
                {!totalUSDCSuppliedLoading && (
                  <>
                    ${formatAmount(+(USDCTotalSuppliedFunds || 0) / 10 ** 7, 7)}
                  </>
                )}
              </span>
            }
            mode={theme}
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
                {totalCollateralSuppliedLoading && <LoadingBubbles />}
                {!totalCollateralSuppliedLoading && (
                  <>
                    {formatAmount(
                      +(CollateralTotalSuppliedFunds || 0) / 10 ** 7,
                      7
                    )}{" "}
                    {COLLATERAL_ASSET_CODE}
                  </>
                )}
              </span>
            }
            mode={theme}
            style={{
              marginTop: 0,
            }}
          />
        )}
        {type === RETROSHADES_COMMANDS.WITHDRAW_USDC_TRXS && (
          <DetailContentItem
            title="Total USDC withdrawn funds"
            content={
              <span className="text-font-semi-bold">
                {totalUSDCWithdrawLoading && <LoadingBubbles />}
                {!totalUSDCWithdrawLoading && (
                  <>
                    ${formatAmount(+(USDCTotalWithdrawFunds || 0) / 10 ** 7, 7)}
                  </>
                )}
              </span>
            }
            mode={theme}
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
                {totalCPYTWithdrawLoading && <LoadingBubbles />}
                {!totalCPYTWithdrawLoading && (
                  <>
                    {formatAmount(
                      +(CollateralTotalWithdrawFunds || 0) / 10 ** 7,
                      7
                    )}{" "}
                    {COLLATERAL_ASSET_CODE}
                  </>
                )}
              </span>
            }
            mode={theme}
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
