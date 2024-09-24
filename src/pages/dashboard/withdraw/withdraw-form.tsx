import Form from "antd/lib/form";
import Steps from "antd/lib/steps";
import { WithdrawFormProps } from ".";
import AmountInput from "./amount-input";
import { TxStatus, useWallet } from "@/contexts/wallet";
import {
  useGetAccountBalance,
  useGetKYC,
  useSubmitKYC,
} from "@/pages/dashboard/services";
import KycForm from "../kyc-form";
import Summary from "./summary";
import { compareObjects, formatErrorMessage } from "@/utils";
import {
  PoolContract,
  Positions,
  PositionsEstimate,
  RequestType,
  SubmitArgs,
  parseResult,
} from "@blend-capital/blend-sdk";
import { scaleInputToBigInt } from "@/utils/scval";
import { SorobanRpc } from "@stellar/stellar-sdk";
import FullPageSpinner from "@/components/other/full-page-loader";
import { useState } from "react";
import notification from "antd/lib/notification";
import useDebounce from "@/hooks/use-debounce";
import { usePool, usePoolOracle, usePoolUser } from "@/services";

const WithdrawForm = ({
  form,
  current,
  amount,
  amountError,
  updateCurrent,
  updateAmount,
  updateAmountError,
  close,
}: WithdrawFormProps) => {
  const poolId = import.meta.env.VITE_POOL_ID || "";
  const assetId = import.meta.env.VITE_ASSET_ID || "";
  const { walletAddress, poolSubmit, connected, txStatus, txType } =
    useWallet();
  const { balanceRefetch } = useGetAccountBalance(walletAddress || "");
  const { kyc: submitKyc, kycData, kycLoading } = useSubmitKYC();

  const { kyc, kycRefetch, kycRefetching } = useGetKYC(walletAddress);

  const { data: pool } = usePool(poolId);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: poolUser } = usePoolUser(pool);
  const reserve = pool?.reserves.get(assetId);
  const currentDeposit =
    reserve && poolUser ? poolUser.getCollateralFloat(reserve) : undefined;

  const decimals = reserve?.config.decimals ?? 7;

  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<Positions>();
  const [isLoading, setloading] = useState(false);

  const curPositionsEstimate =
    pool && poolOracle && poolUser
      ? PositionsEstimate.build(pool, poolOracle, poolUser.positions)
      : undefined;

  const newPositionsEstimate =
    pool && poolOracle && parsedSimResult
      ? PositionsEstimate.build(pool, poolOracle, parsedSimResult)
      : undefined;

  const curBorrowCap = curPositionsEstimate?.borrowCap;
  const nextBorrowCap = newPositionsEstimate?.borrowCap;
  const curBorrowLimit =
    curPositionsEstimate && Number.isFinite(curPositionsEstimate?.borrowLimit)
      ? curPositionsEstimate.borrowLimit
      : 0;
  const nextBorrowLimit =
    newPositionsEstimate && Number.isFinite(newPositionsEstimate?.borrowLimit)
      ? newPositionsEstimate?.borrowLimit
      : 0;

  const handleSubmitTransaction = async (sim: boolean) => {
    if (amount && connected && reserve) {
      let submitArgs: SubmitArgs = {
        from: walletAddress,
        to: walletAddress,
        spender: walletAddress,
        requests: [
          {
            amount: scaleInputToBigInt(amount, decimals),
            request_type: RequestType.WithdrawCollateral,
            address: reserve.assetId,
          },
        ],
      };
      return await poolSubmit(poolId, submitArgs, sim);
    }
  };

  useDebounce(
    async () => {
      setSimResponse(undefined);
      setParsedSimResult(undefined);
      let response = await handleSubmitTransaction(true);

      if (response) {
        // @ts-ignore
        setSimResponse(response);
        // @ts-ignore
        if (SorobanRpc.Api.isSimulationSuccess(response)) {
          setParsedSimResult(
            parseResult(response, PoolContract.parsers.submit)
          );
        }
      }
    },
    [amount, txType],
    750
  );

  return (
    <Form
      form={form}
      className="space-y-6 max-w-full w-[700px] my-5 mx-auto"
      onFinish={async (data) => {
        if (current === 1) {
          if (!amount) {
            updateAmountError("Invalid Amount");
          } else if (+(currentDeposit || 0) < +(amount || 0)) {
            updateAmountError("Insufficient Balance");
          } else {
            updateAmountError("");
            updateCurrent(2);
          }
        }
        if (current === 2) {
          await form.validateFields();
          if (
            !kycData ||
            (kyc &&
              !compareObjects(
                {
                  email: kyc?.email,
                  first_name: kyc?.first_name,
                  last_name: kyc?.last_name,
                  phone: kyc?.phone,
                  country: kyc?.country,
                  city: kyc?.city,
                  physical_address: kyc?.physical_address,
                },
                data
              ))
          ) {
            submitKyc({
              user: data,
              publicKey: walletAddress,
            }).then(() => {
              kycRefetch();
              updateCurrent(3);
            });
          } else {
            updateCurrent(3);
          }
        }
        if (current === 3) {
          setloading(true);
          handleSubmitTransaction(false)
            .then((res) => {
              // @ts-ignore
              if (res?.message) {
                notification.success({
                  // @ts-ignore
                  message: res?.message,
                });
                // refetch balance
                balanceRefetch();
                close();
              }
            })
            .catch((error) => {
              notification.error({
                message: formatErrorMessage(error),
              });
            })
            .finally(() => setloading(false));
        }
      }}
    >
      {([
        TxStatus.BUILDING,
        txStatus === TxStatus.SIGNING,
        TxStatus.SUBMITTING,
      ].includes(txStatus) ||
        isLoading) && (
        <FullPageSpinner
          message={
            txStatus === TxStatus.BUILDING
              ? "Preparing your transaction..."
              : txStatus === TxStatus.SIGNING
              ? "Please confirm the transaction in your wallet."
              : txStatus === TxStatus.SUBMITTING
              ? "Submitting your transaction..."
              : ""
          }
        />
      )}

      <Steps
        current={current - 1}
        className="mb-6"
        items={[
          {
            title: "Amount",
          },
          {
            title: "KYC",
          },
          {
            title: "Summary",
          },
        ]}
      />
      {current === 1 && (
        <AmountInput
          updateAmount={updateAmount}
          amount={amount}
          amountError={amountError}
          updateAmountError={updateAmountError}
          freeUserBalanceScaled={currentDeposit}
        />
      )}
      {current === 2 && (
        <KycForm
          loading={kycLoading || kycRefetching}
          publicKey={walletAddress}
        />
      )}
      {current === 3 && (
        <Summary
          amount={amount}
          simResponse={simResponse}
          parsedSimResult={parsedSimResult}
          decimals={decimals}
          poolUser={poolUser}
          reserve={reserve}
          curBorrowCap={curBorrowCap}
          nextBorrowCap={nextBorrowCap}
          curBorrowLimit={curBorrowLimit}
          nextBorrowLimit={nextBorrowLimit}
        />
      )}
    </Form>
  );
};

export default WithdrawForm;
