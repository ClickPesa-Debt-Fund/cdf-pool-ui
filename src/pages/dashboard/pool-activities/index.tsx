import Tabs from "antd/lib/tabs";
import notification from "antd/lib/notification";
import Activities from "./activities";
import { useEffect, useState } from "react";
import { SectionTemplate } from "@clickpesa/components-library.section-template";
import { useTheme } from "@/contexts/theme";
import { useWallet } from "@/contexts/wallet";

const PoolActivities = () => {
  const { walletAddress } = useWallet();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("pool_activities");
  useEffect(() => {
    if (!walletAddress) {
      setActiveTab("pool_activities");
    }
  }, [walletAddress]);
  return (
    <SectionTemplate
      className="bg-white md:rounded-2xl rounded-lg"
      mode={theme}
    >
      <Tabs
        items={[
          {
            label: "Pool Activities",
            key: "pool_activities",
            children: <Activities />,
          },
          {
            label: "Your Activities",
            key: "your_activities",
            children: <Activities walletAddress={walletAddress} />,
          },
        ]}
        activeKey={activeTab}
        onTabClick={(tab) => {
          if (!walletAddress && tab === "your_activities") {
            return notification.warning({
              message: "Connect Your wallet to see activities",
            });
          }
          setActiveTab(tab);
        }}
      />
    </SectionTemplate>
  );
};

export default PoolActivities;
