import Form from "antd/lib/form";
import { useState } from "react";
import Steps from "antd/lib/steps";
import {
  useCreateAndActivateAccount,
  useGenerateDepositInstructions,
  useGetDepositInfo,
  useGetKYC,
  useSubmitAddress,
  useSubmitKYC,
} from "./services";

import KycForm from "./kyc-form";
import AmountAddressForm from "./amount-address-form";
import DepositStatus from "./deposit-status";

const assetCode = "CPYT";
const BuyForm = ({ close }: { close: () => void; open: boolean }) => {
  const { depositInfo } = useGetDepositInfo();
  const [current, setCurrent] = useState(1);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [form] = Form.useForm();

  //   step 01
  const { submitAddress, addressLoading, address } = useSubmitAddress();

  //   step 02
  const { generateToken, generateTokenLoading, generateTokenData } =
    useCreateAndActivateAccount();
  const { kyc, kycData, kycLoading } = useSubmitKYC();

  const { deposit, depositData, depositLoading } =
    useGenerateDepositInstructions();

  const { kycRefetch } = useGetKYC(
    address ? form.getFieldValue("address") : ""
  );

  return (
    <Form
      form={form}
      className="space-y-6 max-w-full w-[700px] my-5 mx-auto"
      onFinish={async (data) => {
        if (current === 1) {
          if (
            depositInfo &&
            (Number(amount) < depositInfo?.[assetCode]?.min_amount ||
              Number(amount) > depositInfo?.[assetCode]?.max_amount)
          ) {
            setAmountError("Invalid amount");
          }
          await form.validateFields();
          if (
            Number(amount) < depositInfo?.[assetCode]?.min_amount ||
            Number(amount) > depositInfo?.[assetCode]?.max_amount
          ) {
            return;
          }
          submitAddress(data?.address).then((res) => {
            if (
              res?.balances?.find(
                (balance: { asset_code?: string }) =>
                  balance?.asset_code === assetCode
              )
            ) {
              setCurrent(current + 1);
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
                generateToken(assetCode).then((res) => {
                  kycRefetch();
                  deposit({
                    amount,
                    assetCode,
                    JWTToken: res?.JWTToken,
                    publicKey: form.getFieldValue("address"),
                    customer_id: kycData?.id,
                  }).then(() => {
                    setCurrent(current + 1);
                  });
                });
              }
            });
          }
          if (kycData && !generateTokenData) {
            generateToken(assetCode).then((res) => {
              kycRefetch();
              deposit({
                amount,
                assetCode,
                JWTToken: res?.JWTToken,
                publicKey: form.getFieldValue("address"),
                customer_id: kycData?.id,
              }).then(() => {
                setCurrent(current + 1);
              });
            });
          }
          if (generateTokenData) {
            deposit({
              amount,
              assetCode,
              JWTToken: generateTokenData?.JWTToken,
              publicKey: form.getFieldValue("address"),
              customer_id: kycData?.id,
            }).then(() => {
              setCurrent(current + 1);
            });
          }
        }
      }}
    >
      <Steps
        current={current - 1}
        className="mb-6"
        items={[
          {
            title: "Buy Details",
          },
          {
            title: "KYC",
          },
          {
            title: "Deposit Instructions",
          },
        ]}
      />
      {current === 1 && (
        <AmountAddressForm
          loading={addressLoading}
          balances={address?.balances}
          amount={amount}
          amountError={amountError}
          assetCode={assetCode}
          updateAmount={(amount) => setAmount(amount)}
          updateAmountError={(error) => setAmountError(error)}
        />
      )}
      {current === 2 && (
        <KycForm
          publicKey={form?.getFieldValue("address")}
          loading={generateTokenLoading || kycLoading || depositLoading}
        />
      )}
      {current === 3 && depositData && (
        <DepositStatus
          deposit={depositData?.deposit}
          assetCode={assetCode}
          id={depositData?.id}
          close={() => {
            form.resetFields();
            close();
          }}
        />
      )}
    </Form>
  );
};

export default BuyForm;
