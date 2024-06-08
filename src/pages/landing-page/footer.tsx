import { LinkedInIcon, TwitterIcon } from "@/assets/icons";

const socials = [
  {
    href: "https://www.linkedin.com/company/clickpesadebtfund/",
    icon: <LinkedInIcon />,
  },
  {
    href: "https://x.com/CPDebtFund",
    icon: <TwitterIcon />,
  },
];

const links = [
  {
    links: [
      {
        name: "MFIs",
        to: "https://clickpesadebtfund.com/microfinance-funding/",
      },
      {
        name: "Investors",
        to: "https://clickpesadebtfund.com/for-investors/",
      },
    ],
  },
  {
    links: [
      {
        name: "About Us",
        to: "https://clickpesadebtfund.com",
      },
      {
        name: "Career",
        to: "https://clickpesa.com/jobs/",
      },
    ],
  },
  {
    links: [
      {
        name: "Blog",
        to: "https://clickpesadebtfund.com/blog/",
      },
      {
        name: "Portfolio",
        to: "https://clickpesadebtfund.com/portfolio/",
      },
    ],
  },
  {
    links: [
      {
        name: "Support",
        to: "mailto:info@clickpesadebtfund.com",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#020A1F] md:rounded-2xl rounded-lg text-white p-6 md:p-8">
      <div className="flex flex-wrap gap-12 pt-10 pb-20">
        <div className="min-w-[270px] mr-20">
          <div className="flex items-center gap-3">
            <img
              src="/icons/logo.svg"
              alt=""
              className="md:h-[50px] h-[36px]"
            />
            <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)] !text-white">
              ClickPesa Debt Fund Token
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-20">
          {links.map(({ links }, index) => (
            <div key={index} className="flex flex-col gap-3">
              {links?.map(({ to, name }) => (
                <a
                  key={to}
                  href={to}
                  target="_blank"
                  className="text-font-medium"
                >
                  {name}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-8 border-t border-gray-200 pt-6">
        <div className="flex gap-4">
          {socials.map(({ href, icon }) => (
            <a href={href} target="_blank" className="text-gray-500" key={href}>
              {icon}
            </a>
          ))}
        </div>
        <div className="text-gray-500 text-font-medium">
          ClickPesa Debt Fund &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
