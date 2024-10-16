import { Asset } from "@stellar/stellar-sdk";

// env vars
export const FLAGSMITH_ENVIRONMENT_KEY =
  import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY || "";
export const API_URL = import.meta.env.API_URL;
export const RPC_URL = import.meta.env.VITE_RPC_URL;
export const HORIZON_URL = import.meta.env.VITE_HORIZON_URL;
export const PLAYGROUND_API = import.meta.env.VITE_PLAYGROUND_API;
export const MERCURY_API = import.meta.env.VITE_MERCURY_API;
export const MERCURY_ACCESS_TOKEN = import.meta.env.VITE_MERCURY_TOKEN;
export const BLND_ISSUER = import.meta.env.VITE_BLND_ASSET_ISSUER;
export const USDC_ISSUER = import.meta.env.VITE_USDC_ASSET_ISSUER;
export const COLLATERAL_ISSUER = import.meta.env.VITE_COLLATERAL_ASSET_ISSUER;
export const POOL_ID = import.meta.env.VITE_POOL_CONTRACT;
export const USDC_ASSET_ID = import.meta.env.VITE_USDC_ASSET_CONTRACT || "";
export const COLLATERAL_ASSET_ID =
  import.meta.env.VITE_COLLATERAL_ASSET_CONTRACT || "";
export const STELLER_EXPERT_URL = import.meta.env.VITE_STELLAR_EXPERT_URL;
export const PARTICIPATING_MFIs = import.meta.env.VITE_PARTICIPATING_MFIS;
export const SME_PORTFOLIO_SIZE = import.meta.env.VITE_SME_PORTFOLIO_SIZE;
export const BORROW_TABLE = import.meta.env.VITE_MERCURY_BORROW_TABLE_NAME;
export const COLLATERAL_SUPPLY_TABLE = import.meta.env
  .VITE_MERCURY_COLLATERAL_TABLE_NAME;
export const COLLATERAL_ASSET_CODE =
  import.meta.env.VITE_COLLATERAL_ASSET_CODE || "CPYT";
export const NETWORK_PASSPHRASE = import.meta.env
  .VITE_STELLAR_NETWORK_PASSPHRASE;
export const BACKSTOP_CONTRACT = import.meta.env.VITE_BACKSTOP;
export const RAISING_GOAL = +(import.meta.env.VITE_RAISING_GOAL || "50000");

export const COLLATERAL_ASSET = new Asset(
  COLLATERAL_ASSET_CODE,
  COLLATERAL_ISSUER || ""
);
export const USDC_ASSET = new Asset("USDC", USDC_ISSUER || "");
export const BLND_ASSET = new Asset("BLND", BLND_ISSUER || "");
export const DEBOUNCE_DELAY = 750;
export const CONNECTION_ERROR_MESSAGE =
  "Unable to connect wallet. Please try again";

export const POOL_STATUS = {
  0: "ACTIVE", // ADMIN ACTIVE
  1: "ACTIVE",
  2: "ACTIVE", // ADMIN-ON ICE
  3: "ACTIVE", // ON ICE
  4: "ADMIN FROZEN",
  5: "FROZEN",
};
