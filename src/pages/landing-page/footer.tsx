import { InstagramIcon, LinkedInIcon, TwitterIcon } from "@/assets/icons";
import { Link } from "react-router-dom";

const socials = [
  {
    href: "https://instagram.com/",
    icon: <InstagramIcon />,
  },
  {
    href: "https://linkedin.com/in/",
    icon: <LinkedInIcon />,
  },
  {
    href: "https://x.com/",
    icon: <TwitterIcon />,
  },
];

const links = [
  {
    links: [
      {
        name: "Login",
        to: "/login",
      },
      {
        name: "Sign Up",
        to: "/signup",
      },
    ],
  },
  {
    links: [
      {
        name: "About Us",
        to: "/about",
      },
      {
        name: "Career",
        to: "/career",
      },
    ],
  },
  {
    links: [
      {
        name: "Terms of Use",
        to: "/terms",
      },
      {
        name: "User Agreement",
        to: "/user-agreement",
      },
      {
        name: "Privacy Policy",
        to: "/privacy",
      },
    ],
  },
  {
    links: [
      {
        name: "Help Center",
        to: "/help",
      },
      {
        name: "Support",
        to: "/support",
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
                <Link key={to} to={to} className="text-font-medium">
                  {name}
                </Link>
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
          Copyright ClickPesa Debt Fund {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
