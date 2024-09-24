import StellarSdk, {
  Account,
  Asset,
  BASE_FEE,
  Keypair,
  Operation,
  Transaction,
  TransactionBuilder,
} from "stellar-sdk";

const getRandomKeyPair = () => {
  return StellarSdk.Keypair.random();
};

const activateAccount = async (keyPair: Keypair) => {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(
      keyPair.publicKey()
    )}`
  );
  const responseJSON = await response.json();
  return responseJSON;
};

const createTrustline = async ({
  keyPair,
  asset,
  issuerKey,
  networkPassphrase,
  horizonURL,
}: {
  keyPair: Keypair;
  asset: string;
  issuerKey: string;
  networkPassphrase: string;
  horizonURL: string;
}) => {
  const server = new StellarSdk.Server(horizonURL);
  const newAsset: Asset = new StellarSdk.Asset(asset, issuerKey);
  const account: Account = await server.loadAccount(keyPair.publicKey());
  const fee: number = (await server.fetchBaseFee()) || +BASE_FEE;
  const transaction: Transaction = new TransactionBuilder(account, {
    fee: fee.toString(),
    networkPassphrase: networkPassphrase,
  })
    .addOperation(
      Operation.changeTrust({
        asset: newAsset,
      })
    )
    .setTimeout(30)
    .build();

  transaction.sign(keyPair);
  return await server.submitTransaction(transaction);
};

const getAccountBalance = async (horizonURL: string, publicKey: string) => {
  const account: {
    balances: {
      balance: string;
      limit: string;
      buying_liabilities: string;
      selling_liabilities: string;
      last_modified_ledger: number;
      is_authorized: boolean;
      is_authorized_to_maintain_liabilities: boolean;
      asset_type: "credit_alphanum4" | "native";
      asset_code: string;
      asset_issuer: string;
    }[];
  } = await new StellarSdk.Server(horizonURL)
    .accounts()
    .accountId(publicKey)
    .call();
  return account;
};

export {
  getRandomKeyPair,
  activateAccount,
  createTrustline,
  getAccountBalance,
};
