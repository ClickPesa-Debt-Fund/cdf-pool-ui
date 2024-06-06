import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "African-Based",
    content:
      "Outperforming staking profits and other crypto investment strategies.",
  },
  {
    title: "USDC 1M+",
    content: "Has been distributed to MFIs since 2023",
  },
  {
    title: "200 SMEs",
    content: "Have been able to lead money via MFIs from the fund",
  },
];

const Statistics = () => {
  const { width } = useWindowSize();
  return (
    <div className="bg-primary text-white md:rounded-2xl rounded-lg p-6 md:p-8 flex justify-between flex-wrap gap-4 h-fit">
      {stats.map(({ title, content }, index) => {
        return (
          <>
            <div key={index} className={cn("max-w-[250px] space-y-2")}>
              <h3 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)] !text-white">
                {title}
              </h3>
              <p className="text-sm">{content}</p>
            </div>
            {(index === 1 && width > 936.9) || (index === 0 && width > 644) ? (
              <div className={cn("self-stretch w-[1px] bg-gray-200")} />
            ) : null}
          </>
        );
      })}
    </div>
  );
};

export default Statistics;
