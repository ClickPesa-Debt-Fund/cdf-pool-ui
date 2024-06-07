import { useEffect, useState } from "react";
import { useGetDepositInfo, useGetDepositStatus } from "./services";
import { DetailsRow } from "@clickpesa/components-library.details-row";
import { formatAmount } from "@/utils";
import { CurrencyDetails } from "./services/deposit/retrieve-info";
import { DepositResponse } from "./services/deposit/initiate-deposit";
import IdContainer from "../id-container";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import Spinner from "../spinner";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const DepositStatus = ({
  deposit,
  assetCode,
  id,
  close,
}: {
  deposit: DepositResponse;
  assetCode: string;
  id: string;
  close: () => void;
}) => {
  const [shouldRefetch, setRefetch] = useState(deposit?.status !== "SUCCESS");
  const { depositStatus } = useGetDepositStatus(deposit?.id, shouldRefetch);
  const depositIntsruction = depositStatus || deposit;
  const { depositInfo } = useGetDepositInfo();
  useEffect(() => {
    if (depositStatus?.status === "SUCCESS") {
      setRefetch(false);
    }
  }, [depositStatus]);
  const assetDepositInfo: CurrencyDetails = depositInfo?.[assetCode];

  return (
    <div className="space-y-6">
      {depositIntsruction?.status !== "SUCCESS" && (
        <div className="space-y-8">
          <div className="space-y-6">
            <p>
              Now send your USDC to the specified address. Once they are
              received, we will transfer the same amount of {assetCode} to your
              Stellar Wallet
            </p>
            <div className="space-y-2">
              <p>
                Transfer{" "}
                <span className="text-font-bold font-bold">
                  {formatAmount(deposit?.expected_amount)} USDC
                </span>
                &nbsp;to this Stellar address
              </p>
              <div className="border rounded px-4 py-2">
                <IdContainer
                  id={
                    depositIntsruction?.sep24_wallet_deposit_instructions
                      ?.address
                  }
                  className="justify-between gap-4"
                />
              </div>
              <span className="inline-flex items-center gap-3 text-xs">
                <Info size={14} className="text-primary" /> Min deposit
                amount&nbsp;
                {formatAmount(depositInfo?.[assetCode]?.min_amount)}&nbsp;
                {assetCode}. Max amount is&nbsp;
                {formatAmount(depositInfo?.[assetCode]?.max_amount)}&nbsp;
                {assetCode}.
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-3">
              <span className="text-gray-500">Fee:</span>
              {formatAmount(assetDepositInfo?.fee_fixed)} USDC
            </p>
            <p className="flex items-center gap-3">
              <span className="text-gray-500">Status:</span> Waiting on the user
              to transfer funds{" "}
              <Spinner height={15} size="small" className="w-fit" />
            </p>
          </div>
        </div>
      )}

      {depositIntsruction?.status === "SUCCESS" && (
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
                          : "blue"
                      }
                    />
                  ),
                }}
              />
              <DetailsRow
                custom={{
                  label: "Deposited Amount",
                  value:
                    formatAmount(depositIntsruction?.confirmation?.amount) +
                    " " +
                    depositIntsruction?.confirmation?.currency,
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
                  value: formatAmount(assetDepositInfo?.fee_fixed) + " USDC",
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
          <Button className="w-full" onClick={() => close()}>
            Close
          </Button>
        </>
      )}
    </div>
  );
};

export default DepositStatus;
