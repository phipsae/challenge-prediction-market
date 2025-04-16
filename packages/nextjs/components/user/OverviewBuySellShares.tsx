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
    <div className="max-w-6xl mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
      {reported ? (
        <div className="mt-6 w-full">
          <Redeem />
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="flex-1 bg-base-200 rounded-lg p-4 border-4 border-green-500">
            <h3 className="text-xl font-semibold text-center mb-4 text-green-500">&quot;{yesOutcome}&quot; Token</h3>
            <PredictionBuySellShare optionIndex={0} colorScheme="green" />
          </div>
          <div className="flex-1 bg-base-200 rounded-lg p-4 border-4 border-red-500">
            <h3 className="text-xl font-semibold text-center mb-4 text-red-500">&quot;{noOutcome}&quot; Token</h3>
            <PredictionBuySellShare optionIndex={1} colorScheme="red" />
          </div>
        </div>
      )}
    </div>
  );
}
