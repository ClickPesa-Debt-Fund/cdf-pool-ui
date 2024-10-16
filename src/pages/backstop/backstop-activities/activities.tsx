import Q4w from "./activities/q4w";
import Tabs from "antd/lib/tabs";
import Transactions from "./activities/transactions";

const Activities = ({ walletAddress }: { walletAddress?: string }) => {
  return (
    <div className="mt-4">
      <Tabs
        items={[
          {
            key: "deposits",
            label: "Deposits",
            children: (
              <Transactions type={"DEPOSIT"} walletAddress={walletAddress} />
            ),
          },
          {
            key: "withdraws",
            label: "Withdraws",
            children: (
              <Transactions type={"WITHDRAW"} walletAddress={walletAddress} />
            ),
          },
          ...(walletAddress
            ? [
                {
                  key: "q4w",
                  label: "Withdrawal Queues",
                  children: <Q4w />,
                },
              ]
            : []),
        ]}
        className="w-full"
      />
    </div>
  );
};

export default Activities;
