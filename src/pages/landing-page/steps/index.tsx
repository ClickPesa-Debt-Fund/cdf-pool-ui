import { useState } from "react";
import { steps } from "./data";
import { cn } from "@/lib/utils";
import Accordion from "./accordion";
import { Link } from "react-router-dom";

const Steps = () => {
  const [active, setActive] = useState(1);

  return (
    <section className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8 space-y-8">
      <h1 className="font-bold text-font-bold [font-size:_clamp(20px,5vw,24px)] text-center ">
        How to Earn Passive Income with ClickPesa Debt Fund
      </h1>
      <div className="flex md:flex-row flex-col gap-8">
        <div className="md:order-1 order-2 flex-1 flex gap-8">
          <div>
            <ul className="space-y-8">
              {steps.map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => setActive(index + 1)}
                    className={cn(
                      "h-[53px] transition-all w-[53px] border border-primary rounded-lg hover:opacity-70 !text-white font-bold text-font-bold ![font-size:_clamp(30px,5vw,32px)] outlined-text",
                      active === index + 1 ? "active bg-primary" : ""
                    )}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary/10 p-1 rounded-lg md:rounded-xl overflow-hidden">
            <img
              src={steps?.[active - 1]?.imgSrc}
              alt={steps?.[active - 1]?.title}
              className="object-cover object-center rota w-full h-full rounded-lg md:rounded-xl overflow-hidden"
            />
          </div>
        </div>
        <div className="md:order-2 order-1 flex-[1.3]">
          <ul>
            {steps?.map(({ title, description, link }, index) => (
              <li key={index}>
                <Accordion
                  active={active === index + 1}
                  updateActive={() => {
                    setActive(index + 1);
                  }}
                  title={
                    <div className="flex gap-4 items-center font-bold ">
                      <span
                        onClick={() => setActive(index + 1)}
                        className={cn(
                          "transition-all inline-flex min-w-[25px] justify-center items-center font-bold text-font-bold ![font-size:_clamp(30px,5vw,32px)] bare-outlined-text"
                        )}
                      >
                        {index + 1}.
                      </span>{" "}
                      <span className="text-font-bold text-lg">{title}</span>
                    </div>
                  }
                >
                  <div>
                    {description}
                    {link ? (
                      <>
                        .{" "}
                        <Link to={link} className="text-primary">
                          Lean More
                        </Link>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </Accordion>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Steps;
