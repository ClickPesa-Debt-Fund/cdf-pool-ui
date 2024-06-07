import { cn } from "@/lib/utils";
import Spin from "antd/lib/spin";

const Spinner = ({
  height,
  size,
  className,
}: {
  height?: number | string;
  size?: "default" | "small";
  className?: string;
}) => (
  <div
    style={{
      height: height ?? "100%",
      minHeight: height ?? "45vh",
    }}
    className={cn("w-full flex items-center justify-center", className)}
  >
    <Spin size={size} />
  </div>
);

export default Spinner;
