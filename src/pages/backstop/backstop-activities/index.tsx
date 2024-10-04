import Tabs from "antd/lib/tabs";
import Q4w from "./activities/q4w";
import Summary from "./summary";
import { useEffect, useState } from "react";
import Transactions from "./activities/transactions";
import { SelectInput } from "@clickpesa/components-library.inputs.select-input";

const BackstopActivities = ({ walletAddress }: { walletAddress?: string }) => {
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  useEffect(() => {
    if (!walletAddress) {
      setSelectedFilter("ALL");
    }
  }, [walletAddress]);

  const userWalletAddress =
    selectedFilter === "INDIVIDUAL" ? walletAddress : "";

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 px-3 md:p-8 md:px-3">
      <h3 className="text-font-semi-bold mb-6 px-3 md:px-5 flex gap-3 justify-between flex-wrap">
        Backstop Activities
        <SelectInput
          isFormItem={false}
          options={[
            {
              label: "All Backstop Activities",
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
            key: "deposits",
            label: "Deposits",
            children: (
              <Transactions
                type={"DEPOSIT"}
                walletAddress={userWalletAddress}
              />
            ),
          },
          {
            key: "withdraws",
            label: "Withdraws",
            children: (
              <Transactions
                type={"WITHDRAW"}
                walletAddress={userWalletAddress}
              />
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

export default BackstopActivities;
