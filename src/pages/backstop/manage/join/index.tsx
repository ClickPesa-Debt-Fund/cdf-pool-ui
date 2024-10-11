import { Backstop } from "@blend-capital/blend-sdk";
import Form, { FormInstance } from "antd/lib/form";
import JoinForm from "./join-form";
import Modal from "antd/lib/modal";

export type JoinFormProps = {
  form: FormInstance<any>;

  close: () => void;
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
  const [form] = Form.useForm();
  const onClose = () => {
    form.resetFields();

    close();
  };
  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        title={
          <span className="inline-flex items-center gap-3">
            {`Join BLND-USDC Liquidity Pool`}
          </span>
        }
        footer={false}
        destroyOnClose
        maskClosable={false}
      >
        {open && (
          <JoinForm
            form={form}
            lpBalance={lpBalance}
            usdcBalance={usdcBalance}
            blndBalance={blndBalance}
            backstop={backstop}
            close={onClose}
            refetch={refetch}
          />
        )}
      </Modal>
    </>
  );
};

export default JoinModal;
