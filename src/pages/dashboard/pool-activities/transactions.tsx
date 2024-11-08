import { CurrencyLogos } from "@/components/other/currency-logos";
import Table from "@/components/other/table";
import {
  USDC_ASSET_ID,
  STELLER_EXPERT_URL,
  COLLATERAL_ASSET_CODE,
} from "@/constants";
import { useRetroshades } from "@/services";
import { formatAmount, formatDate } from "@/utils";
import { RETROSHADES_COMMANDS } from "@/utils/retroshades";
import { EyeIcon } from "lucide-react";
import { toCompactAddress } from "@/utils/formatter";
import Summary from "./summary";
import { usePagination } from "@/hooks/use-pagination";

const Transactions = ({
  type,
  walletAddress,
  search,
  dateRange,
}: {
  walletAddress?: string;
  type: RETROSHADES_COMMANDS;
  search?: string;
  dateRange?: string[];
}) => {
  const {
    limit,
    skip,
    orderBy,
    sortBy,
    setSkip,
    setLimit,
    setOrderBy,
    setSortBy,
  } = usePagination();
  const { data, isLoading } = useRetroshades({
    command: type,
    params: {
      walletAddress,
      skip,
      limit,
      search,
      sortBy,
      orderBy,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    },
  });

  return (
    <div>
      <Summary
        walletAddress={walletAddress}
        type={type}
        search={search}
        dateRange={dateRange}
      />
      <Table
        data={(data?.[0]?.data || [])?.map((record: any) => {
          return {
            ...record,
            timestamp: formatDate(
              new Date(Number(record?.timestamp + "000")).toISOString(),
              "MMMM DD, YYYY HH:mm"
            ),
            user_address: toCompactAddress(record?.user_address),
            reserve_address: toCompactAddress(record?.reserve_address),
            transaction: toCompactAddress(record?.transaction),
            action: (
              <a
                target="_blank"
                className="link"
                href={STELLER_EXPERT_URL + "/tx/" + record?.transaction}
              >
                <EyeIcon size={18} />
              </a>
            ),
            amount: (
              <span className="inline-flex  items-center gap-3 ">
                {formatAmount(+(record?.amount || 0) / 10 ** 7, 7)}{" "}
                {record?.reserve_address === USDC_ASSET_ID
                  ? "USDC"
                  : COLLATERAL_ASSET_CODE}
                <CurrencyLogos
                  name={
                    record?.reserve_address === USDC_ASSET_ID
                      ? "USDC"
                      : COLLATERAL_ASSET_CODE
                  }
                  size={"sm"}
                />
              </span>
            ),
          };
        })}
        columns={[
          {
            title: "Date",
            name: "timestamp",
            width: 150,
            sorter: true,
          },
          {
            title: "Amount",
            name: "amount",
            align: "right",
            width: 180,
            sorter: true,
          },
          {
            title: "Source",
            name: "user_address",
            width: 110,
          },
          {
            title: "Asset ID",
            name: "reserve_address",
            width: 120,
          },
          {
            title: "Ledger",
            name: "ledger",
            width: 100,
            sorter: true,
          },
          {
            title: "Hash",
            name: "transaction",
            width: 110,
            sorter: true,
          },
          {
            title: "Action",
            name: "action",
            width: 80,
          },
        ]}
        loading={isLoading}
        rowKey="transaction"
        totalCount={data?.[0]?.totalcount}
        limit={limit}
        setSkip={setSkip}
        setLimit={setLimit}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
      />
    </div>
  );
};

export default Transactions;
