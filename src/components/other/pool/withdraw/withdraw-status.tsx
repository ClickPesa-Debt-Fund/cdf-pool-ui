import { useEffect, useState } from "react";
import { WithdrawResponse } from "../services/withdraw/initiate-withdraw";
import { useGetWalletInfo, useGetWithdrawStatus } from "../services";
import { CurrencyDetails } from "../services/deposit/retrieve-info";
import { Info } from "lucide-react";
import IdContainer from "../../id-container";
import { formatAmount } from "@/utils";
import Spinner from "../../spinner";
import { DetailsRow } from "@clickpesa/components-library.details-row";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import { useFlags } from "flagsmith/react";
import { Button } from "@/components/ui/button";
import { PMT } from "@/pages/landing-page/earning-calculator/summary";

const WithdrawStatus = ({
  withdraw,
  assetCode,
  id,
  close,
  retry,
}: {
  withdraw: WithdrawResponse;
  assetCode: string;
  id: string;
  close: () => void;
  retry: () => void;
}) => {
  const { debtfund_investor_asset } = useFlags(["debtfund_investor_asset"]);
  const [shouldRefetch, setRefetch] = useState(withdraw?.status !== "SUCCESS");
  const { withdrawStatus } = useGetWithdrawStatus(withdraw?.id, shouldRefetch);
  const withdrawInstructions = withdrawStatus || withdraw;
  const { walletInfo } = useGetWalletInfo();
  useEffect(() => {
    if (["SUCCESS", "FAILED"].includes(withdrawStatus?.status || "")) {
      setRefetch(false);
    }
  }, [withdrawStatus]);

  const receiving_amount = PMT(+withdrawInstructions?.payout_info?.amount) * 3;

  const assetWithdrawInfo: CurrencyDetails = walletInfo?.withdraw?.[assetCode];

  const INVESTOR_ASSET = debtfund_investor_asset?.value;
  return (
    <div className="space-y-6">
      {!["SUCCESS", "FAILED"].includes(withdrawInstructions?.status) && (
        <div className="space-y-5">
          <div className="space-y-6">
            <p>
              Now send your {withdrawInstructions?.payout_info?.currency} to the
              specified address. Once they are received, we will transfer&nbsp;
              <span className="text-font-bold font-bold">
                {formatAmount(receiving_amount)} {INVESTOR_ASSET}
              </span>
              &nbsp; to your Stellar Wallet
            </p>
            <div className="space-y-4">
              <p className="flex gap-2">
                <Info size={14} className="text-primary min-w-4 mt-1" />
                <div>
                  Transfer exactly&nbsp;
                  <span className="text-font-bold font-bold">
                    {formatAmount(withdraw?.amount)}&nbsp;
                    {withdrawInstructions?.payout_info?.currency}
                  </span>
                  &nbsp;to this Stellar address
                </div>
              </p>
              <div className="border rounded px-4 py-2">
                <IdContainer
                  id={withdrawInstructions?.payout_info?.payout_address}
                  className="justify-between gap-4"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-3">
              <span className="text-gray-500">Fee:</span>
              {formatAmount(assetWithdrawInfo?.fee_fixed)}&nbsp;
              {withdrawInstructions?.payout_info?.currency}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-gray-500">Status:</span> Waiting on the user
              to transfer funds{" "}
              <Spinner height={15} size="small" className="w-fit" />
            </p>
          </div>
        </div>
      )}

      {["SUCCESS", "FAILED"].includes(withdrawInstructions?.status) && (
        <>
          <div className="space-y-3">
            <div className="deposit-summary">
              <DetailsRow
                custom={{
                  label: "Transaction Status",
                  value: (
                    <StatusTag
                      name={withdrawInstructions?.status}
                      color={
                        withdrawInstructions?.status === "SUCCESS"
                          ? "green"
                          : "red"
                      }
                    />
                  ),
                }}
              />
              <DetailsRow
                custom={{
                  label: withdrawInstructions?.payout_info?.amount
                    ? "Withdrawn Amount"
                    : "Amount",
                  value:
                    formatAmount(withdrawInstructions?.payout_info?.amount) +
                    " " +
                    withdrawInstructions?.payout_info?.currency,
                }}
              />
              {withdrawInstructions?.payout_info?.amount && (
                <DetailsRow
                  custom={{
                    label: "Received Amount",
                    value:
                      formatAmount(receiving_amount) + " " + INVESTOR_ASSET,
                  }}
                />
              )}
              <DetailsRow
                custom={{
                  label: "Fee",
                  value:
                    formatAmount(assetWithdrawInfo?.fee_fixed) +
                    " " +
                    assetCode,
                }}
              />
              <DetailsRow
                custom={{
                  label: "Transaction ID",
                  value: <IdContainer id={id} />,
                }}
              />
              <DetailsRow
                text={{
                  label: "Started",
                  type: "date",
                  value: withdrawInstructions?.createdAt,
                }}
              />
              {withdrawInstructions?.status === "SUCCESS" && (
                <DetailsRow
                  text={{
                    label: "Completed",
                    type: "date",
                    value: withdrawInstructions?.updatedAt,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              variant={
                withdrawInstructions?.status === "FAILED"
                  ? "outline"
                  : "default"
              }
              onClick={() => close()}
            >
              Close
            </Button>
            {withdrawInstructions?.status === "FAILED" && (
              <Button className="flex-1" onClick={() => retry()}>
                Retry
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WithdrawStatus;
