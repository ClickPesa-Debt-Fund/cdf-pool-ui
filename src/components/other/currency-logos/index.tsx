import { cn } from "@/lib/utils";
import {
  EUR,
  EURsm,
  KES,
  KESsm,
  MasterCardLogo,
  RWF,
  RWFsm,
  SepaLogo,
  TZS,
  TZSsm,
  USD,
  USDC,
  USDCsm,
  USDsm,
  VisaCardlogo,
  VisaMasterLogo,
  XLM,
  XLMsm,
} from "./logos";

export type CurrencyLogosProps = {
  /**
   * Name of currency icon
   */
  name:
    | "XLM"
    | "USDC"
    | "USD"
    | "EUR"
    | "TZS"
    | "RWF"
    | "KES"
    | "VISA"
    | "MASTER"
    | "SEPA"
    | "VISAMASTER"
    | "BLND"
    | "BLND-USDC LP";

  /**
   * size of currency icon
   */
  size?: "sm" | "md" | "lg";
};

export function CurrencyLogos({ name, size = "md" }: CurrencyLogosProps) {
  const returnIcon = () => {
    switch (name) {
      case "XLM":
        if (size === "md") return <XLM />;
        return <XLMsm />;
      case "USDC":
        if (size === "md") return <USDC />;
        return <USDCsm />;
      case "USD":
        if (size === "md") return <USD />;
        return <USDsm />;
      case "EUR":
        if (size === "md") return <EUR />;
        return <EURsm />;
      case "TZS":
        if (size === "md") return <TZS />;
        return <TZSsm />;
      case "RWF":
        if (size === "md") return <RWF />;
        return <RWFsm />;
      case "KES":
        if (size === "md") return <KES />;
        return <KESsm />;
      case "MASTER":
        return <MasterCardLogo />;
      case "VISA":
        return <VisaCardlogo />;
      case "VISAMASTER":
        return <VisaMasterLogo />;
      case "SEPA":
        return <SepaLogo />;
      case "BLND":
        return (
          <img
            src="/icons/blnd-token.svg"
            className={cn("w-auto", {
              "h-4": size === "sm",
              "h-[50px]": size === "md",
            })}
          />
        );
      case "BLND-USDC LP":
        return (
          <img
            src="/icons/lp-token.svg"
            className={cn("w-auto", {
              "h-4": size === "sm",
              "h-[50px]": size === "md",
            })}
          />
        );
      default:
        if (size === "md") return <XLM />;
        return <XLMsm />;
    }
  };
  return returnIcon();
}
