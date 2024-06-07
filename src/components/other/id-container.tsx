import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import CopyToClicpboard from "./copy-to-clipboard";

const IdContainer = ({
  id,
  link,
  url,

  className,
  renderValue,
}: {
  id: string;
  renderValue?: ReactNode;
  link?: boolean;
  url?: string;
  className?: string;
}) => {
  return (
    <span className={cn("inline-flex justify-end w-full gap-2", className)}>
      {!link && !url && (
        <span
          className={`truncated`}
          style={{
            overflow: "hidden",
          }}
        >
          {renderValue || id}
        </span>
      )}
      {link && (
        <a className="truncated" href={id} target="_blank">
          {renderValue || id}
        </a>
      )}
      {url && (
        <Link className="truncated" to={url}>
          {renderValue || id}
        </Link>
      )}
      <CopyToClicpboard text={id} />
    </span>
  );
};

export default IdContainer;
