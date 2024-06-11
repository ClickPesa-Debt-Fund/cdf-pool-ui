import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal";
import { formatErrorMessage } from "@/utils";
import ErrorComponent from "../../error-component";
import Spinner from "../../spinner";
import BuyForm from "./buy-form";
import { useGetWalletInfo, useGetToml } from "../services";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span className="inline-flex items-center gap-3">
          {current > 1 && (
            <Button
              size={"sm"}
              variant={"ghost"}
              className="-ml-4"
              type="button"
              onClick={() => {
                setCurrent(current - 1);
              }}
            >
              <ArrowLeft />
            </Button>
          )}
          Buy CPYT Token
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
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
