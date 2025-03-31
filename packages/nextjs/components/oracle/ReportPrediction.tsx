"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function ReportPrediction() {
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const { address } = useAccount();

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "PredictionMarket",
  });

  const { data: prediction } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "prediction",
  });

  const { data: owner } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "owner",
  });

  const handleReport = async () => {
    try {
      await writeContractAsync({
        functionName: "report",
        args: [selectedOutcome],
      });
    } catch (error) {
      console.error("Error reporting outcome:", error);
    }
  };

  if (!owner) return null;

  const yesOutcome = prediction?.[1] ?? "Yes";
  const noOutcome = prediction?.[2] ?? "No";

  const isOracle = address === prediction?.[3];
  return (
    <div className="p-6 bg-base-100 rounded-xl shadow-lg mt-5">
      <h2 className="text-2xl font-bold text-center mb-4">Report Prediction Outcome</h2>
      {!isOracle && <p className="text-error text-center mb-4">Only the oracle can report prediction</p>}
      <div className="flex gap-4">
        <select
          className="select select-bordered flex-1"
          value={selectedOutcome}
          onChange={e => setSelectedOutcome(Number(e.target.value))}
          disabled={!isOracle}
        >
          <option value={0}>{yesOutcome}</option>
          <option value={1}>{noOutcome}</option>
        </select>
        <button className="btn btn-primary" onClick={handleReport} disabled={!isOracle}>
          Report Outcome
        </button>
      </div>
    </div>
  );
}
