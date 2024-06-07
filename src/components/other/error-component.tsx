import { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ErrorProps = ComponentProps<"div"> & {
  message: string;
  onClick?: () => void;
  retryText?: string;
  type?: "danger" | "default";
};

const ErrorComponent = ({
  message,
  onClick,
  retryText = "Retry",
  type = "danger",
  ...rest
}: ErrorProps) => {
  return (
    <div
      {...rest}
      className={cn(
        "flex items-center justify-center gap-4 flex-col",
        rest.className
      )}
    >
      <p
        className={cn(
          type === "danger" ? "text-red-500" : "",
          "text-center text-md"
        )}
      >
        {message}
      </p>
      {onClick && (
        <Button onClick={onClick} color="clickpesa" size="sm">
          {retryText}
        </Button>
      )}
    </div>
  );
};

export default ErrorComponent;
