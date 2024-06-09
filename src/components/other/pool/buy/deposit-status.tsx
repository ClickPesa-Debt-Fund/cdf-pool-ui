import { useEffect, useState } from "react";
import { useGetWalletInfo, useGetDepositStatus } from "../services";
import { DetailsRow } from "@clickpesa/components-library.details-row";
import { formatAmount } from "@/utils";
import { CurrencyDetails } from "../services/deposit/retrieve-info";
import { DepositResponse } from "../services/deposit/initiate-deposit";
import IdContainer from "../../id-container";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import Spinner from "../../spinner";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFlags } from "flagsmith/react";

const DepositStatus = ({
  deposit,
  assetCode,
  id,
  close,
  retry,
}: {
  deposit: DepositResponse;
  assetCode: string;
  id: string;
  close: () => void;
  retry: () => void;
}) => {
  const { debtfund_investor_asset } = useFlags(["debtfund_investor_asset"]);
  const [timeLeft, setTimeLeft] = useState(
    +deposit?.deposit?.expires_in / 1000
  );
  const [shouldRefetch, setRefetch] = useState(deposit?.status !== "SUCCESS");
  const { depositStatus } = useGetDepositStatus(deposit?.id, shouldRefetch);
  const depositIntsruction = depositStatus || deposit;
  const { walletInfo } = useGetWalletInfo();
  useEffect(() => {
    if (["SUCCESS", "FAILED"].includes(depositStatus?.status || "")) {
      setRefetch(false);
    }
  }, [depositStatus]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) {
      return `00:00`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const assetDepositInfo: CurrencyDetails = walletInfo?.deposit?.[assetCode];

  const INVESTOR_ASSET = debtfund_investor_asset?.value;

  return (
    <div className="space-y-6">
      {!["SUCCESS", "FAILED"].includes(depositIntsruction?.status) && (
        <div className="space-y-5">
          <div className="space-y-6">
            <p>
              Now send your {depositIntsruction?.deposit?.account_currency} to
              the specified address. Once they are received, we will transfer
              the same amount of {assetCode} to your Stellar Wallet
            </p>
            <div className="space-y-4">
              <p className="flex gap-2">
                <Info size={14} className="text-primary min-w-4 mt-1" />
                <div>
                  Transfer exactly&nbsp;
                  <span className="text-font-bold font-bold">
                    {formatAmount(deposit?.expected_amount)}&nbsp;
                    {depositIntsruction?.deposit?.account_currency}
                  </span>
                  &nbsp;to this Stellar address within the next&nbsp;
                  <span className="text-font-bold font-bold">
                    {formatTime(timeLeft)}
                  </span>
                  &nbsp;minutes
                </div>
              </p>
              <div className="border rounded px-4 py-2">
                <IdContainer
                  id={depositIntsruction?.deposit?.account_address}
                  className="justify-between gap-4"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-3">
              <span className="text-gray-500">Fee:</span>
              {formatAmount(assetDepositInfo?.fee_fixed)}&nbsp;
              {depositIntsruction?.deposit?.account_currency}
            </p>
            <p className="flex items-center gap-3">
              <span className="text-gray-500">Status:</span> Waiting on the user
              to transfer funds{" "}
              <Spinner height={15} size="small" className="w-fit" />
            </p>
          </div>
        </div>
      )}

      {["SUCCESS", "FAILED"].includes(depositIntsruction?.status) && (
        <>
          <div className="space-y-3">
            <div className="deposit-summary">
              <DetailsRow
                custom={{
                  label: "Transaction Status",
                  value: (
                    <StatusTag
                      name={depositIntsruction?.status}
                      color={
                        depositIntsruction?.status === "SUCCESS"
                          ? "green"
                          : "red"
                      }
                    />
                  ),
                }}
              />
              <DetailsRow
                custom={{
                  label: depositIntsruction?.confirmation?.amount
                    ? "Deposited Amount"
                    : "Amount",
                  value:
                    formatAmount(
                      depositIntsruction?.confirmation?.amount ||
                        depositIntsruction?.deposit?.deposited_amount
                    ) +
                    " " +
                    (depositIntsruction?.confirmation?.currency ||
                      depositIntsruction?.deposit?.account_currency),
                }}
              />
              {depositIntsruction?.verification?.amount && (
                <DetailsRow
                  custom={{
                    label: "Received Amount",
                    value:
                      formatAmount(depositIntsruction?.verification?.amount) +
                      " " +
                      depositIntsruction?.verification?.currency,
                  }}
                />
              )}
              <DetailsRow
                custom={{
                  label: "Fee",
                  value:
                    formatAmount(assetDepositInfo?.fee_fixed) +
                    " " +
                    INVESTOR_ASSET,
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
                  value: depositIntsruction?.createdAt,
                }}
              />
              {depositIntsruction?.status === "SUCCESS" && (
                <DetailsRow
                  text={{
                    label: "Completed",
                    type: "date",
                    value: depositIntsruction?.updatedAt,
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="flex-1"
              variant={
                depositIntsruction?.status === "FAILED" ? "outline" : "default"
              }
              onClick={() => close()}
            >
              Close
            </Button>
            {depositIntsruction?.status === "FAILED" && (
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

export default DepositStatus;
