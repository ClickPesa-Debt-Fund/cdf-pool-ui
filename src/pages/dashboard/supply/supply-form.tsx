import Form from "antd/lib/form";
import Steps from "antd/lib/steps";
import { SupplyFormProps } from ".";
import AmountInput from "./amount-input";

const SupplyForm = ({
  form,
  current,
  amount,
  amountError,
  updateAmount,
  updateAmountError,
}: SupplyFormProps) => {
  return (
    <Form form={form} className="space-y-6 max-w-full w-[700px] my-5 mx-auto">
      <Steps
        current={current - 1}
        className="mb-6"
        items={[
          {
            title: "Amount",
          },
          {
            title: "KYC",
          },
          {
            title: "Final",
          },
        ]}
      />
      <AmountInput
        updateAmount={updateAmount}
        amount={amount}
        amountError={amountError}
        updateAmountError={updateAmountError}
      />
    </Form>
  );
};

export default SupplyForm;
