import { RETROSHADES_COMMANDS } from "@/utils/retroshades";
import Tabs from "antd/lib/tabs";
import Transactions from "./transactions";

const Activities = ({ walletAddress }: { walletAddress?: string }) => {
  return (
    <div className="mt-4">
      <Tabs
        items={[
          {
            tabKey: "supplies",
            key: "supplies",
            label: "Supplies",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.SUPPLY_USDC_TRXS}
                walletAddress={walletAddress}
              />
            ),
          },
          {
            tabKey: "supply_collateral",
            key: "supply_collateral",
            label: "Collateral Supplies",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.SUPPLY_COLLATERAL_TRXS}
                walletAddress={walletAddress}
              />
            ),
          },
          {
            tabKey: "borrow",
            key: "borrow",
            label: "Borrow",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.BORROW_USDC_TRXS}
                walletAddress={walletAddress}
              />
            ),
          },
          {
            tabKey: "repayments",
            key: "repayments",
            label: "Repayments",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.REPAY_USDC_TRXS}
                walletAddress={walletAddress}
              />
            ),
          },
          {
            tabKey: "withdraws",
            key: "withdraws",
            label: "Withdraws",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.WITHDRAW_USDC_TRXS}
                walletAddress={walletAddress}
              />
            ),
          },
          {
            tabKey: "withdraw_collateral",
            key: "withdraw_collateral",
            label: "Withdraw Collateral",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.WITHDRAW_COLLATERAL_TRXS}
                walletAddress={walletAddress}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Activities;
