import { Asset } from "@stellar/stellar-sdk";

export const API_URL = import.meta.env.API_URL;
export const STELLAR_API_URL = import.meta.env.VITE_HORIZON_URL;
export const BLND_ISSUER = import.meta.env.VITE_BLND_ISSUER;
export const USDC_ISSUER = import.meta.env.VITE_USDC_ISSUER;
export const CPYT_ISSUER = import.meta.env.VITE_CPYT_ISSUER;
export const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
export const POOL_ID = import.meta.env.VITE_POOL_ID;
export const ASSET_ID = import.meta.env.VITE_ASSET_ID || "";
export const STELLER_EXPERT_URL = import.meta.env.VITE_STELLAR_EXPERT_URL;
export const ASSET_CODE = "CPCT";

export const CPYT_ASSET = new Asset("CPYT", CPYT_ISSUER || "");
