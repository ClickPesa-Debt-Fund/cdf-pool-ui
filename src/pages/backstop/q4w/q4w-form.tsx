import { TxStatus, useWallet } from "@/contexts/wallet";
import { Q4WFormProps } from ".";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
  useGetKYC,
  useSubmitKYC,
} from "@/pages/dashboard/services";
import { DEBOUNCE_DELAY, POOL_ID } from "@/constants";
import { useState } from "react";
import { SorobanRpc } from "@stellar/stellar-sdk";
import {
  BackstopContract,
  BackstopPoolUserEst,
  PoolBackstopActionArgs,
  Q4W,
  parseResult,
} from "@blend-capital/blend-sdk";
import Form from "antd/lib/form";
import notification from "antd/lib/notification";
import useDebounce from "@/hooks/use-debounce";
import FullPageSpinner from "@/components/other/full-page-loader";
import WizardAmountInput from "@/components/other/wizard-amount-input";
import { cn } from "@/lib/utils";
import { currencies } from "@/shared/data/currencies";
import KycForm from "@/components/other/kyc-form";
import { Button } from "@/components/ui/button";
import { compareObjects, formatAmount, formatErrorMessage } from "@/utils";
import Summary from "./summary";

const Q4WForm = ({ form, current, close, updateCurrent }: Q4WFormProps) => {
  const amount = Form.useWatch("amount", form);
  const { connected, walletAddress, backstopQueueWithdrawal, txStatus } =
    useWallet();

  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: backstopUserData } = useBackstopPoolUser(POOL_ID);
  const { kyc: submitKyc, kycData, kycLoading } = useSubmitKYC();
  const { kyc, kycRefetch, kycRefetching } = useGetKYC(walletAddress);

  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<Q4W>();
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);
  const [isLoading, setloading] = useState(false);
  const decimals = 7;

  useDebounce(
    async () => {
      setSimResponse(undefined);
      setLoadingEstimate(true);
      setParsedSimResult(undefined);
      await handleSubmitTransaction(true);
      setLoadingEstimate(false);
    },
    [amount],
    DEBOUNCE_DELAY
  );

  if (!backstop || !backstopPoolData) {
    return null;
  }

  const backstopUserEst =
    backstopUserData !== undefined
      ? BackstopPoolUserEst.build(backstop, backstopPoolData, backstopUserData)
      : undefined;

  const tokensToShares =
    Number(backstopPoolData?.poolBalance.shares) /
    Number(backstopPoolData?.poolBalance.tokens);

  const maxAmount = backstopUserEst?.tokens.toFixed(7) || 0;

  const handleSubmitTransaction = async (sim: boolean) => {
    let toQueueShares = BigInt(0);
    const as_number = Number(amount);
    if (!Number.isNaN(as_number)) {
      const as_shares = as_number * tokensToShares;
      const as_bigint = BigInt(Math.floor(as_shares * 1e7));
      toQueueShares = as_bigint;
    }
    if (connected && toQueueShares !== BigInt(0)) {
      let depositArgs: PoolBackstopActionArgs = {
        from: walletAddress,
        pool_address: POOL_ID,
        amount: toQueueShares,
      };
      let response = await backstopQueueWithdrawal(depositArgs, sim);
      if (response) {
        // @ts-ignore
        setSimResponse(response);
        // @ts-ignore
        if (SorobanRpc.Api.isSimulationSuccess(response)) {
          setParsedSimResult(
            parseResult(response, BackstopContract.parsers.queueWithdrawal)
          );
        }
      }
      return response;
    }
  };

  return (
    <Form
      form={form}
      onFinish={async (data) => {
        if (loadingEstimate) {
          return;
        }
        await form.validateFields();
        if (current === 1) {
          updateCurrent(2);
        }
        if (current === 2) {
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
      initialValues={{
        currency: "BLND-USDC LP",
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
      <div
        className={cn({
          hidden: current !== 1,
        })}
      >
        <WizardAmountInput
          currency={{
            options:
              currencies
                ?.filter((currency) => currency?.currency === "BLND-USDC LP")
                ?.map((currency) => ({
                  icon: currency?.icon,
                  label: currency?.currency,
                  value: currency?.currency,
                })) || [],
          }}
          amount={{
            rules: [
              {
                validator(_, value) {
                  if (!value || value <= 0) {
                    return Promise.reject("Invalid Amount");
                  }
                  if (value > +maxAmount) {
                    return Promise.reject(
                      `Maximum amount is ${maxAmount} BLND-USDC LP`
                    );
                  }
                  return Promise.resolve(value);
                },
              },
            ],
          }}
        />
        <p className="text-right">{`Maximum Amount: ${formatAmount(
          maxAmount,
          decimals
        )} BLND-USDC LP`}</p>
        <br />
      </div>
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
        />
      )}
      {current !== 2 && <Button className="w-full">Continue</Button>}
    </Form>
  );
};

export default Q4WForm;
