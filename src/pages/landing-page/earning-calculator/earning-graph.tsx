import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  formatAmount,
  useWindowSize,
} from "@clickpesa/components-library.shared.shared-functions";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { PMT } from "./summary";

const EarningGraph = ({ amount }: { amount: string }) => {
  const { width } = useWindowSize();
  const amountPerQuarter = PMT(Number(amount));
  const data = [
    {
      name: "1 Quarter",
      value: amountPerQuarter,
    },
    {
      name: "2 Quarter",
      value: amountPerQuarter * 2,
    },
    {
      name: "3 Quarter",
      value: amountPerQuarter * 3,
    },
  ];
  return (
    <div className="relative space-y-8 text-gray-500">
      <div className="flex justify-between flex-col md:flex-row gap-5">
        <div className="md:order-1 order-2 space-y-3">
          <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)]">
            Estimated Earnings
          </h1>
          <span className="inline-flex gap-2 items-center">
            <span className="inline-flex h-[15px] w-[15px] bg-primary rounded-full" />{" "}
            Accumulated Amount
          </span>
        </div>
        <div className="md:order-2 order-1 space-y-2 ">
          <div>
            <span className="text-font-medium font-medium">
              Payback Period:
            </span>{" "}
            <span className="text-font-bold font-bold !text-gray-500">
              Quarterly
            </span>
          </div>
          <div>
            <span className="text-font-medium font-medium">
              Final Balance on 30 Sep, 2025:
            </span>{" "}
            <span className="text-font-bold font-bold !text-gray-500">
              {formatAmount(amountPerQuarter * 3)} USDC
            </span>
          </div>
        </div>
      </div>
      <ResponsiveContainer
        width="100%"
        height="100%"
        aspect={width > 992 ? 3.5 : 2}
      >
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 30,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            horizontal={{
              width: 1,
            }}
            stroke={"#98A2B3"}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{
              fill: "#4B5563",
              opacity: 0.6,
            }}
            dy={10}
            interval={"preserveStartEnd"}
            height={10}
          />
          <YAxis
            dataKey={"value"}
            tickLine={false}
            axisLine={false}
            width={40}
            tickCount={8}
            tick={{
              fill: "#4B5563",
              opacity: 0.6,
            }}
            tickFormatter={(text) => {
              return nFormatter(Number(text));
            }}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip
                {...props}
                data={data}
                formatNumber={true}
                labels={{
                  x: "Payment Period",
                  y: "Amount",
                }}
              />
            )}
            cursor={false}
          />
          <Bar dataKey="value" barSize={45} fill={"#266AEA"} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningGraph;

const lookup = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "G" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
];

export const nFormatter = (value: number, digits?: number) => {
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return value >= item.value;
    });
  return item
    ? (value / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  formatNumber = false,
  labels,
}: TooltipProps<ValueType, NameType> & {
  data: {
    name: string;
    value: number;
  }[];
  formatNumber?: boolean;
  labels?: {
    x: string;
    y: string;
  };
}) => {
  let value = payload?.[0]?.payload?.value;
  if (active && payload && payload.length) {
    return (
      <>
        <div
          style={{
            boxShadow: "-2px 2px 10px 0px rgba(112, 112, 117, 0.30)",
            minWidth: "100px",
            width: "max-content",
            background: "#ffffff",
            padding: 13,
            borderRadius: "13px",
          }}
        >
          <p
            style={{
              marginBottom: ".5rem",
              width: "max-content",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {labels?.x}: {label}
          </p>
          <p
            style={{
              fontSize: "14px",
            }}
          >
            {labels?.y}: {formatNumber ? formatAmount(value) : value}
          </p>
        </div>
      </>
    );
  }

  return null;
};
