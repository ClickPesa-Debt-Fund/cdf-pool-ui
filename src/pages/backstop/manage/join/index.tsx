import { Backstop } from "@blend-capital/blend-sdk";
import Form, { FormInstance } from "antd/lib/form";
import { useState } from "react";
import Steps from "antd/lib/steps";
import JoinForm from "./join-form";
import Modal from "antd/lib/modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export type JoinFormProps = {
  form: FormInstance<any>;
  current: number;
  close: () => void;
  updateCurrent: (current: number) => void;
};

export type BalancesProps = {
  lpBalance?: bigint;
  usdcBalance?: string | number;
  blndBalance?: string | number;
  backstop: Backstop | undefined;
  refetch: () => void;
};

const JoinModal = ({
  lpBalance,
  backstop,
  blndBalance,
  usdcBalance,
  open,
  refetch,
  close,
}: {
  open: boolean;
  title?: string;
  close: () => void;
} & BalancesProps) => {
  const [current, setCurrent] = useState(1);
  const [form] = Form.useForm();
  const onClose = () => {
    form.resetFields();
    setCurrent(1);
    close();
  };
  return (
    <>
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
            {`Join BLND-USDC Liquidity Pool`}
          </span>
        }
        footer={false}
        destroyOnClose
        maskClosable={false}
      >
        <Steps
          current={current - 1}
          className="mb-4 mt-3"
          items={[
            {
              title: "Enter Details",
            },
            {
              title: "Summary",
            },
          ]}
        />
        {open && (
          <JoinForm
            current={current}
            form={form}
            lpBalance={lpBalance}
            usdcBalance={usdcBalance}
            blndBalance={blndBalance}
            backstop={backstop}
            close={onClose}
            refetch={refetch}
            updateCurrent={(current) => setCurrent(current)}
          />
        )}
      </Modal>
    </>
  );
};

export default JoinModal;
