import { useEffect } from "react";
import DebtFundVideo from "./debt-fund-video";
import FAQs from "./faqs";
import Footer from "./footer";
import Hero from "./hero";
import LearnMore from "./learn-more";
import Partners from "./partners";
import Statistics from "./statistics";

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="md:space-y-[100px] space-y-[50px] md:py-[100px] py-[90px] container max-w-[1270px] min-h-full">
      <Hero />
      <DebtFundVideo />
      <Partners />
      <LearnMore />
      <Statistics />
      <FAQs />
      <Footer />
    </div>
  );
};

export default LandingPage;
