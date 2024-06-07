import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-white fixed top-0 left-0 w-full z-10">
      <div className="container max-w-[1200px] flex justify-between gap-5 items-center py-3">
        <Link to="/">
          <img src="/icons/logo.svg" alt="" />
        </Link>
        <Link to={"/pools"}>Pools</Link>
      </div>
    </div>
  );
};

export default Header;
