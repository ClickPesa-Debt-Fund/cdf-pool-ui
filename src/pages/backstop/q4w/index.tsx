import Modal from "antd/lib/modal";
import Form, { FormInstance } from "antd/lib/form";
import Q4WForm from "./q4w-form";

export type Q4WFormProps = {
  form: FormInstance<any>;

  close: () => void;
};

const Q4WModal = ({ open, close }: { open: boolean; close: () => void }) => {
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
          {"Queue BLND-USDC LP for Withdrawal"}
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
      {open && <Q4W form={form} close={onClose} />}
    </Modal>
  );
};

const Q4W = ({ close, form }: Q4WFormProps) => {
  return (
    <>
      <Q4WForm form={form} close={close} />
    </>
  );
};

export default Q4WModal;
