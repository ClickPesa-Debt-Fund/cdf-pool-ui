import { useWallet } from "@/contexts/wallet";
import { Q4WFormProps } from ".";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
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
import WizardAmountInput from "@/components/other/wizard-amount-input";
import { currencies } from "@/shared/data/currencies";
import { Button } from "@/components/ui/button";
import { formatAmount, formatErrorMessage } from "@/utils";
import Summary from "./summary";

const Q4WForm = ({ form, close }: Q4WFormProps) => {
  const amount = Form.useWatch("amount", form);
  const { connected, walletAddress, backstopQueueWithdrawal } = useWallet();

  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: backstopUserData } = useBackstopPoolUser(POOL_ID);

  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<Q4W>();
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);
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
      onFinish={async () => {
        if (!loadingEstimate && parsedSimResult) {
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
            });
        }
      }}
      initialValues={{
        currency: "BLND-USDC LP",
      }}
    >
      <div>
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

      {parsedSimResult ? (
        <Summary
          amount={amount}
          simResponse={simResponse}
          parsedSimResult={parsedSimResult}
          decimals={decimals}
        />
      ) : null}
      <Button className="w-full">Continue</Button>
    </Form>
  );
};

export default Q4WForm;
