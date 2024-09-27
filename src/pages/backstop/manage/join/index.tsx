import Form from "antd/lib/form";
import Input from "antd/lib/input";
import Spin from "antd/lib/spin";
import notification from "antd/lib/notification";
import { ManageFormProps } from "..";
import WizardAmountInput from "@/components/other/wizard-amount-input";
import { currencies } from "@/shared/data/currencies";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SorobanRpc, scValToBigInt, xdr } from "@stellar/stellar-sdk";
import { Backstop, parseResult } from "@blend-capital/blend-sdk";
import useDebounce from "@/hooks/use-debounce";
import { scaleInputToBigInt } from "@/utils/scval";
import { estJoinPool } from "@/utils/comet";
import { TxStatus, useWallet } from "@/contexts/wallet";
import { delay, formatAmount, formatErrorMessage } from "@/utils";
import { cn } from "@/lib/utils";
import Summary from "./summary";
import FullPageSpinner from "@/components/other/full-page-loader";

const Join = ({
  form,
  lpBalance,
  usdcBalance,
  blndBalance,
  backstop,
  current,
  updateCurrent,
  close,
  refetch,
}: ManageFormProps & {
  lpBalance?: bigint;
  usdcBalance?: string | number;
  blndBalance?: string | number;
  backstop: Backstop | undefined;
  refetch: () => void;
}) => {
  const amount = Form.useWatch("amount", form);
  const slippage = Form.useWatch("slippage", form);
  const currency = Form.useWatch("currency", form);
  const isJoin = currency === "BLND-USDC LP";
  const {
    walletAddress,
    cometJoin,
    cometSingleSidedDeposit,

    txStatus,
  } = useWallet();
  const [isLoading, setLoading] = useState(false);
  const [simResponse, setSimResponse] =
    useState<SorobanRpc.Api.SimulateTransactionResponse>();
  const [toMint, setToMint] = useState<number>(0);
  const [maxBLNDIn, setMaxBLNDIn] = useState<number>(0);
  const [maxUSDCIn, setMaxUSDCIn] = useState<number>(0);
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);
  const decimals = 7;
  const validDecimals =
    (amount?.toString()?.split(".")[1]?.length ?? 0) <= decimals;

  const blndBalanceRes = +(blndBalance || 0) ?? BigInt(0);
  const usdcBalanceRes = +(usdcBalance || 0) ?? BigInt(0);
  const lpBalanceRes = lpBalance ?? BigInt(0);

  const curTokenBalance =
    currency === "USDC"
      ? usdcBalanceRes
      : currency === "BLND"
      ? blndBalanceRes
      : lpBalanceRes;
  const maxBLNDDeposit = backstop
    ? backstop.backstopToken.blnd / BigInt(3) - BigInt(1)
    : BigInt(0);
  const maxUSDCDeposit = backstop
    ? backstop.backstopToken.usdc / BigInt(3) - BigInt(1)
    : BigInt(0);

  const address =
    currency === "USDC"
      ? backstop?.config.usdcTkn
      : currency === "BLND"
      ? backstop?.config.blndTkn
      : backstop?.config.backstopTkn;

  useDebounce(
    async () => {
      setSimResponse(undefined);
      if (
        validDecimals &&
        address &&
        backstop?.config.backstopTkn &&
        walletAddress &&
        amount &&
        slippage
      ) {
        setLoadingEstimate(true);
        const inputAsBigInt = scaleInputToBigInt(amount?.toString(), decimals);
        const slippageAsNum = Number(slippage) / 100;

        if (
          !isJoin &&
          amount <= curTokenBalance &&
          ((currency === "BLND" && inputAsBigInt <= maxBLNDDeposit) ||
            (currency === "USDC" && inputAsBigInt <= maxUSDCDeposit))
        ) {
          cometSingleSidedDeposit(
            backstop.config.backstopTkn,
            {
              depositTokenAddress: address,
              depositTokenAmount: inputAsBigInt,
              minLPTokenAmount: BigInt(0),
              user: walletAddress,
            },
            true
          )
            .then(
              // @ts-ignore
              (sim: SorobanRpc.Api.SimulateTransactionResponse | undefined) => {
                if (sim === undefined) {
                  return;
                }
                setSimResponse(sim);
                if (SorobanRpc.Api.isSimulationSuccess(sim)) {
                  let result = parseResult(sim, (xdrString: string) => {
                    return scValToBigInt(
                      xdr.ScVal.fromXDR(xdrString, "base64")
                    );
                  });
                  let resultAsNumber = Number(result ?? 0) / 10 ** decimals;
                  let toMintMin =
                    resultAsNumber - resultAsNumber * slippageAsNum;
                  setToMint(toMintMin);
                  form.validateFields();
                }
              }
            )
            .finally(() => {
              setLoadingEstimate(false);
            });
        } else if (isJoin && validDecimals) {
          let { blnd, usdc } = estJoinPool(
            backstop.backstopToken,
            inputAsBigInt,
            slippageAsNum
          );
          setMaxBLNDIn(blnd);
          setMaxUSDCIn(usdc);

          if (blnd < Number(blndBalance) && usdc < Number(usdcBalance)) {
            cometJoin(
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
                (
                  sim: SorobanRpc.Api.SimulateTransactionResponse | undefined
                ) => {
                  setSimResponse(sim);
                  form.validateFields();
                }
              )
              .finally(() => {
                setLoadingEstimate(false);
              });
          } else {
            await delay(1000);
            form.validateFields();
            setLoadingEstimate(false);
          }
        } else {
          setLoadingEstimate(false);
        }
      }
    },
    [amount, slippage, currency],
    750
  );

  async function handleSubmitJoin() {
    if (validDecimals && backstop?.config.backstopTkn) {
      setLoading(true);
      await cometJoin(
        backstop?.config.backstopTkn,
        {
          user: walletAddress,
          poolAmount: scaleInputToBigInt(amount?.toString(), decimals),
          blndLimitAmount: BigInt(Math.floor(maxBLNDIn * 10 ** decimals)),
          usdcLimitAmount: BigInt(Math.floor(maxUSDCIn * 10 ** decimals)),
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  async function handleSubmitDeposit() {
    if (validDecimals && backstop?.config.backstopTkn && address) {
      setLoading(true);
      await cometSingleSidedDeposit(
        backstop?.config.backstopTkn,
        {
          depositTokenAddress: address,
          depositTokenAmount: scaleInputToBigInt(amount?.toString(), decimals),
          minLPTokenAmount: BigInt(Math.floor(toMint * 10 ** decimals)),
          user: walletAddress,
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <Form
      form={form}
      initialValues={{
        currency: "USDC",
        slippage: "1",
      }}
      onFinish={async () => {
        if (loadingEstimate) {
          return;
        }
        if (current === 1) {
          await form.validateFields();
          return updateCurrent(2);
        }
        isJoin ? handleSubmitJoin() : handleSubmitDeposit();
      }}
    >
      {([
        TxStatus.BUILDING,
        txStatus === TxStatus.SIGNING,
        2,
        5,
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
                ?.filter((currency) => {
                  return ["USDC", "BLND", "BLND-USDC LP"]?.includes(
                    currency?.currency
                  );
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
                  if (value <= 0) {
                    return Promise.reject("Amount is required");
                  }
                  if (!isJoin && value > curTokenBalance) {
                    return Promise.reject(
                      `Maximum amount is ${formatAmount(curTokenBalance, 6)}`
                    );
                  }
                  if (
                    isJoin &&
                    (maxBLNDIn > Number(blndBalance) ||
                      maxUSDCIn > Number(usdcBalance))
                  ) {
                    return Promise.reject(
                      `You need ${formatAmount(
                        maxBLNDIn
                      )} BLND and ${formatAmount(maxUSDCIn)} USDC.`
                    );
                  }
                  return Promise.resolve();
                },
              },
            ],
          }}
          containerStyle={{
            marginBottom: "2rem",
          }}
        />
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
        {loadingEstimate && (
          <div className="flex gap-4 justify-end items-center mb-5">
            Loading Estimate <Spin size="small" />
          </div>
        )}
      </div>
      {current === 2 && (
        <Summary
          amount={amount}
          currency={currency}
          lpBalance={lpBalance}
          usdcBalance={usdcBalance}
          blndBalance={blndBalance}
          simResponse={simResponse}
          toMint={toMint}
          maxBLNDIn={maxBLNDIn}
          maxUSDCIn={maxUSDCIn}
          isJoin={isJoin}
          decimals={decimals}
        />
      )}
      <Button className="w-full" disabled={loadingEstimate}>
        Continue
      </Button>
    </Form>
  );
};

export default Join;
