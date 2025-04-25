import type { NextPage } from "next";
import { OracleAddress } from "~~/components/oracle/OracleAddress";
import { ReportPrediction } from "~~/components/oracle/ReportPrediction";
import Race from "~~/components/race/Race";
import { PredictionMarketInfo } from "~~/components/user/PredictionMarketInfo";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Oracle",
  description: "Easy Oracle implementation",
});

const Oracle: NextPage = () => {
  return (
    <>
      <div className="text-center mt-8 p-4 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="p-6 border-default">
              <OracleAddress />
            </div>
            <ReportPrediction />
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

export default Oracle;
