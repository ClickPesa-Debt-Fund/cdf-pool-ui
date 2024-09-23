import { ASSET_CODE } from "@/constants";
import Form from "antd/lib/form";
import Steps from "antd/lib/steps";
import { WithdrawFormProps } from ".";
import {
  useCreateAndActivateAccount,
  useGenerateWithdrawInstructions,
  useGetKYC,
  useGetWalletInfo,
  useSubmitAddress,
  useSubmitKYC,
} from "../services";
import AmountAddressForm from "./amount-address-form";
import KycForm from "../kyc-form";
import Spinner from "../../spinner";
import WithdrawStatus from "./withdraw-status";
import { delay, formatAmount } from "@/utils";

const WithdrawForm = ({
  close,
  amount,
  amountError,
  current,
  updateAmount,
  updateAmountError,
  updateCurrent,
  form,
}: WithdrawFormProps) => {
  const { walletInfo } = useGetWalletInfo();

  //   step 01
  const { submitAddress, addressLoading, address } = useSubmitAddress();

  //   step 02
  const {
    generateToken,
    generateTokenLoading,
    generateTokenData,
    generateTokenReset,
  } = useCreateAndActivateAccount();
  const { kyc, kycData, kycLoading } = useSubmitKYC();

  const { withdraw, withdrawData, withdrawLoading, withdrawReset } =
    useGenerateWithdrawInstructions();

  const { kycRefetch } = useGetKYC(
    address ? form.getFieldValue("address") : ""
  );

  const issuer_address = address?.balances?.find(
    (balance: { asset_code: string }) => balance?.asset_code === ASSET_CODE
  )?.asset_issuer;

  const createWithdraw = () => {
    if (kycData && !generateTokenData) {
      generateToken(ASSET_CODE).then((res) => {
        kycRefetch();
        withdraw({
          amount,
          assetCode: ASSET_CODE,
          JWTToken: res?.JWTToken,
          issuer: issuer_address || "",
          publicKey: form.getFieldValue("address"),
          customer_id: kycData?.id,
        }).then(() => {
          if (current !== 3) updateCurrent(current + 1);
        });
      });
    }
    if (generateTokenData) {
      withdraw({
        amount,
        assetCode: ASSET_CODE,
        JWTToken: generateTokenData?.JWTToken,
        issuer: issuer_address || "",
        publicKey: form.getFieldValue("address"),
        customer_id: kycData?.id || "",
      }).then(() => {
        if (current !== 3) updateCurrent(current + 1);
      });
    }
  };

  return (
    <Form
      form={form}
      className="space-y-6 max-w-full w-[700px] my-5 mx-auto"
      onFinish={async (data) => {
        if (current === 1) {
          if (
            walletInfo &&
            (Number(amount) < walletInfo?.deposit?.[ASSET_CODE]?.min_amount ||
              Number(amount) > walletInfo?.deposit?.[ASSET_CODE]?.max_amount)
          ) {
            updateAmountError("Invalid amount");
          }
          await form.validateFields();
          if (
            Number(amount) < walletInfo?.deposit?.[ASSET_CODE]?.min_amount ||
            Number(amount) > walletInfo?.deposit?.[ASSET_CODE]?.max_amount
          ) {
            return;
          }
          submitAddress(data?.address).then((res) => {
            if (
              res?.balances?.find(
                (balance: { asset_code?: string }) =>
                  balance?.asset_code === ASSET_CODE
              )
            ) {
              const balance = +(
                res?.balances?.find(
                  (balance: { asset_code?: string }) =>
                    balance?.asset_code === ASSET_CODE
                )?.balance || 0
              );

              if (+balance >= +amount) {
                updateCurrent(current + 1);
              } else {
                updateAmountError(
                  `Balance not enough, maximum withdrawable amount is ${formatAmount(
                    balance
                  )} ${ASSET_CODE}`
                );
              }
            }
          });
        }
        if (current === 2) {
          await form.validateFields();
          if (!kycData) {
            kyc({
              user: data,
              publicKey: form.getFieldValue("address"),
            }).then((kycData) => {
              kycRefetch();
              if (!generateTokenData) {
                generateToken(ASSET_CODE).then((res) => {
                  kycRefetch();
                  withdraw({
                    amount,
                    assetCode: ASSET_CODE,
                    JWTToken: res?.JWTToken,
                    issuer: issuer_address || "",
                    publicKey: form.getFieldValue("address"),
                    customer_id: kycData?.id,
                  }).then(() => {
                    updateCurrent(current + 1);
                  });
                });
              }
            });
          }
          createWithdraw();
        }
      }}
    >
      <Steps
        current={current - 1}
        className="mb-6"
        items={[
          {
            title: "Withdraw Details",
          },
          {
            title: "KYC",
          },
          {
            title: "Withdraw Instructions",
          },
        ]}
      />
      {current === 1 && (
        <AmountAddressForm
          loading={addressLoading}
          balances={address?.balances}
          amount={amount}
          amountError={amountError}
          assetCode={ASSET_CODE}
          updateAmount={(amount) => updateAmount(amount)}
          updateAmountError={(error) => updateAmountError(error)}
        />
      )}
      {current === 2 && (
        <KycForm
          publicKey={form?.getFieldValue("address")}
          loading={generateTokenLoading || kycLoading || withdrawLoading}
        />
      )}
      {current === 3 && !withdrawData && (
        <div>
          <Spinner />
        </div>
      )}
      {current === 3 && withdrawData && (
        <WithdrawStatus
          withdraw={withdrawData?.withdraw}
          assetCode={ASSET_CODE}
          id={withdrawData?.id}
          close={() => {
            form.resetFields();
            close();
          }}
          retry={async () => {
            generateTokenReset();
            await delay(100);
            withdrawReset();
            await delay(100);
            createWithdraw();
          }}
        />
      )}
    </Form>
  );
};

export default WithdrawForm;
