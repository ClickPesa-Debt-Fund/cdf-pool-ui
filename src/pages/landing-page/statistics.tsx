import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "African-Based",
    content: "Solving African funding problem, one token a time",
  },
  {
    title: "USDC 250k+",
    content: "Distributed to MFIs since 2023",
  },
  {
    title: "1200 SMEs",
    content: "Benefiting from ClickPesa Debt Fund",
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
