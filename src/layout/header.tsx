import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/wallet";
import {
  ChevronDown,
  CopyIcon,
  HomeIcon,
  LogOut,
  WalletIcon,
} from "lucide-react";
import copy from "copy-to-clipboard";
import { Link, useLocation } from "react-router-dom";
import * as formatter from "@/utils/formatter";
import Dropdown from "antd/lib/dropdown";
import notification from "antd/lib/notification";
import { useGetAccountBalance } from "@/pages/dashboard/services";
import { formatAmount } from "@/utils";
import { BLND_ISSUER, USDC_ISSUER, CPYT_ISSUER } from "@/constants";

const Header = () => {
  const pathname = useLocation().pathname;
  const { connect, disconnect, connected, walletAddress, isLoading } =
    useWallet();
  const { balance } = useGetAccountBalance(walletAddress || "");
  const handleConnectWallet = (successful: boolean) => {
    if (successful) {
      notification.success({
        message: "Wallet connected.",
      });
    } else {
      notification.error({ message: "Unable to connect wallet." });
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    notification.success({
      message: "Wallet disconnected.",
    });
  };

  const handleClickConnect = () => {
    connect(handleConnectWallet);
  };

  const handleCopyAddress = () => {
    copy(walletAddress || "");
    notification.success({
      message: "Wallet address copied to clipboard.",
    });
  };

  const supportedBalances = balance?.balances?.filter((balance) => {
    return (
      (balance?.asset_issuer === BLND_ISSUER ||
        balance?.asset_issuer === USDC_ISSUER ||
        balance?.asset_issuer === CPYT_ISSUER) &&
      (balance?.asset_code === "USDC" ||
        balance?.asset_code === "CPYT" ||
        balance?.asset_code === "BLND")
    );
  });

  return (
    <div className="bg-white fixed top-0 left-0 w-full z-10">
      <div className="container max-w-[1270px] flex flex-wrap justify-between gap-5 items-center py-3">
        <Link to="/" className="min-w-[50px]">
          <img src="/icons/logo.svg" alt="" />
        </Link>
        {pathname.includes("dashboard") ? (
          <>
            {connected ? (
              <div className="flex items-center gap-5 flex-wrap">
                {supportedBalances?.length ? (
                  <div className="text-sm ">
                    Balances
                    <div className="flex flex-wrap items-center gap-2">
                      {balance?.balances
                        ?.filter((balance) => {
                          return (
                            (balance?.asset_issuer === BLND_ISSUER ||
                              balance?.asset_issuer === USDC_ISSUER ||
                              balance?.asset_issuer === CPYT_ISSUER) &&
                            (balance?.asset_code === "USDC" ||
                              balance?.asset_code === "CPYT" ||
                              balance?.asset_code === "BLND")
                          );
                        })
                        ?.map((balance, index) => {
                          return (
                            <span key={index} className="text-font-semi-bold">
                              {formatAmount(balance?.balance)}{" "}
                              {balance?.asset_type === "native"
                                ? "XLM"
                                : balance?.asset_code}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                ) : null}
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: 0,
                        label: (
                          <Button
                            className="w-full justify-between gap-3"
                            variant={"ghost"}
                            size={"sm"}
                            onClick={() => {
                              handleCopyAddress();
                            }}
                          >
                            Copy Address
                            <CopyIcon size={16} />
                          </Button>
                        ),
                      },
                      {
                        key: 1,
                        label: (
                          <Button
                            className="w-full justify-between text-red-600 gap-3"
                            variant={"ghost"}
                            size={"sm"}
                            onClick={() => {
                              handleDisconnectWallet();
                            }}
                          >
                            Disconnect <LogOut size={16} />
                          </Button>
                        ),
                      },
                    ],
                  }}
                >
                  <Button
                    className="gap-3 md:min-w-[250px] justify-between"
                    variant={"outline"}
                  >
                    <WalletIcon />
                    {formatter.toCompactAddress(walletAddress)}
                    <ChevronDown className="" />
                  </Button>
                </Dropdown>
              </div>
            ) : (
              <Button
                id="connect-wallet-dropdown-button"
                color="primary"
                onClick={handleClickConnect}
                disabled={isLoading}
              >
                Connect Wallet
              </Button>
            )}
          </>
        ) : (
          <Link to={"/dashboard"} className="text-primary">
            <HomeIcon strokeWidth="1" size={32} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
