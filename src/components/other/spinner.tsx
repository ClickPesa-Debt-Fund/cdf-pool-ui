import Spin from "antd/lib/spin";

const Spinner = ({ height }: { height?: number | string }) => (
  <div
    style={{
      height: height ?? "100%",
      minHeight: height ?? "45vh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Spin />
  </div>
);

export default Spinner;
