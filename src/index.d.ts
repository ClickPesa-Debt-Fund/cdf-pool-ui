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
