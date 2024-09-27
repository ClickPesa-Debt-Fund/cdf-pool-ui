import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackstopDetails from "./components/backstop-details";

const Backstop = () => {
  const navigate = useNavigate();
  return (
    <div className="md:space-y-[30px] space-y-[24px] md:py-[100px] py-[90px] container max-w-[1270px] min-h-full">
      <div>
        <Button
          variant={"link"}
          className="gap-2 -ml-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={20} /> Dashboard
        </Button>
      </div>
      <BackstopDetails />
    </div>
  );
};

export default Backstop;
