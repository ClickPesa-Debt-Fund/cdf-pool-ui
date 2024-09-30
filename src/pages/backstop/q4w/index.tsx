import Modal from "antd/lib/modal";
import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import Steps from "antd/lib/steps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "@/contexts/wallet";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import ErrorComponent from "@/components/other/error-component";
import { formatErrorMessage } from "@/utils";
import Spinner from "@/components/other/spinner";
import { BLND_ISSUER, CPYT_ISSUER, USDC_ISSUER } from "@/constants";

export type Q4WFormProps = {
  form: FormInstance<any>;
  current: number;
  close: () => void;
  updateCurrent: (current: number) => void;
};

const Q4WModal = ({ open, close }: { open: boolean; close: () => void }) => {
  const [current, setCurrent] = useState(1);

  const [form] = Form.useForm();
  const onClose = () => {
    form.resetFields();
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
          {"Queue BLND-USDC LP for Withdrawal"}
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
      <Q4W
        form={form}
        current={current}
        updateCurrent={(current) => setCurrent(current)}
        close={onClose}
      />
    </Modal>
  );
};

const Q4W = ({ current }: Q4WFormProps) => {
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
      balance?.asset_issuer === BLND_ISSUER ||
      balance?.asset_issuer === USDC_ISSUER ||
      balance?.asset_issuer === CPYT_ISSUER
    );
  });
  //   if no error component
  if (!supportedBalances?.length) {
    return <ErrorComponent message="You have no supported asset" />;
  }
  return (
    <>
      <Steps
        current={current - 1}
        className="mb-4 mt-3"
        items={[
          {
            title: "Amount",
          },
          {
            title: "KYC",
          },
          {
            title: "Summary",
          },
        ]}
      />
    </>
  );
};

export default Q4WModal;
