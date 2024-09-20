import Pool from "@/components/other/pool";
import { pools } from "./data";
import { useFlags } from "flagsmith/react";
import { Alert } from "@clickpesa/components-library.alert";
import { useEffect } from "react";

const Pools = () => {
  const { debtfund_investor_asset } = useFlags(["debtfund_investor_asset"]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
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
      <div className="container max-w-[1080px]">
        <div className="bg-white md:rounded-2xl rounded-lg p-4 md:p-6 flex gap-8 flex-wrap justify-between items-center">
          <div>
            Developed by{" "}
            <a
              href="https://clickpesa.com"
              target="_blank"
              className="text-primary"
            >
              ClickPesa
            </a>{" "}
            and runs on{" "}
            <a
              href="https://stellar.org/"
              target="_blank"
              className="text-primary"
            >
              Stellar
            </a>{" "}
            &{" "}
            <a
              href="https://www.blend.capital/"
              target="_blank"
              className="text-primary"
            >
              Blend
            </a>
          </div>
          <div>ClickPesa Debt Fund &copy; {new Date().getFullYear()}</div>
        </div>
      </div>
    </>
  );
};

export default Pools;
