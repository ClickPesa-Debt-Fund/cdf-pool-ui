import CopyOutlined from "@ant-design/icons/CopyOutlined";
import { ReactNode } from "react";
import { toast } from "sonner";

const CopyToClicpboard = ({
  text,
  children,
}: {
  text: string;
  children?: ReactNode;
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { duration: 5000 });
  };
  return (
    <button
      onClick={copyToClipboard}
      className="text-black cursor-pointer bg-white/0 border-0 inline-flex justify-center items-center gap-2"
    >
      <CopyOutlined
        style={{
          fontSize: 18,
        }}
      />
      {children}
    </button>
  );
};

export default CopyToClicpboard;
