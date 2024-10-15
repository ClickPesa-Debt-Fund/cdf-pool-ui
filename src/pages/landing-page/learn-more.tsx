import { useTheme } from "@/contexts/theme";
import { SectionTemplate } from "@clickpesa/components-library.section-template";

const LearnMore = () => {
  const { theme } = useTheme();
  return (
    <>
      <SectionTemplate className="md:rounded-2xl rounded-lg " mode={theme}>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="order-1 md:order-2 flex-1 space-y-4" id="learn-more">
            <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)]">
              Unlocking Potential of SMEs and Women-Owned Businesses with DeFi
            </h1>
            <div className="space-y-3">
              <p>
                The ClickPesa Debt Fund offers a platform for global investors
                to generate financial returns while making a positive and
                sustainable impact on the local business ecosystem. Investing in
                the ClickPesa Debt Fund represents a strategic opportunity to
                align one’s financial resources with a mission-driven
                initiative.
              </p>
              <p>
                Our approach is multifaceted and strategic. We channel our
                efforts towards partnering with Microfinance Institutions (MFIs)
                that have a wealth of experience and a robust network,
                specifically tailored to cater to the unique needs of SMEs and
                women-owned businesses throughout Africa. We only fund MFIs
                serve as essential intermediaries in our mission.
              </p>
            </div>
          </div>
          <div className="order-2 md:order-1 flex-1">
            <img
              src="/images/women.svg"
              className="object-cover h-full w-full md:rounded-2xl rounded-lg"
            />
          </div>
        </div>
      </SectionTemplate>
      <section className="px-6 md:px-8 space-y-8">
        <h1 className="font-bold text-font-bold text-center [font-size:_clamp(24px,5vw,24px)]">
          Why choose earning with ClickPesa Debt Fund?
        </h1>
        <div className="flex md:flex-row flex-col gap-8">
          <div className="space-y-4 flex-1">
            <h3 className="flex items-center gap-1 text-lg text-font-medium text-primary">
              <span className="outlined-text min-w-[40px] [font-size:_clamp(24px,5vw,40px)] font-bold text-font-bold">
                1.
              </span>
              Guranteed Earning through Transparency and Traceability
            </h3>
            <p>
              The primary challenge addressed by the ClickPesa Debt Fund is the
              lack of transparency that often characterizes traditional DeFi
              lending systems. Typically, once funds are raised, they transition
              off-chain, leading to a subsequent lack of transparency. This
              opacity can shy away investors, limit access to capital and
              availability of capital.
            </p>
            <p>
              The ClickPesa Debt Fund, is a decentralized finance (DeFi) debt
              fund that leverages the Stellar Network and Soroban smart
              contracts to provide end-to-end traceability in the lending
              process. The intentions are to bring enhanced transparency to DeFi
              lending, making each step in the lending chain—from disbursement
              to repayment—fully verifiable and transparent. This not only
              increases confidence among investors by providing clear visibility
              into the flow of funds but also enhances the ability of MFIs and
              SMEs to secure necessary financing under fair conditions.
            </p>
          </div>
          <div className="space-y-4 flex-1">
            <h3 className="flex items-center gap-1 text-lg text-font-medium text-primary">
              <span className="outlined-text min-w-[40px] [font-size:_clamp(28px,5vw,40px)] font-bold text-font-bold">
                2.
              </span>
              Supporting African-Based SMEs and Women-Owned Businesses
            </h3>
            <p>
              By participating in this fund, investors contribute to the
              advancement of small and medium-sized enterprises (SMEs) and
              women-owned businesses in Africa.
            </p>
            <p>
              This investment not only seeks financial returns but also supports
              the fund’s core values of empowerment, inclusivity, transparency,
              and impact-driven outcomes. Investors can take pride in knowing
              that their capital is channeled towards fostering economic growth,
              job creation, and empowerment of underrepresented businesses, all
              while upholding a commitment to ethical and socially responsible
              investing.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LearnMore;
