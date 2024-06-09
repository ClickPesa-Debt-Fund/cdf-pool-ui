import Form from "antd/lib/form";
import Steps from "antd/lib/steps";
import {
  useCreateAndActivateAccount,
  useGenerateDepositInstructions,
  useGetWalletInfo,
  useGetKYC,
  useSubmitAddress,
  useSubmitKYC,
} from "../services";

import KycForm from "../kyc-form";
import AmountAddressForm from "./amount-address-form";
import DepositStatus from "./deposit-status";
import { BuyFormProps } from ".";
import { ASSET_CODE } from "@/constants";
import Spinner from "../../spinner";
import { delay } from "@/utils";

const BuyForm = ({
  close,
  amount,
  amountError,
  current,
  updateAmount,
  updateAmountError,
  updateCurrent,
  form,
}: BuyFormProps) => {
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

  const { deposit, depositData, depositLoading, depositReset } =
    useGenerateDepositInstructions();

  const { kycRefetch } = useGetKYC(
    address ? form.getFieldValue("address") : ""
  );

  const issuer_address = address?.balances?.find(
    (balance: { asset_code: string }) => balance?.asset_code === ASSET_CODE
  )?.asset_issuer;

  const createDeposit = () => {
    if (kycData && !generateTokenData) {
      generateToken(ASSET_CODE).then((res) => {
        kycRefetch();
        deposit({
          amount,
          assetCode: ASSET_CODE,
          JWTToken: res?.JWTToken,
          issuer: issuer_address,
          publicKey: form.getFieldValue("address"),
          customer_id: kycData?.id,
        }).then(() => {
          if (current !== 3) updateCurrent(current + 1);
        });
      });
    }
    if (generateTokenData) {
      deposit({
        amount,
        assetCode: ASSET_CODE,
        JWTToken: generateTokenData?.JWTToken,
        issuer: issuer_address,
        publicKey: form.getFieldValue("address"),
        customer_id: kycData?.id,
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
              updateCurrent(current + 1);
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
                  deposit({
                    amount,
                    assetCode: ASSET_CODE,
                    JWTToken: res?.JWTToken,
                    issuer: issuer_address,
                    publicKey: form.getFieldValue("address"),
                    customer_id: kycData?.id,
                  }).then(() => {
                    updateCurrent(current + 1);
                  });
                });
              }
            });
          }
          createDeposit();
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
          assetCode={ASSET_CODE}
          updateAmount={(amount) => updateAmount(amount)}
          updateAmountError={(error) => updateAmountError(error)}
        />
      )}
      {current === 2 && (
        <KycForm
          publicKey={form?.getFieldValue("address")}
          loading={generateTokenLoading || kycLoading || depositLoading}
        />
      )}
      {current === 3 && !depositData && (
        <div>
          <Spinner />
        </div>
      )}
      {current === 3 && depositData && (
        <DepositStatus
          deposit={depositData?.deposit}
          assetCode={ASSET_CODE}
          id={depositData?.id}
          close={() => {
            form.resetFields();
            close();
          }}
          retry={async () => {
            generateTokenReset();
            await delay(100);
            depositReset();
            await delay(100);
            createDeposit();
          }}
        />
      )}
    </Form>
  );
};

export default BuyForm;
