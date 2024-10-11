import Form, { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal";
import { BalancesProps } from "../join";
import { requiresTrustline } from "@/utils/horizon";
import { BLND_ASSET, USDC_ASSET } from "@/constants";
import ExitForm from "./exit-form";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet";

export type ExitFormProps = {
  form: FormInstance<any>;

  close: () => void;
};

const ExitModal = ({
  open,
  refetch,
  backstop,
  lpBalance,
  usdcBalance,
  blndBalance,
  close,
  horizonAccount,
}: {
  open: boolean;
  close: () => void;
  horizonAccount: HorizonAccountType;
} & BalancesProps) => {
  const { createTrustline } = useWallet();
  const [form] = Form.useForm();

  const hasBLNDTrustline = !requiresTrustline(horizonAccount, BLND_ASSET);
  const hasUSDCTrustline = !requiresTrustline(horizonAccount, USDC_ASSET);

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
            {`Exit BLND-USDC Liquidity Pool`}
          </span>
        }
        footer={false}
        destroyOnClose
        maskClosable={false}
      >
        {(!hasBLNDTrustline || !hasUSDCTrustline) && (
          <div className="space-y-3">
            <p>You don't have trustline for either USDC or BLND. Create.</p>
            <div className="flex gap-2">
              {hasUSDCTrustline && (
                <Button
                  onClick={async () =>
                    createTrustline(USDC_ASSET).finally(() => {
                      refetch();
                    })
                  }
                >
                  Create USDC TrustLine
                </Button>
              )}
              {hasBLNDTrustline && (
                <Button
                  onClick={async () =>
                    createTrustline(BLND_ASSET).finally(() => {
                      refetch();
                    })
                  }
                >
                  Create BLND Trustline
                </Button>
              )}
            </div>
          </div>
        )}
        {hasBLNDTrustline && hasUSDCTrustline && (
          <>
            <ExitForm
              form={form}
              lpBalance={lpBalance}
              usdcBalance={usdcBalance}
              blndBalance={blndBalance}
              backstop={backstop}
              close={onClose}
              refetch={refetch}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default ExitModal;
