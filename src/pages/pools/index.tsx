import Pool from "@/components/other/pool";
import { pools } from "./data";

const Pools = () => {
  return (
    <div className="md:space-y-[77px] space-y-[50px] md:py-[100px] py-[50px] container max-w-[1080px] min-h-full">
      {pools.map((pool) => (
        <Pool {...pool} key={pool?.id} />
      ))}
    </div>
  );
};

export default Pools;
