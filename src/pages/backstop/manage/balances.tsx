import { toBalance } from "@/utils/formatter";
import { DetailContentItem } from "@clickpesa/components-library.data-display.detail-content-item";

const Balances = ({
  lpBalance,
  usdcBalance,
  blndBalance,
}: {
  lpBalance?: bigint;
  usdcBalance?: string | number;
  blndBalance?: string | number;
}) => {
  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
      <div className="border rounded p-3">
        <DetailContentItem
          title="Your LP Token Balance"
          content={toBalance(lpBalance, 7)}
          style={{
            margin: 0,
          }}
          full_width
        />
      </div>
      <div className="border rounded p-3">
        <DetailContentItem
          title="Your BLND Balance"
          style={{
            margin: 0,
          }}
          content={toBalance(+(blndBalance || "0"), 7)}
          full_width
        />
      </div>
      <div className="border rounded p-3">
        <DetailContentItem
          title="Your USDC Balance"
          style={{
            margin: 0,
          }}
          content={toBalance(+(usdcBalance || "0"), 7)}
          full_width
        />
      </div>
    </div>
  );
};

export default Balances;
