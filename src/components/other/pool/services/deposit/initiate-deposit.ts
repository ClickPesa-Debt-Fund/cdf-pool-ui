import { INVESTOR_ASSET } from "@/constants";
import axios from "axios";

export interface DepositResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  status: string;
  expected_amount: string;
  verification: {
    amount: string;
    currency: string;
  };
  deposit: {
    channel: string;
    channel_provider: string;
    account_address: string;
    account_currency: string;
    deposited_amount: string;
    expires_in: string;
  };
  confirmation: {
    amount: string;
    currency: string;
  };
  sep24_wallet_deposit_instructions: {
    address: string;
    amount: string;
    currency: string;
  };
}

export const initiateDeposit = async ({
  assetCode,
  publicKey,
  token,
  transferServerUrl,
}: {
  assetCode: string;
  publicKey: string;
  transferServerUrl: string;
  token: string;
}) => {
  const REQUEST_URL_STR: string = `${transferServerUrl}/sep24/transactions/deposit/interactive`;

  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const body = {
    asset_code: assetCode,
    account: publicKey,
    lang: "en",
    claimable_balance_supported: true,
  };

  const { data } = await axios.post<{
    id: string;
    type: string;
    url: string;
  }>(`${REQUEST_URL}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const generateDepositInstructions = async ({
  assetCode,
  issuer,
  amount,
  customer_id,
  transaction_id,
  transferServerUrl,
}: {
  amount: string;
  transaction_id: string;
  assetCode: string;
  issuer: string;
  transferServerUrl: string;
  customer_id: string;
}) => {
  const REQUEST_URL_STR: string = `${transferServerUrl}/deposit-request/sep24`;

  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const body = {
    customer_id,
    expected_amount: amount,
    currency: assetCode,
    deposit: {
      channel: "SEP24 WALLET",
      channel_provider: issuer,
      account_currency: INVESTOR_ASSET,
      deposited_amount: amount,
    },
    hooks: {
      confirm_sep24_deposit: {
        amount,
        transaction_id,
      },
    },
  };

  const { data } = await axios.post<DepositResponse>(
    `${REQUEST_URL}`,
    body,
    {}
  );

  return data;
};
