import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-white fixed top-0 left-0 w-full z-10">
      <div className="container max-w-[1270px] flex justify-between gap-5 items-center py-3">
        <Link to="/">
          <img src="/icons/logo.svg" alt="" />
        </Link>
        <Link
          to={"/pools"}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Pools
        </Link>
      </div>
    </div>
  );
};

export default Header;
