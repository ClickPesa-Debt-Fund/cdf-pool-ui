import { cn } from "@/lib/utils";
import { TZS, USD, USDC, XLM } from "./logos";
import { COLLATERAL_ASSET_CODE } from "@/constants";

export type CurrencyLogosProps = {
  /**
   * Name of currency icon
   */
  name:
    | "XLM"
    | "USDC"
    | "USD"
    | "TZS"
    | "BLND"
    | "BLND-USDC LP"
    | typeof COLLATERAL_ASSET_CODE;

  /**
   * size of currency icon
   */
  size?: "sm" | "md" | "lg" | number;
};

export function CurrencyLogos({ name, size = "md" }: CurrencyLogosProps) {
  const logoSize =
    size === "lg" ? 50 : size === "md" ? 30 : size === "sm" ? 16 : size;
  const returnIcon = () => {
    switch (name) {
      case "USDC":
        return <USDC size={logoSize} />;
      case "USD":
        return <USD size={logoSize} />;
      case "TZS":
        return <TZS size={logoSize} />;
      case "BLND":
        return (
          <img
            src="/icons/blnd-token.svg"
            className={cn("w-auto")}
            style={{
              height: logoSize,
            }}
          />
        );
      case COLLATERAL_ASSET_CODE:
        return (
          <img
            src="/icons/logo.svg"
            className={cn("w-auto")}
            style={{
              height: logoSize,
            }}
          />
        );
      case "BLND-USDC LP":
        return (
          <img
            src="/icons/lp-token.svg"
            className={cn("w-auto")}
            style={{
              height: logoSize,
            }}
          />
        );
      default:
        return <XLM size={logoSize} />;
    }
  };
  return returnIcon();
}
