import EarningCalculator from "./earning-calculator";
import FAQs from "./faqs";
import Footer from "./footer";
import Hero from "./hero";
import LearnMore from "./learn-more";
import Partners from "./partners";
import Statistics from "./statistics";
import Steps from "./steps";

const LandingPage = () => {
  return (
    <div className="md:space-y-[100px] space-y-[50px] md:py-[100px] py-[50px] container max-w-[1270px] min-h-full">
      <Hero />
      <Partners />
      <EarningCalculator />
      <Steps />
      <LearnMore />
      <Statistics />
      <FAQs />
      <Footer />
    </div>
  );
};

export default LandingPage;
