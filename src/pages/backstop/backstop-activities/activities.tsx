import Q4w from "./activities/q4w";
import Tabs from "antd/lib/tabs";
import Transactions from "./activities/transactions";
import { Networks } from "@stellar/stellar-sdk";
import { NETWORK_PASSPHRASE } from "@/constants";

const Activities = ({ walletAddress }: { walletAddress?: string }) => {
  return (
    <div className="mt-4">
      {NETWORK_PASSPHRASE === Networks.TESTNET ? (
        <>
          <Tabs
            items={[
              {
                key: "deposits",
                label: "Deposits",
                children: (
                  <Transactions
                    type={"DEPOSIT"}
                    walletAddress={walletAddress}
                  />
                ),
              },
              {
                key: "withdraws",
                label: "Withdraws",
                children: (
                  <Transactions
                    type={"WITHDRAW"}
                    walletAddress={walletAddress}
                  />
                ),
              },
              ...(walletAddress
                ? [
                    {
                      key: "q4w",
                      label: "Withdraw Queues",
                      children: <Q4w />,
                    },
                  ]
                : []),
            ]}
            className="w-full"
          />
        </>
      ) : (
        <>
          <h1 className="text-font-semi-bold text-lg">Coming Soon</h1>
        </>
      )}
    </div>
  );
};

export default Activities;
