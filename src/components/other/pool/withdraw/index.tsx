import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal";
import { formatErrorMessage } from "@/utils";
import ErrorComponent from "../../error-component";
import Spinner from "../../spinner";
import { useGetWalletInfo, useGetToml } from "../services";
import WithdrawForm from "./withdraw-form";

export type WithdrawFormProps = {
  close: () => void;
  form: FormInstance<any>;
  amount: string;
  amountError: string;
  current: number;
  updateCurrent: (current: number) => void;
  updateAmount: (amount: string) => void;
  updateAmountError: (error: string) => void;
};

const WithdrawModal = ({
  close,
  open,
}: {
  close: () => void;
  open: boolean;
}) => {
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
    <Modal open={open} onCancel={onClose} title="Withdraw Token" footer={false}>
      {open && (
        <Withdraw
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

const Withdraw = ({
  close,
  amount,
  amountError,
  form,
  updateAmount,
  updateAmountError,
  updateCurrent,
  current,
}: WithdrawFormProps) => {
  const { toml, tomlError, tomlLoading, tomlRefetch, tomlRefetching } =
    useGetToml();

  const {
    walletInfo,
    walletInfoError,
    walletInfoLoading,
    walletInfoRefetch,
    walletInfoRefetching,
  } = useGetWalletInfo();

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

  if (walletInfoLoading || walletInfoRefetching)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (walletInfoError)
    return (
      <ErrorComponent
        message={formatErrorMessage(walletInfoError)}
        onClick={() => {
          walletInfoRefetch();
        }}
      />
    );

  if (!toml && !walletInfo) return null;

  return (
    <WithdrawForm
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

export default WithdrawModal;
