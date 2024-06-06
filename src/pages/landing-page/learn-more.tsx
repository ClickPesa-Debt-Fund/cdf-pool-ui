const LearnMore = () => {
  return (
    <>
      <section
        id="learn-more"
        className="flex flex-col gap-8 md:flex-row bg-white md:rounded-2xl rounded-lg p-6 md:p-8"
      >
        <div className="order-1 md:order-2 flex-1 space-y-4">
          <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)]">
            8-12% APY Monthly Fixed Return Min 1 year period
          </h1>
          <div className="space-y-3">
            <p>
              The ClickPesa Debt Fund offers a platform for global investors to
              generate financial returns while making a positive and sustainable
              impact on the local business ecosystem. Investing in the ClickPesa
              Debt Fund represents a strategic opportunity to align one’s
              financial resources with a mission-driven initiative.
            </p>
            <p>
              Our approach is multifaceted and strategic. We channel our efforts
              towards partnering with Microfinance Institutions (MFIs) that have
              a wealth of experience and a robust network, specifically tailored
              to cater to the unique needs of SMEs and women-owned businesses
              throughout Tanzania. We only fund MFIs serve as essential
              intermediaries in our mission.
            </p>
            <p>
              By participating in this fund, investors contribute to the
              advancement of small and medium-sized enterprises (SMEs) and
              women-owned businesses in Tanzania. This investment not only seeks
              financial returns but also supports the fund’s core values of
              empowerment, inclusivity, transparency, and impact-driven
              outcomes. Investors can take pride in knowing that their capital
              is channeled towards fostering economic growth, job creation, and
              empowerment of underrepresented businesses, all while upholding a
              commitment to ethical and socially responsible investing.
            </p>
          </div>
        </div>
        <div className="order-2 md:order-1 flex-1">
          <img
            src="/images/women.svg"
            className="object-cover h-full w-full md:rounded-2xl rounded-lg"
          />
        </div>
      </section>
      <section className="p-6 md:p-8 space-y-8">
        <h1 className="font-bold text-font-bold text-center [font-size:_clamp(20px,5vw,24px)]">
          Why choose earning with ClickPesa Debt Fund?
        </h1>
        <div className="space-y-4">
          <p>
            EarnPark is a UK-based crypto investment platform approved by the
            SEC for use in over 180 countries. With a daily 8% APY on Stellar
            (XLM) investments and top-tier security, EarnPark is a reliable and
            user-friendly platform for earning passive income through crypto
            investments.
          </p>
          <p>
            With the Stellar (XLM) EarnPark Strategy offering a 8% APY, users
            can diversify their investment portfolio and generate passive income
            through a market-making strategy. EarnPark's platform is simple and
            secure, catering to both novice and experienced investors seeking to
            earn passive income through Stellar (XLM) investments, outperforming
            staking profits and other crypto investment strategies.
          </p>
        </div>
      </section>
    </>
  );
};

export default LearnMore;
