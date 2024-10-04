import { CurrencyLogos } from "@/components/other/currency-logos";
import Table from "@/components/other/table";
import { stellarExpertHashUrl } from "@/constants";
import { formatAmount, formatDate } from "@/utils";

const Transactions = ({
  walletAddress,
  type,
}: {
  walletAddress?: string;
  type: "DEPOSIT" | "WITHDRAW";
}) => {
  const transactionsData = generateBackstopTransactionData(
    100,
    walletAddresses
  )?.filter(
    (record) =>
      (!walletAddress || walletAddress === record?.source) &&
      ((type === "DEPOSIT" && Number(record?.amount) < 0) ||
        (type === "WITHDRAW" && Number(record?.amount) > 0))
  );
  return (
    <div>
      <Table
        data={transactionsData?.map((record) => {
          return {
            ...record,
            timestamp: formatDate(record?.timestamp, "MMMM DD, YYYY HH:mm"),
            action: (
              <a
                target="_blank"
                className="link"
                href={stellarExpertHashUrl + record?.ledger}
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
        totalCount={transactionsData?.length}
      />
    </div>
  );
};

export default Transactions;

type BackstopTransaction = {
  timestamp: string;
  ledger: string; // Ledger is a hash
  asset: string; // Always "BLND-USDC LP"
  source: string; // Wallet address
  amount: string; // Positive for deposit, negative for withdrawal
};

function generateBackstopTransactionData(
  numRecords: number,
  walletAddresses: string[]
): BackstopTransaction[] {
  const transactions: BackstopTransaction[] = [];

  for (let i = 0; i < numRecords; i++) {
    // Randomly choose a positive or negative amount for deposit or withdrawal
    const amount =
      (Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000) *
      (Math.random() > 0.5 ? 1 : -1);

    const transaction: BackstopTransaction = {
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      ledger: `ledger_hash_${i}`,
      asset: "BLND-USDC LP", // Fixed asset type
      source:
        walletAddresses[Math.floor(Math.random() * walletAddresses.length)], // Random wallet address
      amount: amount.toString(), // Amount: positive for deposit, negative for withdrawal
    };

    transactions.push(transaction);
  }

  return transactions;
}

// Usage example
const walletAddresses = [
  "GAPA74UEBLLFTMXDZKCRZTDED3W5AFLF5FKN52O6ZT4UOSB4LOF2Q4QO",
  "GDLFWOISLDAE7MWTQXE6DZOJZYM2CTBKSQX3CE6B6ITBM7SUXJX7HLFL",
  "GDP253EYABCLUTTICY5DRAR54I73YCIQGZ7YLCP3TOCH6GYTDUTPGOEB",
];
