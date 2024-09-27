import { Button } from "@/components/ui/button";
import WizardAmountInput from "@/components/other/wizard-amount-input";
import { formatAmount } from "@/utils";
import { COLLATERAL_ASSET_CODE } from "@/constants";
import { currencies } from "@/shared/data/currencies";

const AmountInput = ({
  maxAmount,
  asset,
  decimals = 7,
}: {
  maxAmount: number | string;
  asset: "USDC" | typeof COLLATERAL_ASSET_CODE;
  decimals?: number;
}) => {
  return (
    <div className="space-y-6">
      <WizardAmountInput
        currency={{
          options:
            currencies
              .filter((currency) => currency?.currency === asset)
              ?.map((currency) => ({
                value: currency?.currency,
                label: currency?.currency,
                icon: currency?.icon,
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
                    `Maximum amount is ${maxAmount} ${asset}`
                  );
                }
                return Promise.resolve(value);
              },
            },
          ],
        }}
        decimalsLimit={decimals}
      />
      <p>{`Maximum Amount: ${formatAmount(maxAmount, decimals)} ${asset}`}</p>
      <Button className="w-full">Continue</Button>
    </div>
  );
};

export default AmountInput;
