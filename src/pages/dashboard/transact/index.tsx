import Modal from "antd/lib/modal";
import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import ErrorComponent from "@/components/other/error-component";
import { formatErrorMessage } from "@/utils";
import Spinner from "@/components/other/spinner";
import TransactForm from "./transact-form";
import {
  BLND_ISSUER,
  COLLATERAL_ASSET_CODE,
  COLLATERAL_ISSUER,
  USDC_ISSUER,
} from "@/constants";
import { useHorizonAccount } from "../services";

export type TransactFormProps = {
  form: FormInstance<any>;

  type: RequestTypeProp;
  asset: "USDC" | typeof COLLATERAL_ASSET_CODE;
  close: () => void;
};

const TransactModal = ({
  open,
  type,
  asset,
  title,
  close,
}: {
  open: boolean;
  type: RequestTypeProp;
  asset: "USDC" | typeof COLLATERAL_ASSET_CODE;
  title?: string;
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
          {title || `Transact ${asset}`}
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
      <Transact form={form} close={onClose} type={type} asset={asset} />
    </Modal>
  );
};

const Transact = ({ form, type, asset, close }: TransactFormProps) => {
  const [isLoading, setLoading] = useState(false);
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
    refetch: balanceRefetch,
  } = useHorizonAccount();

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
      (balance?.asset_issuer === BLND_ISSUER ||
        balance?.asset_issuer === USDC_ISSUER ||
        balance?.asset_issuer === COLLATERAL_ISSUER) &&
      balance?.asset_code === asset
    );
  });
  //   if no error component
  if (!supportedBalances?.length) {
    return <ErrorComponent message="You have no supported asset" />;
  }
  return <TransactForm close={close} form={form} type={type} asset={asset} />;
};

export default TransactModal;
