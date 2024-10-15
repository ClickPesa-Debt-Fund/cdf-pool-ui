import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackstopDetails from "./components/backstop-details";
import ManageBackstop from "./components/manage-backstop";
import { POOL_ID } from "@/constants";
import { useBackstop, useBackstopPool } from "../dashboard/services";
import { usePool } from "@/services";
import Spinner from "@/components/other/spinner";
import YourPosition from "./components/your-position";
import BackstopActivities from "./backstop-activities";

const Backstop = () => {
  const navigate = useNavigate();
  const { data: pool } = usePool(POOL_ID);
  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);

  if (!pool || !backstop || !backstopPoolData) {
    return <Spinner />;
  }

  return (
    <div className="md:space-y-[30px] space-y-[24px] md:py-[100px] py-[90px] container max-w-[1270px] min-h-full">
      <div>
        <Button
          variant={"link"}
          className="gap-2 -ml-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={20} /> Pool
        </Button>
      </div>
      <BackstopDetails />
      <YourPosition />
      <ManageBackstop />
      <BackstopActivities />
    </div>
  );
};

export default Backstop;
