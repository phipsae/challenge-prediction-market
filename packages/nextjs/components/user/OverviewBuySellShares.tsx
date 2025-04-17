"use client";

import { PredictionBuySellShare } from "~~/components/user/PredictionBuySellShare";
import { Redeem } from "~~/components/user/Redeem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export function OverviewBuySellShares() {
  const { data: prediction } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getPrediction",
  });

  const { data: owner } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "owner",
  });

  if (!owner)
    return (
      <div className="max-w-6xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
        <p className="text-base-content">No prediction market found</p>
      </div>
    );

  const reported = prediction?.[7] ?? false;
  const yesOutcome = prediction?.[1] ?? "Yes";
  const noOutcome = prediction?.[2] ?? "No";

  return (
    <div>
      {reported ? (
        <div className="w-full">
          <Redeem />
        </div>
      ) : (
        <div role="tablist" className="tabs tabs-bordered tabs-lg">
          <input
            type="radio"
            name="token_tabs"
            role="tab"
            className="tab font-lexend font-semibold text-green-500 min-w-40"
            aria-label={`"${yesOutcome}" Token`}
            defaultChecked
          />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="rounded-lg p-4 border-4 border-green-500">
              <PredictionBuySellShare optionIndex={0} colorScheme="green" />
            </div>
          </div>

          <input
            type="radio"
            name="token_tabs"
            role="tab"
            className="tab font-lexend font-semibold text-red-500 min-w-40"
            aria-label={`"${noOutcome}" Token`}
          />
          <div role="tabpanel" className="tab-content pt-6">
            <div className="rounded-lg p-4 border-4 border-red-500">
              <PredictionBuySellShare optionIndex={1} colorScheme="red" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
