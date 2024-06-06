import { useState, useRef, FC, useEffect, ReactNode } from "react";
import styles from "./style.module.sass";
import { ChevronDown } from "lucide-react";

interface Props {
  title: ReactNode;
  children?: any;
  defaultOpen?: boolean;
}

const Accordion: FC<Props> = ({ title, children }) => {
  const [active, setActive] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string>("0px");

  const toggleAccordion = () => {
    if (content && content.current) {
      setActive(!active);
    }
  };

  useEffect(() => {
    if (active && content && content?.current) {
      setHeight(`calc( ${content.current.scrollHeight}px + 2rem )`);
    } else {
      setHeight("0px");
    }
  }, [active]);

  return (
    <div className={`${styles.accordion} border-gray-300 transition-all`}>
      <div
        tabIndex={0}
        onClick={() => toggleAccordion()}
        className={`${styles.title} flex justify-between py-[14px] gap-4`}
      >
        <div className="flex justify-start items-center flex-1">
          <span
            className="font-bold"
            style={{
              width: "100%",
            }}
          >
            {title}
          </span>
        </div>
        <span>
          <ChevronDown
            style={{
              transform: active ? "rotate(180deg)" : "rotate(0deg)",
              transition: ".25s",
            }}
          />
        </span>
      </div>
      <div
        ref={content}
        style={{
          minHeight: `100%`,
          maxHeight: height,
        }}
        className={`${styles.accordion__content}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
