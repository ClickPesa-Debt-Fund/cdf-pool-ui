import { ReactNode } from "react";

interface TransactionDetailsProps {
  title: string;
  children: ReactNode;
  isLastChild?: boolean;
  className?: string;
}

function TransactionDetails({
  title,
  children,
  isLastChild,
  className,
}: TransactionDetailsProps) {
  return (
    <div style={{ marginBottom: isLastChild ? 0 : 30 }} className={className}>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          paddingBottom: 20,
          color: "black",
        }}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}
export default TransactionDetails;
