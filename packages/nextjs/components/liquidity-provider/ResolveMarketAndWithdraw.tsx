"use client";

import { LPFinalTokenBalance } from "~~/components/liquidity-provider/LPFinalTokenBalance";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function ResolveMarketAndWithdraw() {
  const { data: prediction } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "prediction",
  });

  const { data: owner } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "owner",
  });

  const { data: predictionMarketContract } = useScaffoldContract({
    contractName: "PredictionMarket",
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "PredictionMarket",
  });

  if (!owner)
    return (
      <div className="max-w-lg mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Resolve Market and Withdraw ETH</h2>
        <p className="text-base-content">No prediction market found</p>
      </div>
    );

  const tokenValue = prediction?.[4] ?? BigInt(0);
  const yesOutcome = prediction?.[1] ?? "Yes";
  const noOutcome = prediction?.[2] ?? "No";
  const isReported = prediction?.[7] ?? false;
  const yesToken = prediction?.[8] ?? "0x0000000000000000000000000000000000000000";
  const winningToken = prediction?.[10] ?? "0x0000000000000000000000000000000000000000";
  const lpRevenue = prediction?.[12] ?? BigInt(0);
  const winningOption = winningToken === yesToken ? yesOutcome : noOutcome;

  if (!isReported) return <></>;

  const handleWithdraw = async () => {
    try {
      await writeContractAsync({
        functionName: "resolveMarketAndWithdraw",
      });
    } catch (error) {
      console.error("Error redeeming tokens:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-base-100 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Resolve Market and Withdraw ETH</h2>
      <div className="flex flex-row gap-4 items-center">
        <LPFinalTokenBalance
          tokenAddress={winningToken as string}
          winningOption={winningOption}
          address={predictionMarketContract?.address as string}
          tokenValue={tokenValue}
          lpRevenue={lpRevenue}
        />
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={handleWithdraw}>
            Withdraw ETH
          </button>
        </div>
      </div>
    </div>
  );
}
