import WizardAmountInput from "@/components/other/wizard-amount-input";
import { formatAmount } from "@/utils";
import { COLLATERAL_ASSET_CODE } from "@/constants";
import { currencies } from "@/shared/data/currencies";
import Spin from "antd/lib/spin";

const AmountInput = ({
  maxAmount,
  asset,
  decimals = 7,
  loadingSimulation,
}: {
  maxAmount: number | string;
  asset: "USDC" | typeof COLLATERAL_ASSET_CODE;
  decimals?: number;
  loadingSimulation: boolean;
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
      {loadingSimulation && (
        <p className="flex justify-end items-center gap-3">
          <Spin size="small" /> Loading
        </p>
      )}
    </div>
  );
};

export default AmountInput;
