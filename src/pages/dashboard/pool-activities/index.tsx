import Tabs from "antd/lib/tabs";
import Summary from "./summary";
import Transactions from "./transactions";
import { SelectInput } from "@clickpesa/components-library.inputs.select-input";
import { useEffect, useState } from "react";
import { RETROSHADES_COMMANDS } from "@/utils/retroshades";

const PoolActivities = ({ walletAddress }: { walletAddress?: string }) => {
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  useEffect(() => {
    if (!walletAddress) {
      setSelectedFilter("ALL");
    }
  }, [walletAddress]);

  const userWalletAddress =
    selectedFilter === "INDIVIDUAL" ? walletAddress : "";

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8 space-y-4">
      <h3 className="text-font-semi-bold mb-6 flex gap-3 justify-between flex-wrap">
        Pool Activities{" "}
        <SelectInput
          isFormItem={false}
          options={[
            {
              label: "All Pool Activities",
              value: "ALL",
            },
            ...(walletAddress
              ? [
                  {
                    label: "My Activities",
                    value: "INDIVIDUAL",
                  },
                ]
              : []),
          ]}
          name=""
          placeholder="Filter Data"
          containerStyle={{
            width: "max-content",
            minWidth: "200px",
          }}
          value={selectedFilter}
          onChange={(e) => {
            setSelectedFilter(e);
          }}
        />
      </h3>
      <Summary walletAddress={userWalletAddress} />
      <Tabs
        items={[
          {
            tabKey: "supplies",
            key: "supplies",
            label: "Supplies",
            children: (
              <Transactions
                type={RETROSHADES_COMMANDS.SUPPLY_USDC_TRXS}
                walletAddress={userWalletAddress}
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
                walletAddress={userWalletAddress}
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
                walletAddress={userWalletAddress}
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
                walletAddress={userWalletAddress}
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
                walletAddress={userWalletAddress}
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
                walletAddress={userWalletAddress}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default PoolActivities;
