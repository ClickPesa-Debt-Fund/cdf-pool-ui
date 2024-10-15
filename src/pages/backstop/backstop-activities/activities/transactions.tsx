import { CurrencyLogos } from "@/components/other/currency-logos";
import Table from "@/components/other/table";
import { STELLER_EXPERT_URL } from "@/constants";
import { formatAmount, formatDate } from "@/utils";
import Summary from "../summary";

const Transactions = ({
  walletAddress,
  type,
}: {
  walletAddress?: string;
  type: "DEPOSIT" | "WITHDRAW";
}) => {
  return (
    <div>
      <Summary type={type} walletAddress={walletAddress} />
      <Table
        data={[]?.map((record: any) => {
          return {
            ...record,
            timestamp: formatDate(record?.timestamp, "MMMM DD, YYYY HH:mm"),
            action: (
              <a
                target="_blank"
                className="link"
                href={STELLER_EXPERT_URL + "/tx/" + record?.ledger}
              >
                View On Stellar Expert
              </a>
            ),
            amount: (
              <span className="inline-flex  items-center gap-3 ">
                {formatAmount(Math.abs(+record?.amount), 7)}{" "}
                <CurrencyLogos name={record?.asset as any} size={"sm"} />
              </span>
            ),
          };
        })}
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
            width: 140,
          },
          {
            title: "Source",
            name: "source",
            width: 530,
          },
          {
            title: "Ledger",
            name: "ledger",
            width: 200,
          },
          {
            title: "Action",
            name: "action",
            width: 150,
            fixed: "right",
          },
        ]}
        loading={false}
        rowKey="ledger"
        totalCount={0}
      />
    </div>
  );
};

export default Transactions;
