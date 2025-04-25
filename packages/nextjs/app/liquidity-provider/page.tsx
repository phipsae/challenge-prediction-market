import type { NextPage } from "next";
import { AddRemoveLiquidity } from "~~/components/liquidity-provider/AddRemoveLiquidty";
import { PredictionMarketInfoLP } from "~~/components/liquidity-provider/PredictionMarketInfoLP";
import { ResolveMarketAndWithdraw } from "~~/components/liquidity-provider/ResolveMarketAndWithdraw";
import Race from "~~/components/race/Race";
import { PredictionMarketInfo } from "~~/components/user/PredictionMarketInfo";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Liquidity Provider of Prediction Market",
  description: "Easy implementation of Liquidity Provider for Prediction Market",
});

const LiquidityProvider: NextPage = () => {
  return (
    <>
      <div className="p-4 md:p-10">
        <h2 className="text-2xl font-bold mb-6 text-left">Prediction Market Info for Liquidity Provider</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          <div className="md:w-3/5">
            <PredictionMarketInfoLP />
          </div>
          <div className="md:w-2/5">
            <div className="bg-base-100">
              <div className="">
                <div className="mb-6">
                  <PredictionMarketInfo />
                  <Race />
                </div>
                <div>
                  <AddRemoveLiquidity />
                </div>
                <div>
                  <ResolveMarketAndWithdraw />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiquidityProvider;
