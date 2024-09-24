import axios from "axios";
import { WithdrawResponse } from "./initiate-withdraw";

export const retrieveWithdrawStatus = async ({
  transferServerUrl,
  id,
}: {
  transferServerUrl: string;
  id: string;
}) => {
  const REQUEST_URL_STR: string = `${transferServerUrl}/payout/${id}`;
  const REQUEST_URL = new URL(REQUEST_URL_STR);

  const { data } = await axios.get<WithdrawResponse>(`${REQUEST_URL}`);

  return data;
};
