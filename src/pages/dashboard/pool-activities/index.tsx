import Tabs from "antd/lib/tabs";
import notification from "antd/lib/notification";
import Activities from "./activities";
import { useEffect, useState } from "react";

const PoolActivities = ({ walletAddress }: { walletAddress?: string }) => {
  const [activeTab, setActiveTab] = useState("pool_activities");
  useEffect(() => {
    if (!walletAddress) {
      setActiveTab("pool_activities");
    }
  }, [walletAddress]);
  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8 space-y-4">
      <Tabs
        items={[
          {
            label: "Pool Activities",
            key: "pool_activities",
            children: <Activities />,
          },
          {
            label: "My Activities",
            key: "my_activities",
            children: <Activities walletAddress={walletAddress} />,
          },
        ]}
        activeKey={activeTab}
        onTabClick={(tab) => {
          if (!walletAddress && tab === "my_activities") {
            return notification.warning({
              message: "Connect Your wallet to see activities",
            });
          }
          setActiveTab(tab);
        }}
      />
    </div>
  );
};

export default PoolActivities;
