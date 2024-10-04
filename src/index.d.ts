type ApiError = AxiosError<{
  message: string;
  extras: {
    invalid_field: string;
    reason: string;
  };
}>;

type RequestTypeProp =
  | "Supply"
  | "Withdraw"
  | "SupplyCollateral"
  | "WithdrawCollateral"
  | "Borrow"
  | "Repay"
  | "FillUserLiquidationAuction"
  | "FillBadDebtAuction"
  | "FillInterestAuction"
  | "DeleteLiquidationAuction";

type TableHelperProps = {
  sorter: any;
  setLimit?: (limit: number) => void;
  setSortBy?: (sort_by: string) => void;
  setOrderBy?: (order_by: string) => void;
  setSkip?: (skip: number) => void;
  limit?: number;
  pagination: any;
};

type CurrencyNames =
  | "XLM"
  | "USDC"
  | "USD"
  | "TZS"
  | "BLND"
  | "BLND-USDC LP"
  | "CPYT";
