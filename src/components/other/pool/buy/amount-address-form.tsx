import { formatAmount } from "@/utils";
import { currencies } from "../data";
import { ExchangeFormItem } from "@clickpesa/components-library.forms.exchange-form-item";
import { WizardInput } from "@clickpesa/components-library.inputs.wizard-input";
import { Button } from "@/components/ui/button";
import { useGetWalletInfo } from "../services";

const AmountAddressForm = ({
  amount,
  amountError,
  assetCode,
  balances,
  loading,
  updateAmount,
  updateAmountError,
}: {
  assetCode: string;
  amount: string;
  amountError: string;
  balances?: any;
  loading: boolean;
  updateAmount: (amount: string) => void;
  updateAmountError: (error: string) => void;
}) => {
  const { walletInfo } = useGetWalletInfo();
  return (
    <div className="space-y-6">
      <ExchangeFormItem
        currencies={currencies.filter(
          (currency) => currency?.currency === assetCode
        )}
        amount={amount}
        handleAmountChange={(amount) => {
          updateAmount(amount || "");
          if (
            Number(amount) < walletInfo?.deposit?.[assetCode]?.min_amount ||
            Number(amount) > walletInfo?.deposit?.[assetCode]?.max_amount
          ) {
            updateAmountError("Invalid amount");
          } else {
            updateAmountError("");
          }
        }}
        currency={assetCode}
        handleCurrencyChange={() => {}}
        name="amount"
        amountError={amountError}
        label=""
        isMobile={false}
        message={`Min deposit amount ${formatAmount(
          walletInfo?.deposit?.[assetCode]?.min_amount
        )} ${assetCode}. Max amount is ${formatAmount(
          walletInfo?.deposit?.[assetCode]?.max_amount
        )} ${assetCode}.`}
      />
      <div>
        <WizardInput
          label="Address"
          name="address"
          placeholder="Wallet Address"
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        />
        {balances &&
          !balances?.find(
            (balance: { asset_code?: string }) =>
              balance?.asset_code === assetCode
          ) && (
            <span className="text-red-500">
              Please add {assetCode} trustline to your Stellar account before
              starting the swap process.{" "}
              <a
                href="https://medium.com/clickpesa"
                target="_blank"
                className="text-primary"
              >
                Learn More
              </a>
            </span>
          )}
      </div>
      <Button className="w-full" disabled={loading}>
        {loading ? "Please Wait" : "Continue"}
      </Button>
    </div>
  );
};

export default AmountAddressForm;
