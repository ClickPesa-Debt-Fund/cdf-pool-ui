import Tabs from "antd/lib/tabs";
import { useEffect, useState } from "react";
import notification from "antd/lib/notification";
import Activities from "./activities";

const BackstopActivities = ({ walletAddress }: { walletAddress?: string }) => {
  const [activeTab, setActiveTab] = useState("backstop_activities");
  useEffect(() => {
    if (!walletAddress) {
      setActiveTab("backstop_activities");
    }
  }, [walletAddress]);

  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 px-3 md:p-8 md:px-3">
      <Tabs
        items={[
          {
            label: "Backstop Activities",
            key: "backstop_activities",
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

export default BackstopActivities;
