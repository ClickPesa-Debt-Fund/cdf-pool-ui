import axios from "axios";

export interface WithdrawResponse {
  customer_id: string;
  reference_id: string;
  amount: string;
  currency: string;
  status: string;
  payout_info: {
    payout_channel: string;
    payout_channel_provider: string;
    payout_address: string;
    payout_address_name: string;

    amount: string;
    currency: string;
    fee: string;
  };
  sep24_payout: {
    transaction_id: string;
    amount: string;
    memo: string;
  };
  updatedAt: string;
  createdAt: string;
  id: string;
}

export const initiateWithdraw = async ({
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
  const REQUEST_URL_STR: string = `${transferServerUrl}/sep24/transactions/withdraw/interactive`;

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

export const generateWithdrawInstructions = async ({
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
  const REQUEST_URL_STR: string = `${transferServerUrl}/payout/sep24`;

  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const body = {
    customer_id,
    amount,
    currency: assetCode,
    payout_info: {
      payout_channel: "WALLET TRANSFER",
      payout_channel_provider: issuer,
      currency: assetCode,
      amount,
    },
    sep24_payout: {
      transaction_id,
      amount,
    },
    hooks: {
      initiate_pool_settlement: {
        pool_id: "3",
      },
    },
  };

  const { data } = await axios.post<WithdrawResponse>(`${REQUEST_URL}`, body);

  return data;
};
