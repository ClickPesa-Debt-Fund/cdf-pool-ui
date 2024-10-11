import { useState } from "react";
import Form from "antd/lib/form";
import notification from "antd/lib/notification";
import { DepositFormProps } from ".";
import { SorobanRpc } from "@stellar/stellar-sdk";
import { useWallet } from "@/contexts/wallet";
import useDebounce from "@/hooks/use-debounce";
import { DEBOUNCE_DELAY, POOL_ID } from "@/constants";
import {
  BackstopContract,
  PoolBackstopActionArgs,
  parseResult,
} from "@blend-capital/blend-sdk";
import { bigintToInput, scaleInputToBigInt } from "@/utils/scval";
import WizardAmountInput from "@/components/other/wizard-amount-input";
import { currencies } from "@/shared/data/currencies";
import { Button } from "@/components/ui/button";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import { formatAmount, formatErrorMessage } from "@/utils";
import Summary from "./summary";

const DepositForm = ({ form, lpBalance, close }: DepositFormProps) => {
  const amount = Form.useWatch("amount", form);
  const { connected, walletAddress, backstopDeposit } = useWallet();
  const { balanceRefetch } = useGetAccountBalance(walletAddress || "");
  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<bigint>();

  useDebounce(
    async () => {
      setSimResponse(undefined);
      await handleSubmitTransaction(true);
    },
    [amount],
    DEBOUNCE_DELAY
  );

  const handleSubmitTransaction = async (sim: boolean) => {
    if (amount && connected) {
      const depositArgs: PoolBackstopActionArgs = {
        from: walletAddress,
        pool_address: POOL_ID,
        amount: scaleInputToBigInt(amount?.toString(), 7),
      };
      const response = await backstopDeposit(depositArgs, sim);
      if (response && sim) {
        // @ts-ignore
        setSimResponse(response);
        // @ts-ignores
        if (SorobanRpc.Api.isSimulationSuccess(response)) {
          const result = parseResult(
            response,
            BackstopContract.parsers.deposit
          );
          setParsedSimResult(result);
        }
      }
      if (!sim) {
        return response;
      }
    }
  };

  const maxAmount = bigintToInput(lpBalance, 7);

  return (
    <Form
      form={form}
      initialValues={{
        currency: "BLND-USDC LP",
      }}
      onFinish={async () => {
        await form.validateFields(["amount"]);

        if (parsedSimResult) {
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
          7
        )} BLND-USDC LP`}</p>
        <br />
      </div>

      {parsedSimResult ? (
        <Summary
          amount={amount}
          simResponse={simResponse}
          lpBalance={maxAmount}
          parsedSimResult={parsedSimResult}
        />
      ) : null}
      <Button className="w-full">Continue</Button>
    </Form>
  );
};

export default DepositForm;
