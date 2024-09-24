import Modal from "antd/lib/modal";
import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "@/contexts/wallet";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import ErrorComponent from "@/components/other/error-component";
import { formatErrorMessage } from "@/utils";
import Spinner from "@/components/other/spinner";
import WithdrawForm from "./withdraw-form";

const BLND_ISSURER = import.meta.env.VITE_BLND_ISSUER;
const USDC_ISSURER = import.meta.env.VITE_USDC_ISSUER;

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
  open,
  close,
}: {
  open: boolean;
  close: () => void;
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
          Withdraw USDC
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
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
  const [isLoading, setLoading] = useState(false);
  const { walletAddress } = useWallet();
  const { balance, balanceError, balanceLoading, balanceRefetch } =
    useGetAccountBalance(walletAddress || "");

  const loading = isLoading || balanceLoading;

  if (loading)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (balanceError)
    return (
      <ErrorComponent
        message={formatErrorMessage(balanceError)}
        onClick={() => {
          setLoading(true);
          balanceRefetch().finally(() => setLoading(false));
        }}
      />
    );

  if (!balance) return null;
  //   check if balance has USDC issues by us or blend
  const supportedBalances = balance?.balances?.filter((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSURER ||
        balance?.asset_issuer === USDC_ISSURER) &&
      balance?.asset_code === "USDC"
    );
  });
  //   if no error component
  if (!supportedBalances?.length) {
    return <ErrorComponent message="You have no supported asset" />;
  }
  //   if yes form
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
