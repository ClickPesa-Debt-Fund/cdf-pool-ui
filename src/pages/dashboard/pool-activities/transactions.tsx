import { CurrencyLogos } from "@/components/other/currency-logos";
import Table from "@/components/other/table";
import { COLLATERAL_ASSET_CODE, stellarExpertHashUrl } from "@/constants";
import { formatAmount, formatDate } from "@/utils";

const Transactions = ({
  // type,
  walletAddress,
  asset,
}: {
  walletAddress?: string;
  asset?: typeof COLLATERAL_ASSET_CODE | "USDC";
  type: "SUPPLY" | "BORROW";
}) => {
  const transactionsData = generateTransactionData(
    100,
    walletAddresses,
    COLLATERAL_ASSET_CODE
  )?.filter(
    (record) =>
      (record?.asset === asset || !asset) &&
      (!walletAddress || walletAddress === record?.source)
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
                {formatAmount(+record?.amount, 7)}{" "}
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

type Transaction = {
  action: string;
  timestamp: string;
  ledger: string; // Ledger is a hash
  asset: string;
  source: string;
  amount: string;
};

function generateTransactionData(
  numRecords: number,
  walletAddresses: string[],
  assetCode: string
): Transaction[] {
  const transactions: Transaction[] = [];

  for (let i = 0; i < numRecords; i++) {
    const transaction: Transaction = {
      action: "Collateral",
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      ledger: `ledger_hash_${i}`,
      asset: Math.random() > 0.5 ? "USDC" : assetCode, // Randomly select between USDC or assetCode
      source:
        walletAddresses[Math.floor(Math.random() * walletAddresses.length)], // Random wallet address
      amount: (
        Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000
      ).toString(), // Random amount between 1,000 and 100,000
    };
    transactions.push(transaction);
  }

  return transactions;
}
const walletAddresses = [
  "GAPA74UEBLLFTMXDZKCRZTDED3W5AFLF5FKN52O6ZT4UOSB4LOF2Q4QO",
  "GDLFWOISLDAE7MWTQXE6DZOJZYM2CTBKSQX3CE6B6ITBM7SUXJX7HLFL",
  "GDP253EYABCLUTTICY5DRAR54I73YCIQGZ7YLCP3TOCH6GYTDUTPGOEB",
];
