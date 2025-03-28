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
      <div className="text-center mt-8 bg-secondary p-4 md:p-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <PredictionMarketInfo />
            <Race />
          </div>
          <div className="flex-1">
            <OverviewBuySellShares />
          </div>
        </div>
      </div>
    </>
  );
};

export default Prediction;
