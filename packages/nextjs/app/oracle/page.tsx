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
      <div className="container mx-auto text-center mt-8 bg-secondary p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="flex-1">
            <PredictionMarketInfo />
            <Race />
          </div>
          <div className="flex-1">
            <OracleAddress />
            <ReportPrediction />
          </div>
        </div>
      </div>
    </>
  );
};

export default Oracle;
