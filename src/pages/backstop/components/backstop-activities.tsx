import { POOL_ID } from "@/constants";
import Tabs from "antd/lib/tabs";
import {
  useBackstop,
  useBackstopPool,
  useBackstopPoolUser,
} from "@/pages/dashboard/services";
import Deposits from "./activities/deposits";
import Q4w from "./activities/q4w";

const BackstopActivities = () => {
  const { data: backstop } = useBackstop();
  const { data: backstopPoolData } = useBackstopPool(POOL_ID);
  const { data: backstopUserData } = useBackstopPoolUser(POOL_ID);

  if (
    backstop === undefined ||
    backstopUserData === undefined ||
    backstopPoolData === undefined
  ) {
    return <></>;
  }

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 px-3 md:p-8 md:px-3">
      <h3 className="text-font-semi-bold mb-6 px-3 md:px-5">
        Backstop Activities
      </h3>
      <Tabs
        defaultActiveKey={"q4w"}
        items={[
          {
            key: "deposits",
            label: "Deposits",
            children: <Deposits />,
          },
          {
            key: "q4w",
            label: "Withdrawal Queues",
            children: <Q4w />,
          },
        ]}
        className="w-full"
      />
    </div>
  );
};

export default BackstopActivities;
