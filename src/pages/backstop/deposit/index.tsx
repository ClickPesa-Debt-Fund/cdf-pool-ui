import Modal from "antd/lib/modal";
import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import {
  useBackstop,
  useHorizonAccount,
  useTokenBalance,
} from "@/pages/dashboard/services";
import Spinner from "@/components/other/spinner";
import ErrorComponent from "@/components/other/error-component";
import { formatErrorMessage } from "@/utils";
import DepositForm from "./deposit-form";

export type DepositFormProps = {
  form: FormInstance<any>;

  close: () => void;

  lpBalance: bigint;
};

const DepositModal = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) => {
  const [form] = Form.useForm();
  const onClose = () => {
    form.resetFields();

    close();
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <span className="inline-flex items-center gap-3">
          {"Deposit BLND-USDC LP"}
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
      <Deposit form={form} close={onClose} lpBalance={0n} />
    </Modal>
  );
};

const Deposit = ({ form, close }: DepositFormProps) => {
  const [isLoading, setLoading] = useState(false);
  const { data: backstop } = useBackstop();
  const {
    data: horizonAccount,
    isLoading: horizonLoading,
    error: horizonError,
    refetch: horizonRefetch,
  } = useHorizonAccount();
  const {
    data: lpBalance,
    error: lpError,
    refetch: lpRefetch,
    isLoading: lpBalanceLoading,
  } = useTokenBalance(
    backstop?.backstopToken?.id ?? "",
    undefined,
    horizonAccount
  );
  const loading = isLoading || lpBalanceLoading || horizonLoading;
  if (loading)
    return (
      <div className="flex items-center justify-center h-24">
        <Spinner />
      </div>
    );

  if (lpError)
    return (
      <ErrorComponent
        message={formatErrorMessage(lpError)}
        onClick={() => {
          setLoading(true);
          lpRefetch().finally(() => setLoading(false));
        }}
      />
    );

  if (horizonError)
    return (
      <ErrorComponent
        message={formatErrorMessage(horizonError)}
        onClick={() => {
          setLoading(true);
          horizonRefetch().finally(() => setLoading(false));
        }}
      />
    );

  if (!lpBalance) return null;
  return (
    <>
      <DepositForm form={form} close={close} lpBalance={lpBalance} />
    </>
  );
};

export default DepositModal;
