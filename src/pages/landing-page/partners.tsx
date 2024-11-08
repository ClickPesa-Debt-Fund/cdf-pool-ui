import { useTheme } from "@/contexts/theme";
import { cn } from "@/lib/utils";
import { SectionTemplate } from "@clickpesa/components-library.section-template";

const partners = [
  {
    name: "Stellar",
    logo: "/icons/xlm.svg",
  },
  {
    name: "ClickPesa",
    logo: "/icons/clickpesa.svg",
  },
  {
    name: "Blend",
    logo: "/icons/blend.svg",
  },
  {
    name: "Xycloo Labs",
    logo: "/icons/xycloolabs.png",
  },
];

const Partners = () => {
  const { theme } = useTheme();
  return (
    <SectionTemplate
      className="md:rounded-2xl rounded-lg text-center"
      mode={theme}
    >
      <div className="space-y-6">
        <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)] text-[#020A1F]">
          Our Partners
        </h1>
        <ul className="flex justify-center flex-wrap gap-12 md:gap-[72px]">
          {partners.map(({ name, logo }) => (
            <li key={name} className="flex items-center gap-3">
              <img
                src={logo}
                alt={name + " Logo"}
                className={cn("md:h-[50px] h-[36px]", {
                  invert: name === "Stellar" && theme === "dark",
                })}
              />
              <span
                className={cn(
                  "[font-size:_clamp(20px,5vw,24px)] font-bold text-font-bold",
                  {
                    "text-[#454E57]": theme === "light",
                    "text-white/80": theme === "dark",
                  }
                )}
              >
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SectionTemplate>
  );
};

export default Partners;
