import { CSSProperties, ReactNode } from "react";
import InputNumber, { InputNumberProps } from "antd/lib/input-number";
import Select, { SelectProps } from "antd/lib/select";
import Form, { Rule } from "antd/lib/form";
import Avatar from "antd/lib/avatar";
import { formatValue } from "react-currency-input-field";
import { cleanValue } from "react-currency-input-field";
import "./wizard-select.sass";
import "./index.sass";
import { useTheme } from "@/contexts/theme";

const Option = Select.Option;

type WizardAmountProps = {
  currency: SelectProps & {
    options: {
      label: string;
      value: string;
      icon: string | ReactNode;
    }[];
    /**
     * Input name
     */
    name?: string;
    rules?: Rule[];
    /**
     * Initial value
     */
    initialValue?: string;
    containerClassName?: string;
  };
  amount?: InputNumberProps & {
    /**
     * Input name
     */
    name?: string;
    rules?: Rule[];
    /**
     * Initial value
     */
    initialValue?: string;
  };
  /**
   * Input label
   */
  label?: ReactNode;
  /**
   * input height (works only for textarea)
   */
  height?: number | string;
  /**
   * container styles
   */
  containerStyle?: CSSProperties;
  decimalsLimit?: number;
};

const WizardAmountInput = ({
  amount,
  label = "Amount",
  height,
  containerStyle,
  currency: { options, ...currency },
  decimalsLimit = 7,
}: WizardAmountProps) => {
  const { theme: mode } = useTheme();
  const form = Form.useFormInstance();
  // @ts-ignore
  let formName = form?.__INTERNAL__?.name;
  const amountName =
    (formName || "") + (formName ? "_" : "") + (amount?.name || "amount");
  const styles = {
    "--wizard-input-height": height ? height + "px" : "39px",
  } as CSSProperties;

  const CurrencySelector = () => (
    <div className="currency-selector-input">
      <Form.Item
        noStyle
        name={currency?.name || "currency"}
        rules={currency.rules}
        initialValue={currency?.initialValue}
        className={currency?.containerClassName}
      >
        <Select
          showSearch
          placeholder={currency.placeholder || "Select Currency"}
          optionFilterProp="children"
          filterOption={(input, Option) =>
            (Option?.value?.toString() || "")
              ?.toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          popupClassName={`wizard-select-selector-dropdown ${mode || ""}`}
          style={{ width: "100%" }}
        >
          {options.map((option) => {
            return (
              <Option
                value={option.value}
                key={
                  options.filter((curr) => curr.value === option.value)[0].value
                }
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <div>
                    {typeof option.icon === "string" ? (
                      <Avatar
                        size={20}
                        shape="circle"
                        src={
                          options.find((curr) => curr.value === option.value)
                            ?.icon
                        }
                        style={{
                          marginRight: ".7rem",
                          marginTop: "-0.2rem",
                        }}
                      />
                    ) : (
                      option.icon
                    )}
                  </div>
                  <div>{option.label}</div>
                </div>
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </div>
  );
  return (
    <div
      className={`clickpesa-wizard-amount-input mobile ${mode || ""}`}
      style={{
        ...styles,
        ...containerStyle,
      }}
    >
      {label && (
        <div className="label-container">
          <label htmlFor={amountName}>{label}</label>
        </div>
      )}
      <div className="inputs">
        <Form.Item
          name={amount?.name || "amount"}
          rules={amount?.rules}
          initialValue={amount?.initialValue}
        >
          <InputNumber
            placeholder={amount?.placeholder || "Enter Amount"}
            addonBefore={<CurrencySelector />}
            formatter={(value) =>
              formatValue({
                value: value?.toString() || "",
                decimalSeparator: ".",
                groupSeparator: ",",
              })
            }
            controls={false}
            parser={(value) =>
              cleanValue({
                value: value || "",
                decimalsLimit,
                allowNegativeValue: false,
              })
            }
            id={amountName}
          />
        </Form.Item>
      </div>
    </div>
  );
};

export default WizardAmountInput;
