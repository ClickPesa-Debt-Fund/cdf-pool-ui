import { useState } from "react";
import Summary from "./summary";
import Form from "./form";
import EarningGraph from "./earning-graph";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EarningCalculator = () => {
  const [amount, setAmount] = useState("300");
  const navigate = useNavigate();
  return (
    <section className="bg-primary md:rounded-2xl rounded-lg earning-calculator">
      <div className="p-6 md:p-8 text-white pb-16">
        <div className="space-y-5">
          <div className="flex items-center md:flex-row flex-col gap-8">
            <div className="space-y-2 flex-[1.3]">
              <h1 className="!text-white font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)]">
                Earnings Estimator
              </h1>
              <p>Potential Earnings from currently raising Pool</p>
            </div>
            <div className="flex-[1]" />
          </div>
          <div className="flex items-center md:flex-row flex-col gap-8">
            <div className="flex-[1.3] order-2 w-full md:order-1">
              <Summary amount={amount} />
            </div>
            <div className="flex-[1] order-1 w-full md:order-2">
              <Form
                amount={amount}
                updateAmount={(amount) => setAmount(amount)}
              />
            </div>
          </div>
          <div className="flex items-center md:flex-row flex-col gap-8">
            <div className="flex-[1.3] w-full">
              <Button
                className="bg-[#020A1F] hover:bg-[#020A1F]/80 w-full"
                onClick={() => navigate("/dashboard")}
              >
                Earn Now
              </Button>
            </div>
            <div className="flex-[1]" />
          </div>
        </div>
      </div>
      <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
        <EarningGraph amount={amount} />
      </div>
    </section>
  );
};

export default EarningCalculator;
