import { Button } from "@/components/ui/button";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";
import { StatusTag } from "@clickpesa/components-library.status-tag";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import notification from "antd/lib/notification";
import { useWallet } from "@/contexts/wallet";
import { useState } from "react";
import Supply from "./supply";
import { ArrowUpCircle } from "lucide-react";

const PoolDetails = () => {
  const { connected, connect } = useWallet();
  const [openSupplyModal, setOpenSupplyModal] = useState(false);
  return (
    <div className="bg-white md:rounded-2xl rounded-lg p-6 md:p-8">
      <Row gutter={[12, 12]}>
        <Col md={18} span={24}>
          <Row gutter={[12, 12]}>
            <DetailContentItem
              title="Pool Status"
              content={
                <span className="w-fit flex text-font-semi-bold">
                  <StatusTag name="Active" color="green" />
                </span>
              }
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="APY"
              content={<span className="text-font-semi-bold">17%</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Supplied Funds"
              content={<span className="text-font-semi-bold">48.3k USDC</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Supplied Collateral"
              content={<span className="text-font-semi-bold">28k CPYT</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Borrowed Funds"
              content={<span className="text-font-semi-bold">30.6k USDC</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Total Repaid Funds"
              content={<span className="text-font-semi-bold">12k USDC</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Number of Participation MFIs"
              content={<span className="text-font-semi-bold">128</span>}
              style={{
                marginTop: 0,
              }}
            />
            <DetailContentItem
              title="Number of Participation Funders"
              content={<span className="text-font-semi-bold">24</span>}
              style={{
                marginTop: 0,
              }}
            />
          </Row>
        </Col>
        <Col md={6} span={24} className="space-y-4">
          <Button
            className="w-full"
            onClick={() => {
              if (connected) {
                setOpenSupplyModal(true);
              } else {
                connect((successful: boolean) => {
                  if (successful) {
                    notification.success({
                      message: "Wallet connected.",
                    });
                    setOpenSupplyModal(true);
                  } else {
                    notification.error({
                      message: "Unable to connect wallet.",
                    });
                  }
                });
              }
            }}
          >
            Supply
          </Button>
          <Button className="w-full gap-4" variant={"outline"}>
            View Contract
            <ArrowUpCircle className="rotate-45" size={14} />
          </Button>
        </Col>
      </Row>
      <Supply open={openSupplyModal} close={() => setOpenSupplyModal(false)} />
    </div>
  );
};

export default PoolDetails;
