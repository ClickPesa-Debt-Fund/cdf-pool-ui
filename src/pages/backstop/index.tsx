import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackstopDetails from "./components/backstop-details";
import ManageBackstop from "./components/manage-backstop";
import { POOL_ID } from "@/constants";
import { useBackstop, useBackstopPool } from "../dashboard/services";
import { usePool } from "@/services";
import Spinner from "@/components/other/spinner";
import { useWallet } from "@/contexts/wallet";
import YourPosition from "./components/your-position";
import BackstopActivities from "./components/backstop-activities";

const Backstop = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
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
          <ArrowLeft size={20} /> Dashboard
        </Button>
      </div>
      <BackstopDetails />
      {connected && (
        <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
          <ManageBackstop />
        </div>
      )}
      {connected && <YourPosition />}
      <BackstopActivities />
    </div>
  );
};

export default Backstop;
