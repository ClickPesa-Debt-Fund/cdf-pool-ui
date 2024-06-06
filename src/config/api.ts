import { API_URL } from "@/constants";
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

const coreApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

coreApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      error?.config?.url !== "/payout/authorize" &&
      error?.config?.url !== "/merchant"
    ) {
      toast("Your session expired", { duration: 1000 });
    }
    return Promise.reject(error);
  }
);

export default coreApi;
