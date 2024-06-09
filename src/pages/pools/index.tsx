import Pool from "@/components/other/pool";
import { pools } from "./data";
import { useFlags } from "flagsmith/react";
import { Alert } from "@clickpesa/components-library.alert";

const Pools = () => {
  const { debtfund_investor_asset } = useFlags(["debtfund_investor_asset"]);

  return (
    <div className="md:space-y-[77px] space-y-[50px] md:py-[100px] py-[50px] container max-w-[1080px] min-h-full">
      {debtfund_investor_asset?.value === "TZS" && (
        <Alert
          subtitle={
            <>
              Please note that TZS is used as a representation and testing
              asset, while the real use case will use USDC. If you need TZS,
              email{" "}
              <a
                href="mailto:tech@clickpesa.com"
                className="text-primary"
                target="_blank"
              >
                tech@clickpesa.com
              </a>{" "}
              with your wallet address and ensure you have a TZS trustline
              established on your wallet.
            </>
          }
          color="blue"
          style={{
            marginBottom: "-3rem",
          }}
        />
      )}
      {pools.map((pool) => (
        <Pool {...pool} key={pool?.id} />
      ))}
    </div>
  );
};

export default Pools;
