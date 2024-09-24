import { Asset, Horizon } from "@stellar/stellar-sdk";

/**
 * Fetch the Stellar Assets reserve requirement for an account
 * @param account - The account
 * @param asset - The asset to fetch the reserve for
 * @returns The reserves required, or 0
 */
export function getAssetReserve(
  account: Horizon.AccountResponse | undefined,
  asset: Asset | undefined
): number {
  let stellar_reserve_amount = 0;
  if (asset && account) {
    let balanceLine = account.balances.find((x) => {
      if (x.asset_type == "native") {
        return asset.isNative();
      } else if (x.asset_type == "liquidity_pool_shares") {
        return false;
      } else {
        return (
          x.asset_code == asset.getCode() && x.asset_issuer == asset.getIssuer()
        );
      }
    });
    // @ts-ignore
    if (balanceLine?.selling_liabilities) {
      // @ts-ignore
      stellar_reserve_amount += Number(balanceLine?.selling_liabilities);
    }
    if (asset.isNative()) {
      stellar_reserve_amount += 1.5 + 0.5 * account.subentry_count; // add 1 XLM for gas headroom
    }
  }
  return stellar_reserve_amount;
}
