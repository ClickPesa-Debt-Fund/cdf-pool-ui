import { RETROSHADES_COMMANDS } from "@/utils/retroshades";
import Tabs from "antd/lib/tabs";
import Transactions from "./transactions";
import { DateRangePicker } from "@clickpesa/components-library.inputs.date-range-picker";
import { TextInput } from "@clickpesa/components-library.inputs.text-input";
import { usePagination } from "@/hooks/use-pagination";
import { useTheme } from "@/contexts/theme";

const Activities = ({ walletAddress }: { walletAddress?: string }) => {
  const { theme } = useTheme();
  const { searchKeyword, search, dateRange, setDateRange, setSearchKeyword } =
    usePagination();
  return (
    <div className="mt-4">
      <div className="flex gap-3 justify-between py-3">
        <TextInput
          isFormItem={false}
          name="search"
          mode={theme}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
          }}
          value={searchKeyword}
          placeholder="Search by hash or ledger..."
        />
        <DateRangePicker
          mode={theme}
          onChange={(dateRange) => {
            setDateRange(dateRange);
          }}
          disableDatesAfterToday
          rangePresets={[]}
        />
      </div>
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
                search={search}
                dateRange={dateRange}
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
                search={search}
                dateRange={dateRange}
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
                search={search}
                dateRange={dateRange}
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
                search={search}
                dateRange={dateRange}
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
                search={search}
                dateRange={dateRange}
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
                search={search}
                dateRange={dateRange}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default Activities;
