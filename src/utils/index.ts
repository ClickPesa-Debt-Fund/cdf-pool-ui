export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
import moment from "moment";

export const formatErrorMessage = (error: any): string => {
  return (
    error?.response?.extras?.reason ||
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message
  );
};

export const formatAmount = (value: any, digits?: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits ?? 2,
    maximumFractionDigits: digits ?? 2,
  }).format(value);
};

export const formatDate = (value: string, format: string = "MMMM Do, YYYY") => {
  return moment(value).format(format);
};
