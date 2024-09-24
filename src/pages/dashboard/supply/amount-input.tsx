// import { formatAmount } from "@/utils";
import { currencies } from "../data";
import { ExchangeFormItem } from "@clickpesa/components-library.forms.exchange-form-item";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import { BLND_ISSUER, USDC_ISSUER } from "@/constants";

const AmountInput = ({
  amount,
  amountError,
  maxAmount,
  asset,
  updateAmount,
  updateAmountError,
}: {
  amount: string;
  amountError: string;
  maxAmount?: number | string;
  updateAmount: (amount: string) => void;
  updateAmountError: (error: string) => void;
  asset: "USDC" | "CPYT";
}) => {
  const { walletAddress } = useWallet();
  const { balance } = useGetAccountBalance(walletAddress || "");
  const supportedBalances = balance?.balances?.find((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSUER ||
        balance?.asset_issuer === USDC_ISSUER) &&
      balance?.asset_code === asset
    );
  });
  return (
    <div className="space-y-6">
      <ExchangeFormItem
        currencies={currencies.filter(
          (currency) => currency?.currency === asset
        )}
        amount={amount}
        handleAmountChange={(amount) => {
          updateAmount(amount || "");
          if (!amount) {
            updateAmountError("Invalid Amount");
          } else if (
            +(supportedBalances?.balance || 0) < +(amount || 0) ||
            +amount > +(maxAmount || 0)
          ) {
            updateAmountError("Insufficient Balance");
          } else {
            updateAmountError("");
          }
        }}
        currency={asset}
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
