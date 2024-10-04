import Tabs from "antd/lib/tabs";
import Summary from "./summary";
import Transactions from "./transactions";
import { COLLATERAL_ASSET_CODE } from "@/constants";
import { SelectInput } from "@clickpesa/components-library.inputs.select-input";
import { useEffect, useState } from "react";

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
      <Summary />
      <Tabs
        items={[
          {
            tabKey: "supplies",
            key: "supplies",
            label: "Supplies",
            children: (
              <Transactions
                type="SUPPLY"
                asset="USDC"
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
                type="SUPPLY"
                asset={COLLATERAL_ASSET_CODE}
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
                type="BORROW"
                asset="USDC"
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
                type="SUPPLY"
                asset="USDC"
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
                type="SUPPLY"
                asset="USDC"
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
                type="SUPPLY"
                asset={COLLATERAL_ASSET_CODE}
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
