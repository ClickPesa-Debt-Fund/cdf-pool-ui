import Modal from "antd/lib/modal";
import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import Steps from "antd/lib/steps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Q4WForm from "./q4w-form";

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
      {open && (
        <Q4W
          form={form}
          current={current}
          updateCurrent={(current) => setCurrent(current)}
          close={onClose}
        />
      )}
    </Modal>
  );
};

const Q4W = ({ current, close, updateCurrent, form }: Q4WFormProps) => {
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
      <Q4WForm
        form={form}
        close={close}
        current={current}
        updateCurrent={updateCurrent}
      />
    </>
  );
};

export default Q4WModal;
