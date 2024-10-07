import PoolActivities from "./pool-activities";
import PoolDetails from "./components/pool-details";
import UserPositionDetails from "./components/user-position-details";
import { useWallet } from "@/contexts/wallet";
import notification from "antd/lib/notification";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import { Button } from "@/components/ui/button";
import { toCompactAddress } from "@/utils/formatter";
import { Alert } from "@clickpesa/components-library.alert";
import { ArrowRight } from "lucide-react";
import {
  BLND_ISSUER,
  COLLATERAL_ASSET_CODE,
  CPYT_ISSUER,
  POOL_ID,
  USDC_ISSUER,
} from "@/constants";
import { usePool } from "@/services";
import Spinner from "@/components/other/spinner";
import AdminPosition from "./components/admin-position";
import { Networks } from "@stellar/stellar-sdk";
import { formatErrorMessage } from "@/utils";
import { CurrencyLogos } from "@/components/other/currency-logos";

const Dashboard = () => {
  const safePoolId =
    typeof POOL_ID == "string" && /^[0-9A-Z]{56}$/.test(POOL_ID) ? POOL_ID : "";
  const { isLoading } = usePool(safePoolId, true);

  const { connected, walletAddress, faucet } = useWallet();
  const { balance, balanceError, balanceRefetch } = useGetAccountBalance(
    walletAddress || ""
  );

  const supportedBalances = balance?.balances?.filter((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSUER ||
        balance?.asset_issuer === USDC_ISSUER) &&
      (balance?.asset_code === "USDC" || balance?.asset_code === "BLND")
    );
  });

  const supportedCollateralBalances = balance?.balances?.filter((balance) => {
    return (
      balance?.asset_issuer === CPYT_ISSUER &&
      balance?.asset_code === COLLATERAL_ASSET_CODE
    );
  });

  let needsFaucet = false;
  let needCollateralFaucet = false;
  if (balance && !supportedBalances?.length) {
    needsFaucet = true;
  }
  if (balance && !supportedCollateralBalances?.length) {
    needCollateralFaucet = true;
  }

  const handleFaucet = async (collateral: boolean) => {
    if (connected) {
      faucet(collateral)
        .then(() => {
          balanceRefetch();
          notification.success({
            message: "Test network assets added to wallet.",
          });
        })
        .catch((error) => {
          notification.error({
            message: formatErrorMessage(error) || "Something Went Wrong",
          });
        });
    }
  };

  const notFound = balanceError?.response?.status === 404;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="md:space-y-[30px] space-y-[24px] md:py-[100px] py-[90px] container max-w-[1270px] min-h-full">
      <div className="space-y-4">
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

            {import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE ===
              Networks.TESTNET && (
              <div>
                {needsFaucet && (
                  <>
                    <div>
                      <Button
                        variant={"secondary"}
                        onClick={() => {
                          handleFaucet(false);
                        }}
                        size={"lg"}
                        className="w-full justify-between !bg-white p-0"
                      >
                        <Alert
                          style={{
                            width: "100%",
                          }}
                          color="blue"
                          subtitle={
                            <div className="flex justify-between">
                              Click here to receive assets for the Blend test
                              network.
                              <ArrowRight />
                            </div>
                          }
                        />
                      </Button>
                    </div>
                    {needCollateralFaucet && <br />}
                  </>
                )}
                {needCollateralFaucet && (
                  <div>
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        handleFaucet(true);
                      }}
                      size={"lg"}
                      className="w-full justify-between p-0"
                    >
                      <Alert
                        style={{
                          width: "100%",
                        }}
                        color="blue"
                        subtitle={
                          <div className="flex justify-between">
                            Click here to receive CPYT assets for the
                            Collateral.
                            <ArrowRight />
                          </div>
                        }
                      />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
        <div className="flex items-center gap-2 [font-size:_clamp(22px,5vw,32px)] font-bold text-font-bold">
          <CurrencyLogos name={"USDC"} />
          <span className="inline-flex h-[50px] min-w-[50px] bg-[#2775CA]/10 rounded-full justify-center items-center">
            <img
              src="/icons/logo.svg"
              alt=""
              className="md:h-[34px] h-[34px]"
            />
          </span>
          DebtFund SME Pool
        </div>
      </div>
      <PoolDetails />
      {supportedCollateralBalances?.length ? <AdminPosition /> : null}
      <UserPositionDetails />
      <PoolActivities walletAddress={walletAddress} />
    </div>
  );
};

export default Dashboard;
