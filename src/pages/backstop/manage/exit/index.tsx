import Form, { FormInstance } from "antd/lib/form";
import Modal from "antd/lib/modal";
import { BalancesProps } from "../join";
import { requiresTrustline } from "@/utils/horizon";
import { BLND_ASSET, USDC_ASSET } from "@/constants";
import { AccountResponse } from "node_modules/@stellar/stellar-sdk/lib/horizon";
import ExitForm from "./exit-form";
import { Button } from "@/components/ui/button";
import { TxStatus, useWallet } from "@/contexts/wallet";
import { useState } from "react";
import FullPageSpinner from "@/components/other/full-page-loader";
import { ArrowLeft } from "lucide-react";

export type ExitFormProps = {
  form: FormInstance<any>;
  current: number;
  close: () => void;
  updateCurrent: (current: number) => void;
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
  horizonAccount: AccountResponse;
} & BalancesProps) => {
  const { createTrustline, txStatus } = useWallet();
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const hasBLNDTrustline = !requiresTrustline(horizonAccount, BLND_ASSET);
  const hasUSDCTrustline = !requiresTrustline(horizonAccount, USDC_ASSET);

  const onClose = () => {
    form.resetFields();
    close();
  };

  return (
    <>
      {([
        TxStatus.BUILDING,
        txStatus === TxStatus.SIGNING,
        2,
        TxStatus.SUBMITTING,
      ].includes(txStatus) ||
        isLoading) && (
        <FullPageSpinner
          message={
            txStatus === TxStatus.BUILDING
              ? "Preparing your transaction..."
              : txStatus === TxStatus.SIGNING
              ? "Please confirm the transaction in your wallet."
              : txStatus === TxStatus.SUBMITTING
              ? "Submitting your transaction..."
              : ""
          }
        />
      )}
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
            {`Exit BLND-USDC Liquidity Pool`}
          </span>
        }
        footer={false}
        destroyOnClose
        maskClosable={false}
      >
        {(!hasBLNDTrustline || !hasUSDCTrustline) && (
          <div className="space-y-3">
            <p>You dont have trustline for either USDC or BLND. Create.</p>
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
          <ExitForm
            current={current}
            form={form}
            lpBalance={lpBalance}
            usdcBalance={usdcBalance}
            blndBalance={blndBalance}
            backstop={backstop}
            close={onClose}
            refetch={refetch}
            updateCurrent={(current) => setCurrent(current)}
            updateLoading={(loading) => setLoading(loading)}
          />
        )}
      </Modal>
    </>
  );
};

export default ExitModal;
