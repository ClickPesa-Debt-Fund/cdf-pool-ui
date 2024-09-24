import { CurrencyLogos } from "@clickpesa/components-library.currency-logos";
import PoolActivities from "./components/pool-activities";
import PoolDetails from "./components/pool-details";
import UserPositionDetails from "./components/user-position-details";
import { TxStatus, useWallet } from "@/contexts/wallet";
import notification from "antd/lib/notification";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import { Button } from "@/components/ui/button";
import { toCompactAddress } from "@/utils/formatter";
import { Alert } from "@clickpesa/components-library.alert";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import FullPageSpinner from "@/components/other/full-page-loader";
import { BLND_ISSURER, POOL_ID, USDC_ISSURER } from "@/constants";
import { usePool } from "@/services";
import Spinner from "@/components/other/spinner";

const Dashboard = () => {
  const safePoolId =
    typeof POOL_ID == "string" && /^[0-9A-Z]{56}$/.test(POOL_ID) ? POOL_ID : "";
  const { isLoading } = usePool(safePoolId, true);

  const { connected, walletAddress, faucet, txStatus } = useWallet();
  const [loading, setLoading] = useState(false);
  const { balance, balanceError, balanceRefetch } = useGetAccountBalance(
    walletAddress || ""
  );
  const supportedBalances = balance?.balances?.filter((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSURER ||
        balance?.asset_issuer === USDC_ISSURER) &&
      (balance?.asset_code === "USDC" ||
        balance?.asset_code === "CPYT" ||
        balance?.asset_code === "BLND")
    );
  });

  let needsFaucet = false;
  if (balance && !supportedBalances?.length) {
    needsFaucet = true;
  }

  const handleFaucet = async () => {
    if (connected) {
      setLoading(true);
      faucet()
        .then(() => {
          balanceRefetch();
          notification.success({
            message: "Test network assets added to wallet.",
          });
        })
        .catch(() => {
          notification.error({
            message: "Something Went Wrong",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const notFound = balanceError?.response?.status === 404;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="md:space-y-[30px] space-y-[24px] md:py-[100px] py-[90px] container max-w-[1270px] min-h-full">
      {loading && (
        <FullPageSpinner
          message={
            txStatus === TxStatus.SIGNING
              ? "Please confirm the transaction in your wallet."
              : txStatus === TxStatus.BUILDING
              ? "Preparing your transaction..."
              : ""
          }
        />
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-2 [font-size:_clamp(22px,5vw,32px)] font-bold text-font-bold">
          <CurrencyLogos name={"USDC"} />
          <span className="inline-flex h-[50px] min-w-[50px] bg-[#2775CA]/10 rounded-full justify-center items-center">
            <img
              src="/icons/logo.svg"
              alt=""
              className="md:h-[34px] h-[34px]"
            />
          </span>
          SMEs
        </div>
        {connected ? (
          <div>
            {notFound && (
              <Alert
                color="gold"
                subtitle={
                  <>
                    The wallet address {toCompactAddress(walletAddress)} does
                    not exist on the network. Please fund your account!
                  </>
                }
              />
            )}
            {needsFaucet && (
              <>
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    handleFaucet();
                  }}
                  size={"lg"}
                  className="w-full justify-between !bg-white"
                >
                  Click here to receive assets for the Blend test network.
                  <ArrowRight />
                </Button>
              </>
            )}
          </div>
        ) : null}
      </div>
      <PoolDetails />
      <UserPositionDetails />
      <PoolActivities />
    </div>
  );
};

export default Dashboard;
