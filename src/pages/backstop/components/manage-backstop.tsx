import ErrorComponent from "@/components/other/error-component";
import Spinner from "@/components/other/spinner";
import {
  BLND_ISSUER,
  CONNECTION_ERROR_MESSAGE,
  USDC_ISSUER,
} from "@/constants";
import { useWallet } from "@/contexts/wallet";
import {
  useBackstop,
  useHorizonAccount,
  useTokenBalance,
} from "@/pages/dashboard/services";
import { formatAmount, formatErrorMessage } from "@/utils";
import { useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { Button } from "@/components/ui/button";
import JoinModal from "../manage/join";
import ExitModal from "../manage/exit";
import { SectionTemplate } from "@clickpesa/components-library.section-template";
import { useTheme } from "@/contexts/theme";

const ManageBackstop = () => {
  const { theme } = useTheme();
  const [openJoin, setOpenJoin] = useState(false);
  const [openExit, setOpenExit] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { connected, connect } = useWallet();
  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
    refetch: balanceRefetch,
  } = useHorizonAccount();
  const { data: backstop, refetch: backstopRefetch } = useBackstop();

  const {
    data: lpBalance,
    error: lpError,
    refetch: lpRefetch,
    isLoading: lpBalanceLoading,
  } = useTokenBalance(backstop?.backstopToken?.id ?? "", undefined, balance);
  const loading = isLoading || balanceLoading || lpBalanceLoading;

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

  const usdcBalance =
    balance?.balances?.find((balance) => {
      return (
        balance?.asset_issuer === USDC_ISSUER && balance?.asset_code === "USDC"
      );
    })?.balance || "0";

  const blndBalance =
    balance?.balances?.find((balance) => {
      return (
        balance?.asset_issuer === BLND_ISSUER && balance?.asset_code === "BLND"
      );
    })?.balance || "0";

  return (
    <SectionTemplate sectionTitle="Manage Backstop Token" mode={theme}>
      <Row gutter={[12, 12]} justify={"space-between"}>
        <Col md={16} span={24}>
          <Row gutter={[12, 12]} justify={"space-between"}>
            <DetailContentItem
              title="Your LP Token Balance"
              content={formatAmount(Number(lpBalance || 0) / 10 ** 7, 7)}
              style={{
                marginTop: 0,
              }}
              mode={theme}
            />
            <DetailContentItem
              title="Your BLND Balance"
              content={formatAmount(+(blndBalance || "0"), 7)}
              style={{
                marginTop: 0,
              }}
              mode={theme}
            />
            <DetailContentItem
              title="Your USDC Balance"
              content={formatAmount(+(usdcBalance || "0"), 7)}
              style={{
                marginTop: 0,
              }}
              mode={theme}
            />
          </Row>
        </Col>
        <Col md={6} span={24} className="space-y-4">
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenJoin(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenJoin(true);
                  } else {
                    notification.error({
                      message: CONNECTION_ERROR_MESSAGE,
                    });
                  }
                });
              }
            }}
          >
            Join
          </Button>
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => {
              if (connected) {
                setOpenExit(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenExit(true);
                  } else {
                    notification.error({
                      message: CONNECTION_ERROR_MESSAGE,
                    });
                  }
                });
              }
            }}
          >
            Exit
          </Button>
        </Col>
      </Row>
      <JoinModal
        open={openJoin}
        close={() => setOpenJoin(false)}
        lpBalance={lpBalance}
        usdcBalance={usdcBalance}
        blndBalance={blndBalance}
        refetch={() => {
          balanceRefetch();
          lpRefetch();
          backstopRefetch();
        }}
        backstop={backstop}
      />
      {balance && (
        <ExitModal
          open={openExit}
          close={() => setOpenExit(false)}
          refetch={() => {
            balanceRefetch();
            lpRefetch();
            backstopRefetch();
          }}
          horizonAccount={balance}
          backstop={backstop}
          lpBalance={lpBalance}
          usdcBalance={usdcBalance}
          blndBalance={blndBalance}
        />
      )}
    </SectionTemplate>
  );
};

export default ManageBackstop;
