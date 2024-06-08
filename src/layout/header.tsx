import { HomeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-white fixed top-0 left-0 w-full z-10">
      <div className="container max-w-[1270px] flex justify-between gap-5 items-center py-3">
        <Link to="/">
          <img src="/icons/logo.svg" alt="" />
        </Link>
        <Link to={"/pools"} className="text-primary">
          <HomeIcon strokeWidth="0.5" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
