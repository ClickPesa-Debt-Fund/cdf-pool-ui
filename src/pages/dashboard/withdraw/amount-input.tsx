// import { formatAmount } from "@/utils";
import { currencies } from "../data";
import { ExchangeFormItem } from "@clickpesa/components-library.forms.exchange-form-item";
import { Button } from "@/components/ui/button";

const AmountInput = ({
  amount,
  amountError,
  freeUserBalanceScaled,
  updateAmount,
  updateAmountError,
}: {
  amount: string;
  amountError: string;
  freeUserBalanceScaled?: number | string;
  updateAmount: (amount: string) => void;
  updateAmountError: (error: string) => void;
}) => {
  return (
    <div className="space-y-6">
      <ExchangeFormItem
        currencies={currencies.filter(
          (currency) => currency?.currency === "USDC"
        )}
        amount={amount}
        handleAmountChange={(amount) => {
          updateAmount(amount || "");
          if (!amount) {
            updateAmountError("Invalid Amount");
          } else if (+amount > +(freeUserBalanceScaled || 0)) {
            updateAmountError("Insufficient Balance");
          } else {
            updateAmountError("");
          }
        }}
        currency={"USDC"}
        handleCurrencyChange={() => {}}
        name="amount"
        amountError={amountError}
        label=""
        isMobile={false}
        message={`Available Balance: ${freeUserBalanceScaled} USDC`}
      />
      <Button className="w-full">Continue</Button>
    </div>
  );
};

export default AmountInput;
