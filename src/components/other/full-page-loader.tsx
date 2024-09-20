import { ReactNode } from "react";
import Spinner from "./spinner";

const FullPageSpinner = ({
  message,
  children,
}: {
  message?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="clickpesa-full-page-loader">
      <div className="content">
        {children ? (
          <>{children}</>
        ) : (
          <>
            {message && (
              <h3 className="text-white">{message || "Processing..."}</h3>
            )}
            <Spinner height={30} />
          </>
        )}
      </div>
    </div>
  );
};

export default FullPageSpinner;
