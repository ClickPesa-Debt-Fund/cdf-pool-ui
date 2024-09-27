import Modal from "antd/lib/modal";
import { useState } from "react";
import Form, { FormInstance } from "antd/lib/form";
import Tabs from "antd/lib/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "@/contexts/wallet";
import {
  useBackstop,
  useGetAccountBalance,
  useHorizonAccount,
  useTokenBalance,
} from "@/pages/dashboard/services";
import ErrorComponent from "@/components/other/error-component";
import { formatErrorMessage } from "@/utils";
import Spinner from "@/components/other/spinner";
import Join from "./join";
import Exit from "./exit";
import Balances from "./balances";

const BLND_ISSURER = import.meta.env.VITE_BLND_ISSUER;
const USDC_ISSURER = import.meta.env.VITE_USDC_ISSUER;

export type ManageFormProps = {
  form: FormInstance<any>;
  current: number;
  close: () => void;
  updateCurrent: (current: number) => void;
};

const ManageModal = ({
  open,

  title,
  close,
}: {
  open: boolean;

  title?: string;
  close: () => void;
}) => {
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
          {title || `80:20 BLND-USDC Liquidity Pool`}
        </span>
      }
      footer={false}
      destroyOnClose
      maskClosable={false}
    >
      <Manage
        form={form}
        current={current}
        updateCurrent={(current) => setCurrent(current)}
        close={onClose}
      />
    </Modal>
  );
};

const Manage = ({ form, current, close, updateCurrent }: ManageFormProps) => {
  const [isLoading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("join");
  const { walletAddress } = useWallet();
  const { balance, balanceError, balanceLoading, balanceRefetch } =
    useGetAccountBalance(walletAddress || "");
  const { data: backstop, refetch: backstopRefetch } = useBackstop();
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
  const loading =
    isLoading || balanceLoading || lpBalanceLoading || horizonLoading;

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

  if (!balance) return null;
  const supportedBalances = balance?.balances?.filter((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSURER ||
        balance?.asset_issuer === USDC_ISSURER) &&
      (balance?.asset_code === "BLND" || balance?.asset_code === "USDC")
    );
  });
  if (!supportedBalances?.length) {
    return <ErrorComponent message="You have no supported asset" />;
  }
  return (
    <div className="space-y-3">
      <Balances
        lpBalance={lpBalance}
        usdcBalance={
          supportedBalances?.find((balance) => {
            return (
              balance?.asset_issuer === USDC_ISSURER &&
              balance?.asset_code === "USDC"
            );
          })?.balance || "0"
        }
        blndBalance={
          supportedBalances?.find((balance) => {
            return (
              balance?.asset_issuer === BLND_ISSURER &&
              balance?.asset_code === "BLND"
            );
          })?.balance || "0"
        }
      />
      <Tabs
        items={[
          {
            key: "join",
            label: "Join Pool",
            children: (
              <Join
                current={current}
                updateCurrent={updateCurrent}
                form={form}
                close={close}
                backstop={backstop}
                lpBalance={lpBalance}
                usdcBalance={
                  supportedBalances?.find((balance) => {
                    return (
                      balance?.asset_issuer === USDC_ISSURER &&
                      balance?.asset_code === "USDC"
                    );
                  })?.balance || "0"
                }
                blndBalance={
                  supportedBalances?.find((balance) => {
                    return (
                      balance?.asset_issuer === BLND_ISSURER &&
                      balance?.asset_code === "BLND"
                    );
                  })?.balance || "0"
                }
                refetch={() => {
                  balanceRefetch();
                  lpRefetch();
                  backstopRefetch();
                }}
              />
            ),
          },
          {
            key: "exit",
            label: "Exit Pool",
            children: (
              <Exit
                current={current}
                updateCurrent={updateCurrent}
                form={form}
                close={close}
              />
            ),
          },
        ]}
        onChange={(tab) => {
          if (tab !== currentTab) {
            form.resetFields();
            updateCurrent(1);
            setCurrentTab(tab);
          }
        }}
      />
    </div>
  );
};

export default ManageModal;
