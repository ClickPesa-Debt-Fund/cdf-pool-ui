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
    name: "Beans",
    logo: "/icons/beans.svg",
  },
  {
    name: "Lobstr",
    logo: "/icons/lobstr.svg",
  },
];

const Partners = () => {
  return (
    <section className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8 text-center space-y-6">
      <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)] text-[#020A1F]">
        Our Partners
      </h1>
      <ul className="flex justify-center flex-wrap gap-12 md:gap-[72px]">
        {partners.map(({ name, logo }) => (
          <li key={name} className="flex items-center gap-3">
            <img
              src={logo}
              alt={name + " Logo"}
              className="md:h-[50px] h-[36px]"
            />
            <span className="text-[#454E57] [font-size:_clamp(20px,5vw,24px)] font-bold text-font-bold">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Partners;
