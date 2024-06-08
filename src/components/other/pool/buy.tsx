import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal";
import { formatErrorMessage } from "@/utils";
import ErrorComponent from "../error-component";
import Spinner from "../spinner";
import BuyForm from "./buy-form";
import { useGetDepositInfo, useGetToml } from "./services";

export type BuyFormProps = {
  close: () => void;
  form: FormInstance<any>;
  amount: string;
  amountError: string;
  current: number;
  updateCurrent: (current: number) => void;
  updateAmount: (amount: string) => void;
  updateAmountError: (error: string) => void;
};

const BuyModal = ({ close, open }: { close: () => void; open: boolean }) => {
  const [current, setCurrent] = useState(1);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [form] = Form.useForm();
  const onClose = () => {
    form.resetFields();
    setAmount("");
    setAmountError("");
    setCurrent(1);
    close();
  };
  return (
    <Modal open={open} onCancel={onClose} title="Buy CPYT Token" footer={false}>
      {open && (
        <Buy
          form={form}
          amount={amount}
          amountError={amountError}
          current={current}
          updateCurrent={(current) => setCurrent(current)}
          updateAmount={(amount) => setAmount(amount)}
          updateAmountError={(error) => setAmountError(error)}
          close={onClose}
        />
      )}
    </Modal>
  );
};

const Buy = ({
  close,
  amount,
  amountError,
  form,
  updateAmount,
  updateAmountError,
  updateCurrent,
  current,
}: BuyFormProps) => {
  const { toml, tomlError, tomlLoading, tomlRefetch, tomlRefetching } =
    useGetToml();

  const {
    depositInfo,
    depositInfoError,
    depositInfoLoading,
    depositInfoRefetch,
    depositInfoRefetching,
  } = useGetDepositInfo();

  if (tomlLoading || tomlRefetching)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (tomlError)
    return (
      <ErrorComponent
        message={formatErrorMessage(tomlError)}
        onClick={() => {
          tomlRefetch();
        }}
      />
    );

  if (depositInfoLoading || depositInfoRefetching)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (depositInfoError)
    return (
      <ErrorComponent
        message={formatErrorMessage(depositInfoError)}
        onClick={() => {
          depositInfoRefetch();
        }}
      />
    );

  if (!toml && !depositInfo) return null;

  return (
    <BuyForm
      close={close}
      form={form}
      amount={amount}
      amountError={amountError}
      current={current}
      updateCurrent={updateCurrent}
      updateAmount={updateAmount}
      updateAmountError={updateAmountError}
    />
  );
};

export default BuyModal;
