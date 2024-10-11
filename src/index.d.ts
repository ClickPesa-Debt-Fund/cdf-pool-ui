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
  | "CPYT"
  | "CPCT";

type HorizonAccountType = {
  balances: {
    balance: string;
    limit: string;
    buying_liabilities: string;
    selling_liabilities: string;
    last_modified_ledger: number;
    is_authorized: boolean;
    is_authorized_to_maintain_liabilities: boolean;
    asset_type: "credit_alphanum4" | "native" | "liquidity_pool_shares";
    asset_code: string;
    asset_issuer: string;
  }[];
  last_modified_ledger: string;
  subentry_count: number;
};
