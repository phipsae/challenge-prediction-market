"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { formatEther } from "viem";
import { useBlockNumber, useReadContract } from "wagmi";
import { erc20Abi } from "~~/components/constants";
import { useScaffoldReadContract, useSelectedNetwork } from "~~/hooks/scaffold-eth";

export function PredictionMarketInfoLP() {
  const { data: prediction, isLoading } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "prediction",
  });

  const { data: totalSupply, queryKey } = useReadContract({
    abi: erc20Abi,
    address: prediction?.[8] as string,
    functionName: "totalSupply",
  });

  const selectedNetwork = useSelectedNetwork();
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({
    watch: true,
    chainId: selectedNetwork.id,
    query: {
      enabled: true,
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient, queryKey]);

  if (isLoading)
    return (
      <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Prediction Market Info</h2>
        <p className="text-base-content">Loading prediction market...</p>
      </div>
    );

  if (!prediction)
    return (
      <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Prediction Market Info</h2>
        <p className="text-base-content">No prediction market found</p>
      </div>
    );

  const token1Reserve = prediction[5];
  const token2Reserve = prediction[6];
  const ethCollateral = prediction[11];
  const lpTradingRevenue = prediction[12];

  const tokenValue = prediction[4];
  const predictionOutcome1 = prediction[1];
  const predictionOutcome2 = prediction[2];
  const isReported = prediction[7];
  const optionToken1 = prediction[8];
  const winningToken = prediction[10];
  const initialProbability = prediction[14];
  const percentageLocked = prediction[15] * BigInt(2);

  if (!totalSupply) return null;

  const yesTokenLocked = (totalSupply * BigInt(percentageLocked) * BigInt(initialProbability)) / BigInt(100 * 100);
  const noTokenLocked =
    (totalSupply * BigInt(percentageLocked) * (BigInt(100) - BigInt(initialProbability))) / BigInt(100 * 100);
  const yesTokenSold = totalSupply - yesTokenLocked - token1Reserve;
  const noTokenSold = totalSupply - noTokenLocked - token2Reserve;

  // const yesTokenSold =

  const winningOption = winningToken === optionToken1 ? predictionOutcome1 : predictionOutcome2;

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Prediction Market Info for Liquidity Provider</h2>

      <div className="space-y-6">
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="stats shadow w-full">
            <div className="stat">
              <div className="text-xl">Prediciton Market Collateral</div>
              (Amount of ETH that goes to the winning token)
              <div className="stat-value text-primary pt-2">
                {Number(formatEther(BigInt(ethCollateral ?? 0))).toFixed(4)} ETH
              </div>
            </div>
            <div className="stat">
              <div className="text-xl">LP Revenue</div>
              (Token revenue when token gets bought/sold)
              <div className="stat-value text-primary pt-2">
                {Number(formatEther(BigInt(lpTradingRevenue ?? 0))).toFixed(4)} ETH
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-200 p-4 rounded-lg">
          <div className="stats shadow w-full">
            <div className="stat flex flex-row items-center justify-center">
              <div>
                <div className="text-xl">Token Value</div>
                <div className="text-sm">
                  {isReported
                    ? `(Value of winning token "${winningOption}" in ETH)`
                    : "(Value of winning token in ETH)"}
                </div>
              </div>
              <div className="text-primary text-xl">{Number(formatEther(BigInt(tokenValue ?? 0))).toFixed(4)} ETH</div>
            </div>
          </div>
        </div>

        {!isReported ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Yes Token */}
            <div className="bg-base-200 p-4 rounded-lg border-4 border-green-500">
              <h2 className="text-2xl font-semibold mb-2">&quot;{predictionOutcome1}&quot; Token</h2>
              <h3 className="text-lg mb-2">
                Amount of {predictionOutcome1} tokens{" "}
                <span className="font-bold">locked away by prediction market</span>
              </h3>
              <div className="stat-value text-lg">{Number(formatEther(BigInt(yesTokenLocked))).toFixed(2)} tokens</div>

              <h3 className="text-sm mb-2 pt-2">
                (Value of tokens{" "}
                {Number(formatEther(BigInt(((yesTokenLocked ?? 0) * (tokenValue ?? 0)) / BigInt(10 ** 18)))).toFixed(2)}{" "}
                ETH if Oracle reports {predictionOutcome1})
              </h3>

              <h3 className="text-lg mb-2 border-t-4 pt-2">
                Amount of {predictionOutcome1} tokens <span className="font-bold">held by prediction market</span>
              </h3>
              <div className="stat-value text-lg">
                {Number(formatEther(BigInt(token1Reserve ?? 0))).toFixed(2)} tokens
              </div>

              <h3 className="text-sm mb-2 pt-2">
                (Value of tokens{" "}
                {Number(formatEther(BigInt(((token1Reserve ?? 0) * (tokenValue ?? 0)) / BigInt(10 ** 18)))).toFixed(2)}{" "}
                ETH if Oracle reports {predictionOutcome1})
              </h3>
              <h3 className="text-lg mb-2 border-t-4 pt-2">
                Amount of {predictionOutcome1} <span className="font-bold">tokens sold</span>
              </h3>
              <div className="stat-value text-lg">{Number(formatEther(BigInt(yesTokenSold))).toFixed(2)} tokens</div>
              <h3 className="text-sm mb-2 pt-2">
                (Value of tokens{" "}
                {Number(formatEther(BigInt((BigInt(yesTokenSold) * (tokenValue ?? 0)) / BigInt(10 ** 18)))).toFixed(2)}{" "}
                ETH if Oracle reports {predictionOutcome1})
              </h3>
            </div>

            {/* No Token */}
            <div className="bg-base-200 p-4 rounded-lg border-4 border-red-500">
              <h2 className="text-2xl font-semibold mb-2">&quot;{predictionOutcome2}&quot; Token</h2>
              <h3 className="text-lg mb-2">
                Amount of {predictionOutcome2} tokens{" "}
                <span className="font-bold">locked away by prediction market</span>
              </h3>
              <div className="stat-value text-lg">{Number(formatEther(BigInt(noTokenLocked))).toFixed(2)} tokens</div>

              <h3 className="text-sm mb-2 pt-2">
                (Value of tokens{" "}
                {Number(formatEther(BigInt(((noTokenLocked ?? 0) * (tokenValue ?? 0)) / BigInt(10 ** 18)))).toFixed(2)}{" "}
                ETH if Oracle reports {predictionOutcome2})
              </h3>
              <h3 className="text-lg mb-2 border-t-4 pt-2">
                Amount of {predictionOutcome2} tokens <span className="font-bold">held by prediction market</span>
              </h3>
              <div className="stat-value text-lg">
                {Number(formatEther(BigInt(token2Reserve ?? 0))).toFixed(2)} tokens
              </div>
              <h3 className="text-sm mb-2 pt-2">
                (Value of tokens{" "}
                {Number(formatEther(BigInt(((token2Reserve ?? 0) * (tokenValue ?? 0)) / BigInt(10 ** 18)))).toFixed(2)}{" "}
                ETH if Oracle reports {predictionOutcome2})
              </h3>
              <h3 className="text-lg mb-2 border-t-4 pt-2">
                Amount of {predictionOutcome2} <span className="font-bold">tokens sold</span>
              </h3>
              <div className="stat-value text-lg">{Number(formatEther(BigInt(noTokenSold))).toFixed(2)} tokens</div>
              <h3 className="text-sm mb-2 pt-2">
                (Value of tokens{" "}
                {Number(formatEther(BigInt((BigInt(noTokenSold) * (tokenValue ?? 0)) / BigInt(10 ** 18)))).toFixed(2)}{" "}
                ETH if Oracle reports {predictionOutcome2})
              </h3>
            </div>
          </div>
        ) : (
          <div className="bg-base-200 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Oracle reported: {winningOption}</h2>
            <h3 className="text-lg mb-2">
              Value of {winningOption} tokens held by prediction market:{" "}
              {Number(
                formatEther(
                  BigInt(
                    ((winningToken === optionToken1 ? token1Reserve : token2Reserve) * tokenValue) / BigInt(10 ** 18),
                  ),
                ),
              ).toFixed(4)}{" "}
              ETH
            </h3>
            <h3 className="text-sm mb-2 pt-2">
              Value of {winningOption} tokens held by users:{" "}
              {Number(
                formatEther(
                  BigInt(
                    ((BigInt(totalSupply ?? 0) -
                      BigInt(winningToken === optionToken1 ? token1Reserve : token2Reserve)) *
                      tokenValue) /
                      BigInt(10 ** 18),
                  ),
                ),
              ).toFixed(4)}{" "}
              ETH
            </h3>
            <h3 className="text-sm mb-2">
              &quot;{winningToken === optionToken1 ? predictionOutcome2 : predictionOutcome1}&quot; tokens have no value
              anymore
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
