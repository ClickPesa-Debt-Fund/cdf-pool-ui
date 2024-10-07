import { useState } from "react";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import notification from "antd/lib/notification";
import { ExitFormProps } from ".";
import { BalancesProps } from "../join";
import { SorobanRpc } from "@stellar/stellar-sdk";
import useDebounce from "@/hooks/use-debounce";
import { useWallet } from "@/contexts/wallet";
import { scaleInputToBigInt } from "@/utils/scval";
import WizardAmountInput from "@/components/other/wizard-amount-input";
import { cn } from "@/lib/utils";
import { currencies } from "@/shared/data/currencies";
import { Button } from "@/components/ui/button";
import { formatAmount, formatErrorMessage } from "@/utils";
import { estExitPool } from "@/utils/comet";
import Summary from "./summary";
import { DEBOUNCE_DELAY } from "@/constants";

const ExitForm = ({
  form,
  backstop,
  blndBalance,
  usdcBalance,
  lpBalance,
  current,
  close,
  updateCurrent,
  refetch,
}: ExitFormProps & BalancesProps) => {
  const { cometExit, walletAddress } = useWallet();
  const amount = Form.useWatch("amount", form);
  const currency = Form.useWatch("currency", form);
  const slippage = Form.useWatch("slippage", form);
  const [minBLNDOut, setMinBLNDOut] = useState<number>(0);
  const [minUSDCOut, setMinUSDCOut] = useState<number>(0);
  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const decimals = 7;
  const validDecimals =
    (amount?.toString()?.split(".")[1]?.length ?? 0) <= decimals;

  useDebounce(
    async () => {
      setSimResponse(undefined);
      if (
        amount &&
        validDecimals &&
        backstop?.config.backstopTkn &&
        walletAddress
      ) {
        const inputAsBigInt = scaleInputToBigInt(
          (amount || 0)?.toString(),
          decimals
        );
        const slippageAsNum = Number(slippage) / 100;
        let { blnd, usdc } = estExitPool(
          backstop.backstopToken,
          inputAsBigInt,
          slippageAsNum
        );
        setMinBLNDOut(blnd);
        setMinUSDCOut(usdc);
        cometExit(
          backstop.config.backstopTkn,
          {
            user: walletAddress,
            poolAmount: inputAsBigInt,
            blndLimitAmount: BigInt(Math.floor(blnd * 10 ** decimals)),
            usdcLimitAmount: BigInt(Math.floor(usdc * 10 ** decimals)),
          },
          true
        )
          .then(
            // @ts-ignore
            (sim: SorobanRpc.Api.SimulateTransactionResponse | undefined) => {
              setSimResponse(sim);
            }
          )
          .catch(() => {
            setMinBLNDOut(0);
            setMinUSDCOut(0);
          });
      }
    },
    [amount, slippage],
    DEBOUNCE_DELAY
  );

  async function handleSubmitExit() {
    const validDecimals =
      (amount?.toString()?.split(".")[1]?.length ?? 0) <= decimals;
    if (validDecimals && backstop?.config.backstopTkn) {
      await cometExit(
        backstop?.config.backstopTkn,
        {
          user: walletAddress,
          poolAmount: scaleInputToBigInt(amount?.toString(), decimals),
          blndLimitAmount: BigInt(Math.floor(minBLNDOut * 10 ** decimals)),
          usdcLimitAmount: BigInt(Math.floor(minUSDCOut * 10 ** decimals)),
        },
        false
      )
        .then((res) => {
          // @ts-ignore
          if (res?.message) {
            notification.success({
              // @ts-ignore
              message: res?.message,
            });
            refetch();
            close();
            form.resetFields();
            updateCurrent(1);
            close();
          } else {
            notification.error({
              message: "Something went wrong",
            });
          }
        })
        .catch((e) => {
          notification.error({
            message: formatErrorMessage(e),
          });
        });
    }
  }

  return (
    <Form
      form={form}
      initialValues={{
        slippage: "1",
        currency: "BLND-USDC LP",
      }}
      onFinish={async () => {
        await form.validateFields();
        if (current === 1) {
          updateCurrent(2);
        }
        if (current === 2) {
          handleSubmitExit();
        }
      }}
    >
      <div
        className={cn({
          hidden: current !== 1,
        })}
      >
        <WizardAmountInput
          currency={{
            options:
              currencies
                ?.filter((currency) => {
                  return ["BLND-USDC LP"]?.includes(currency?.currency);
                })
                .map((currency) => {
                  return {
                    label: currency?.currency,
                    value: currency?.currency,
                    icon: currency?.icon,
                  };
                }) || [],
          }}
          amount={{
            rules: [
              {
                validator(_, value) {
                  if (!value || value <= 0) {
                    return Promise.reject("Amount is required");
                  }
                  if (value > Number(lpBalance) / 10 ** 7) {
                    return Promise.reject(
                      `Maximum amount is ${formatAmount(
                        Number(lpBalance) / 10 ** 7
                      )}`
                    );
                  }
                  if (value) return Promise.resolve();
                },
              },
            ],
          }}
          containerStyle={{
            marginBottom: "2rem",
          }}
        />
        <p className="text-right">{`Maximum Amount: ${formatAmount(
          Number(lpBalance) / 10 ** 7,
          decimals
        )} BLND-USDC LP`}</p>

        <Form.Item
          name="slippage"
          label="Maximum Slippage Percentage"
          labelCol={{ span: 24 }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            marginBottom: "2rem",
          }}
          rules={[
            {
              validator(_, value) {
                if (!value || +value <= 0) {
                  return Promise.reject("Slippage must be at least 0.1%");
                }
                if (+value > 10) {
                  return Promise.reject("Slippage can be at most 10%");
                }
                return Promise.resolve();
              },
            },
          ]}
          className={`basic-text-input`}
        >
          <Input placeholder="Enter Slippage Percentage" prefix="%" />
        </Form.Item>
      </div>
      {current === 2 && (
        <Summary
          simResponse={simResponse}
          lpBalance={lpBalance}
          usdcBalance={usdcBalance}
          blndBalance={blndBalance}
          decimals={decimals}
          currency={currency}
          minBLNDOut={minBLNDOut}
          minUSDCOut={minUSDCOut}
          amount={amount}
        />
      )}
      <Button className="w-full">Continue</Button>
    </Form>
  );
};

export default ExitForm;
