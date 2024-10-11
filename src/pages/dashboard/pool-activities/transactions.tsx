import { CurrencyLogos } from "@/components/other/currency-logos";
import Table from "@/components/other/table";
import { USDC_ASSET_ID, STELLER_EXPERT_URL } from "@/constants";
import { useRetroshades } from "@/services";
import { formatAmount, formatDate } from "@/utils";
import { RETROSHADES_COMMANDS } from "@/utils/retroshades";

const Transactions = ({
  type,
  walletAddress,
}: {
  walletAddress?: string;
  type: RETROSHADES_COMMANDS;
}) => {
  const { data, isLoading } = useRetroshades({ command: type, walletAddress });

  return (
    <div>
      <Table
        data={removeDuplicates(data || [], "transaction")?.map(
          (record: any) => {
            return {
              ...record,
              timestamp: formatDate(
                new Date(Number(record?.timestamp + "000")).toISOString(),
                "MMMM DD, YYYY HH:mm"
              ),
              action: (
                <a
                  target="_blank"
                  className="link"
                  href={STELLER_EXPERT_URL + "/tx/" + record?.transaction}
                >
                  View On Stellar Expert
                </a>
              ),
              amount: (
                <span className="inline-flex  items-center gap-3 ">
                  {formatAmount(+record?.usdc_amount, 7)}{" "}
                  {record?.reserve_address === USDC_ASSET_ID ? "USDC" : "CPYT"}
                  <CurrencyLogos
                    name={
                      record?.reserve_address === USDC_ASSET_ID
                        ? "USDC"
                        : "CPYT"
                    }
                    size={"sm"}
                  />
                </span>
              ),
            };
          }
        )}
        columns={[
          {
            title: "Date",
            name: "timestamp",
            width: 200,
          },
          {
            title: "Amount",
            name: "amount",
            align: "right",
            width: 200,
          },
          // {
          //   title: "Action Type",
          //   name: "action_type",
          //   align: "right",
          //   width: 200,
          // },
          {
            title: "Source",
            name: "user_address",
            width: 530,
          },
          {
            title: "Asset ID",
            name: "reserve_address",
            width: 530,
          },
          {
            title: "Ledger",
            name: "ledger",
            width: 200,
          },
          {
            title: "Transaction Hash",
            name: "transaction",
            width: 560,
          },
          {
            title: "Action",
            name: "action",
            width: 180,
            fixed: "right",
          },
        ]}
        loading={isLoading}
        rowKey="ledger"
        totalCount={data?.length}
      />
    </div>
  );
};

const removeDuplicates = (arr: any[], key: string) => {
  const seen = new Set();
  return arr.reduce((acc, current) => {
    if (!seen.has(current[key])) {
      seen.add(current[key]);
      acc.push(current);
    }
    return acc;
  }, []);
};

export default Transactions;
