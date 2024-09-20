// import { formatAmount } from "@/utils";
import { currencies } from "../data";
import { ExchangeFormItem } from "@clickpesa/components-library.forms.exchange-form-item";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet";
import { useGetAccountBalance } from "@/components/other/pool/services";

const BLND_ISSURER = import.meta.env.VITE_BLND_ISSUER;
const USDC_ISSURER = import.meta.env.VITE_USDC_ISSUER;

const AmountInput = ({
  amount,
  amountError,
  updateAmount,
  updateAmountError,
}: {
  amount: string;
  amountError: string;
  updateAmount: (amount: string) => void;
  updateAmountError: (error: string) => void;
}) => {
  const { walletAddress } = useWallet();
  const { balance } = useGetAccountBalance(walletAddress || "");
  const supportedBalances = balance?.balances?.find((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSURER ||
        balance?.asset_issuer === USDC_ISSURER) &&
      balance?.asset_code === "USDC"
    );
  });
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
          } else if (+(supportedBalances?.balance || 0) < +(amount || 0)) {
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
      />
      <Button className="w-full">Continue</Button>
    </div>
  );
};

export default AmountInput;
