import Tabs from "antd/lib/tabs";
import { useEffect, useState } from "react";
import notification from "antd/lib/notification";
import Activities from "./activities";
import { useWallet } from "@/contexts/wallet";
import { useTheme } from "@/contexts/theme";
import { SectionTemplate } from "@clickpesa/components-library.section-template";

const BackstopActivities = () => {
  const { theme } = useTheme();
  const { walletAddress } = useWallet();
  const [activeTab, setActiveTab] = useState("backstop_activities");
  useEffect(() => {
    if (!walletAddress) {
      setActiveTab("backstop_activities");
    }
  }, [walletAddress]);

  return (
    <SectionTemplate className="md:rounded-2xl rounded-lg" mode={theme}>
      <Tabs
        items={[
          {
            label: "Backstop Activities",
            key: "backstop_activities",
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

export default BackstopActivities;
