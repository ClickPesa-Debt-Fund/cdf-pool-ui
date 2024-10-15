import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";
import { currencies } from "@/shared/data/currencies";
import { ExchangeFormItem } from "@clickpesa/components-library.forms.exchange-form-item";
import { SelectInput } from "@clickpesa/components-library.inputs.select-input";
import { SectionTemplate } from "@clickpesa/components-library.section-template";

const Form = ({
  amount,
  updateAmount,
}: {
  amount: string;
  updateAmount: (amount: string) => void;
}) => {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col justify-between h-full self-stretch">
      <div />
      <SectionTemplate
        className={cn("rounded-lg", {
          "!bg-[#272F35]": theme === "dark",
        })}
      >
        <div className="space-y-7">
          <div>
            <label htmlFor="amount" className="text-text-300 flex">
              Amount
            </label>
            <ExchangeFormItem
              currencies={currencies?.filter(
                (currency) => currency?.currency === "USDC"
              )}
              amount={amount}
              handleAmountChange={(amount) => {
                updateAmount(amount || "");
              }}
              currency="USDC"
              handleCurrencyChange={() => {}}
              name="amount"
              label=""
              isMobile={false}
              mode={theme}
            />
          </div>
          <div>
            <label htmlFor="apy" className="text-text-300 flex">
              Annual Percentage Yield (APR)
            </label>
            <ExchangeFormItem
              currencies={[
                {
                  currency: "Fixed",
                  icon: "",
                  symbol: "Fixed",
                },
              ]}
              amount={"12"}
              handleAmountChange={() => {}}
              currency="Fixed"
              handleCurrencyChange={() => {}}
              name="apy"
              label=""
              isMobile={false}
              mode={theme}
            />
          </div>
          <div>
            <label htmlFor="payback" className="text-text-300 mb-1 flex">
              Payback Period
            </label>
            <SelectInput
              isFormItem={false}
              value={"Quarterly"}
              name="payback"
              options={[
                {
                  label: "Quarterly",
                  value: "Quarterly",
                },
              ]}
              mode={theme}
            />
          </div>
        </div>
      </SectionTemplate>
      <div />
    </div>
  );
};

export default Form;
