import Form from "antd/lib/form";
import Steps from "antd/lib/steps";
import { TransactFormProps } from ".";
import AmountInput from "./amount-input";
import { useWallet } from "@/contexts/wallet";
import {
  useGetAccountBalance,
  useGetKYC,
  useHorizonAccount,
  useSubmitKYC,
  useTokenBalance,
} from "@/pages/dashboard/services";
import KycForm from "../../../components/other/kyc-form";
import { compareObjects, formatErrorMessage } from "@/utils";
import {
  FixedMath,
  PoolContract,
  Positions,
  PositionsEstimate,
  RequestType,
  SubmitArgs,
  parseResult,
} from "@blend-capital/blend-sdk";
import { scaleInputToBigInt } from "@/utils/scval";
import { SorobanRpc } from "@stellar/stellar-sdk";
import { useState } from "react";
import notification from "antd/lib/notification";
import useDebounce from "@/hooks/use-debounce";
import { usePool, usePoolOracle, usePoolUser } from "@/services";
import { getAssetReserve } from "@/utils/horizon";
import { cn } from "@/lib/utils";
import {
  USDC_ASSET_ID,
  COLLATERAL_ASSET_CODE,
  CPYT_ISSUER,
  POOL_ID,
  USDC_ISSUER,
  DEBOUNCE_DELAY,
} from "@/constants";
import WithdrawSummary from "./summary/withdraw";
import SupplySummary from "./summary/supply";
import BorrowSummary from "./summary/borrow";
import RepaySummary from "./summary/repay";
import { CPYT_ASSET_ID } from "@/constants";

const TransactForm = ({
  form,
  current,
  type,
  asset,
  updateCurrent,
  close,
}: TransactFormProps) => {
  const amount = Form.useWatch("amount", form);
  const { walletAddress, poolSubmit, connected, txType } = useWallet();
  const { balance, balanceRefetch } = useGetAccountBalance(walletAddress || "");
  const { kyc: submitKyc, kycData, kycLoading } = useSubmitKYC();
  const { kyc, kycRefetch, kycRefetching } = useGetKYC(walletAddress);

  const { data: pool } = usePool(POOL_ID);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: userPoolData } = usePoolUser(pool);
  let assetId = asset === COLLATERAL_ASSET_CODE ? CPYT_ASSET_ID : USDC_ASSET_ID;
  const reserve = pool?.reserves.get(assetId);
  const assetToBase = poolOracle?.getPriceFloat(assetId);

  const { data: horizonAccount } = useHorizonAccount();
  const { data: tokenBalance } = useTokenBalance(
    USDC_ASSET_ID,
    reserve?.tokenMetadata?.asset,
    horizonAccount
  );

  let maxAmount = 0;
  if (type === "WithdrawCollateral") {
    maxAmount =
      reserve && userPoolData && userPoolData.getCollateralFloat(reserve)
        ? userPoolData.getCollateralFloat(reserve)
        : 0;
  }

  if (type === "SupplyCollateral" && asset === "USDC") {
    // calculate current wallet state
    const stellar_reserve_amount = getAssetReserve(
      horizonAccount,
      reserve?.tokenMetadata?.asset
    );
    maxAmount =
      FixedMath.toFloat(tokenBalance ?? BigInt(0), reserve?.config?.decimals) -
      stellar_reserve_amount;
  }

  if (type === "SupplyCollateral" && asset === COLLATERAL_ASSET_CODE) {
    const supportedBalance = balance?.balances?.find(
      (balance) =>
        balance?.asset_code === COLLATERAL_ASSET_CODE &&
        balance?.asset_issuer === CPYT_ISSUER
    );
    if (supportedBalance) {
      maxAmount = +supportedBalance?.balance;
    }
  }

  if (type === "Repay") {
    const supportedBalance =
      balance?.balances?.find(
        (balance) =>
          balance?.asset_code === "USDC" &&
          balance?.asset_issuer === USDC_ISSUER
      )?.balance || "0";
    const debtAmount =
      reserve && userPoolData ? userPoolData.getLiabilitiesFloat(reserve) : 0;

    if (+supportedBalance > debtAmount) {
      maxAmount = debtAmount;
    } else {
      maxAmount = +supportedBalance;
    }
  }

  const decimals = reserve?.config.decimals ?? 7;

  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<Positions>();
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const curPositionsEstimate =
    pool && poolOracle && userPoolData
      ? PositionsEstimate.build(pool, poolOracle, userPoolData.positions)
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

  if (type === "Borrow") {
    if (reserve && curPositionsEstimate && assetToBase) {
      let to_bounded_hf =
        (curPositionsEstimate?.totalEffectiveCollateral -
          curPositionsEstimate?.totalEffectiveLiabilities *
            reserve?.getLiabilityFactor()) /
        reserve?.getLiabilityFactor();

      let userAvailableAmountToBorrow = Math.min(
        to_bounded_hf / (assetToBase * reserve.getLiabilityFactor()),
        reserve.totalSupplyFloat() *
          (FixedMath.toFloat(BigInt(reserve.config.max_util), 7) - 0.01) -
          reserve.totalLiabilitiesFloat()
      );

      maxAmount = userAvailableAmountToBorrow;
    } else {
      maxAmount = 0;
    }
  }

  const handleSubmitTransaction = async (sim: boolean) => {
    if (amount && connected && reserve) {
      let submitArgs: SubmitArgs = {
        from: walletAddress,
        to: walletAddress,
        spender: walletAddress,
        requests: [
          {
            amount: scaleInputToBigInt(amount.toString(), decimals),
            request_type: RequestType?.[type],
            address: reserve.assetId,
          },
        ],
      };
      return await poolSubmit(POOL_ID, submitArgs, sim);
    }
  };

  useDebounce(
    async () => {
      setSimResponse(undefined);
      setParsedSimResult(undefined);
      setLoadingSimulation(true);
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
      setLoadingSimulation(false);
    },
    [amount, txType],
    DEBOUNCE_DELAY
  );

  console.log(simResponse, parsedSimResult);

  return (
    <Form
      form={form}
      initialValues={{
        currency: asset,
      }}
      className="space-y-6 max-w-full w-[700px] my-5 mx-auto"
      onFinish={async (data) => {
        if (current === 1) {
          await form.validateFields(["amount"]);
          if (parsedSimResult) updateCurrent(2);
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
            });
        }
      }}
    >
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
      <div className={cn({ block: current === 1, hidden: current !== 1 })}>
        <AmountInput
          asset={asset}
          maxAmount={maxAmount}
          decimals={decimals}
          loadingSimulation={loadingSimulation}
        />
      </div>

      {current === 2 && (
        <KycForm
          loading={kycLoading || kycRefetching}
          publicKey={walletAddress}
        />
      )}
      {current === 3 && (
        <>
          {type === "WithdrawCollateral" && (
            <WithdrawSummary
              amount={amount}
              simResponse={simResponse}
              parsedSimResult={parsedSimResult}
              decimals={decimals}
              poolUser={userPoolData}
              reserve={reserve}
              curBorrowCap={curBorrowCap}
              nextBorrowCap={nextBorrowCap}
              curBorrowLimit={curBorrowLimit}
              nextBorrowLimit={nextBorrowLimit}
            />
          )}
          {type === "SupplyCollateral" && (
            <SupplySummary
              amount={amount}
              simResponse={simResponse}
              parsedSimResult={parsedSimResult}
              decimals={decimals}
              poolUser={userPoolData}
              reserve={reserve}
              curBorrowCap={curBorrowCap}
              nextBorrowCap={nextBorrowCap}
              curBorrowLimit={curBorrowLimit}
              nextBorrowLimit={nextBorrowLimit}
            />
          )}

          {type === "Borrow" && (
            <BorrowSummary
              amount={amount}
              simResponse={simResponse}
              parsedSimResult={parsedSimResult}
              decimals={decimals}
              poolUser={userPoolData}
              reserve={reserve}
              curBorrowCap={curBorrowCap}
              nextBorrowCap={nextBorrowCap}
              curBorrowLimit={curBorrowLimit}
              nextBorrowLimit={nextBorrowLimit}
            />
          )}
          {type === "Repay" && (
            <RepaySummary
              amount={amount}
              simResponse={simResponse}
              parsedSimResult={parsedSimResult}
              decimals={decimals}
              poolUser={userPoolData}
              reserve={reserve}
              curBorrowCap={curBorrowCap}
              nextBorrowCap={nextBorrowCap}
              curBorrowLimit={curBorrowLimit}
              nextBorrowLimit={nextBorrowLimit}
            />
          )}
        </>
      )}
    </Form>
  );
};

export default TransactForm;
