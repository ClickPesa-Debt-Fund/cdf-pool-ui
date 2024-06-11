import * as React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const chipVariants = cva(
  "inline-flex h-5 w-fit min-w-[20px] items-center justify-center rounded-md border px-1 text-xs",
  {
    variants: {
      variant: {
        default: "bg-gray-100 border",
        green: "text-green-700 bg-green-100 border-green-200",
        red: "text-red-700 bg-red-100 border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ChipProps
  extends React.HtmlHTMLAttributes<HTMLElement>,
    VariantProps<typeof chipVariants>,
    React.ComponentPropsWithoutRef<"kbd"> {}

const Kbd = React.forwardRef<HTMLElement, ChipProps>(
  ({ children, variant, className, ...props }, ref) => {
    return (
      <kbd
        {...props}
        ref={ref}
        className={cn(chipVariants({ variant, className }))}
      >
        {children}
      </kbd>
    );
  }
);
Kbd.displayName = "Kbd";

export { Kbd };
