import FundingProgress from "@/components/other/funding-progress";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#020A1F] md:rounded-2xl rounded-lg flex md:flex-row flex-col text-white p-6 md:p-8 min-h-[340px] gap-8">
      <div className="order-2 md:order-1 flex-1 self-stretch flex flex-col justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src="/icons/logo.svg" alt="" className="md:h-[50px] h-[36px]" />
          <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)] !text-white">
            ClickPesa Debt Fund Token
          </h1>
        </div>
        <FundingProgress collected={25000} goal={50000} />
      </div>
      <div className="order-1 md:order-2 flex-[1.6] self-stretch flex flex-col justify-between gap-10">
        <div className="space-y-4">
          <h1 className="font-bold text-font-bold [font-size:_clamp(24px,5vw,32px)] !text-white">
            Support SMEs in Africa and Earn a 12% APY Return on Investment
          </h1>
          <p className="[font-size:_clamp(16px,5vw,18px)]">
            Invest in the Clickpesa Debt Fund, a fund dedicated to providing
            debt to SMEs and women-owned businesses across Africa. Make a
            positive impact while achieving significant returns.
          </p>
        </div>
        <div className="max-w-[450px] w-full flex flex-wrap gap-3">
          <Button className="flex-1" onClick={() => navigate("/pools")}>
            Start Earning
          </Button>
          <a
            href="#learn-more"
            className="text-primary flex items-center justify-center flex-1 gap-3"
          >
            Learn More <ArrowUpCircle className="rotate-45" size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
