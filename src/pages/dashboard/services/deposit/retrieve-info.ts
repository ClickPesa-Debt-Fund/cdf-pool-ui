import axios from "axios";
import { DepositResponse } from "./initiate-deposit";

export interface CurrencyDetails {
  enabled: boolean;
  authentication_required: boolean;
  fee_fixed: number;
  min_amount: number;
  max_amount: number;
  fields: {
    amount: string;
  };
}

export type CurrencyObject = Record<string, CurrencyDetails>;

export const retrieveSEPInfo = async ({
  transferServerUrl,
}: {
  transferServerUrl: string;
}) => {
  const REQUEST_URL_STR: string = `${transferServerUrl}/info`;
  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const { data } = await axios.get(`${REQUEST_URL}`);

  return data;
};

export const retrieveDepositStatus = async ({
  transferServerUrl,
  id,
}: {
  transferServerUrl: string;
  id: string;
}) => {
  const REQUEST_URL_STR: string = `${transferServerUrl}/deposit-request/${id}`;
  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const { data } = await axios.get<DepositResponse>(`${REQUEST_URL}`);

  return data;
};
