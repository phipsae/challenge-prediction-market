import type { NextPage } from "next";
import Race from "~~/components/race/Race";
import { OverviewBuySellShares } from "~~/components/user/OverviewBuySellShares";
import { PredictionMarketInfo } from "~~/components/user/PredictionMarketInfo";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Prediction Market",
  description: "Buy/Sell shares in a prediction market",
});

const Prediction: NextPage = () => {
  return (
    <>
      <div className="p-4 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <OverviewBuySellShares />
          </div>
          <div>
            <PredictionMarketInfo />
            <Race />
          </div>
        </div>
      </div>
    </>
  );
};

export default Prediction;
