import { CurrencyLogos } from "@clickpesa/components-library.currency-logos";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import { ExchangeRateArrow } from "@clickpesa/components-library.exchange-rate-arrow";
import "./details-row.sass";
import { ReactNode } from "react";
import { formatAmount, formatDate } from "@/utils";

type AmountType = {
  label: string;
  value: string;
  currency: "XLM" | "USDC" | "TZS" | "KES" | "USD" | "EUR" | "RWF";
  digits?: number;
};
type ExchangeRateAmountType = {
  value: string;
  currency?: "XLM" | "USDC" | "TZS" | "KES" | "USD" | "EUR" | "RWF";
  digits?: number;
};

export type DetailsRowProps = {
  text?: {
    type?: "text" | "reference" | "date" | "number";
    label: string;
    value: string;
  };
  amount?: AmountType;
  status?: {
    label?: string;
    name: string;
    color: "green" | "gold" | "blue" | "red" | "gray";
  };
  exchangeRate?: {
    label: string;
    start: ExchangeRateAmountType;
    end: ExchangeRateAmountType;
  };
  custom?: {
    label: string;
    value: string | ReactNode;
  };
  shouldIncludeBorderTop?: boolean;
  shouldIncludeBorderBottom?: boolean;
  isMobile?: boolean;
  /**
   * color mode for the component
   */
  mode?: "dark" | "light";
};

export function DetailsRow({
  text,
  amount,
  exchangeRate,
  status,
  custom,
  shouldIncludeBorderBottom = true,
  shouldIncludeBorderTop = true,
  isMobile = false,
  mode,
}: DetailsRowProps) {
  return (
    <div
      className={`details-row-container ${isMobile ? "mobile" : ""} ${mode}`}
    >
      <div
        className="label"
        style={{
          borderBottomWidth: shouldIncludeBorderBottom && !isMobile ? 1 : 0,
          borderTopWidth: shouldIncludeBorderTop && !isMobile ? 1 : 0,
          borderRightWidth: !isMobile ? 0 : 1,
        }}
      >
        {text && text.label} {amount && amount.label}
        {status ? status?.label ?? "Status" : ""}
        {custom && custom?.label}
        {exchangeRate && exchangeRate.label}
      </div>
      <div
        className={`value`}
        style={{
          borderBottomWidth: shouldIncludeBorderBottom ? 1 : 0,
          borderTopWidth: shouldIncludeBorderTop ? 1 : 0,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className={`${exchangeRate ? "exchange_rate" : ""} ${
            text?.type && text.type === "reference" ? "reference" : ""
          }`}
        >
          {text && text.type !== "date" && text.value}
          {text && text.type === "date" && formatDate(text.value)}
          {amount && (
            <span className="amount">
              {formatAmount(amount.value, amount?.digits ?? 2)}{" "}
              {amount.currency}{" "}
              <CurrencyLogos name={amount.currency} size="sm" />
            </span>
          )}

          {custom && custom?.value}

          {status && (
            <StatusTag color={status?.color} name={status.name} mode={mode} />
          )}
          {exchangeRate && (
            <>
              <span className="amount">
                {formatAmount(exchangeRate.start.value, 0)}{" "}
                {exchangeRate.start.currency || ""}
                {exchangeRate.start.currency &&
                // @ts-ignore
                exchangeRate.start.currency !== "%" ? (
                  <CurrencyLogos name={exchangeRate.start.currency} size="sm" />
                ) : null}
              </span>
              &nbsp;&nbsp;&nbsp;
              <ExchangeRateArrow />
              &nbsp;&nbsp;&nbsp;
              <span className="amount">
                {formatAmount(exchangeRate.end.value, 6)}{" "}
                {exchangeRate.end.currency || ""}
                {exchangeRate.end.currency &&
                // @ts-ignore
                exchangeRate.end.currency !== "%" ? (
                  <CurrencyLogos name={exchangeRate.end.currency} size="sm" />
                ) : null}
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
