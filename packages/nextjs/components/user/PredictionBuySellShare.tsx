"use client";

import { useState } from "react";
import { ProbabilityDisplay } from "./ProbabilityDisplay";
import { formatEther, parseEther } from "viem";
import { useReadContract } from "wagmi";
import { GiveAllowance } from "~~/components/user/GiveAllowance";
import { TokenBalance } from "~~/components/user/TokenBalance";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function PredictionBuySellShare({ optionIndex, colorScheme }: { optionIndex: number; colorScheme: string }) {
  const [inputBuyAmount, setInputBuyAmount] = useState<bigint>(BigInt(0));
  const tokenBuyAmount = parseEther((inputBuyAmount || BigInt(0)).toString());
  const [inputSellAmount, setInputSellAmount] = useState<bigint>(BigInt(0));
  const tokenSellAmount = parseEther((inputSellAmount || BigInt(0)).toString());

  const { data: deployedContractData } = useDeployedContractInfo({ contractName: "PredictionMarket" });
  const contractAddress = deployedContractData?.address;

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
    contractName: "PredictionMarket",
  });

  const { data: prediction } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getPrediction",
  });

  const { data: owner } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "owner",
  });

  const { data: totalPriceInEth } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getBuyPriceInEth",
    args: [optionIndex, tokenBuyAmount],
    watch: true,
  });

  const { data: sellTotalPriceInEth } = useScaffoldReadContract({
    contractName: "PredictionMarket",
    functionName: "getSellPriceInEth",
    args: [optionIndex, tokenSellAmount],
    watch: true,
  });

  const erc20Abi = [
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const;

  const { data: totalSupply } = useReadContract({
    abi: erc20Abi,
    address: prediction?.[8] as string,
    functionName: "totalSupply",
  });

  if (!owner)
    return (
      <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-center">No prediction market found</h2>
      </div>
    );

  const tokenAddress = prediction?.[8 + optionIndex] ?? "0x0000000000000000000000000000000000000000";
  const option = prediction?.[1 + optionIndex] ?? "Yes";
  const yesTokenReserve = prediction?.[5 + optionIndex] as bigint;
  const noTokenReserve = prediction?.[6 - optionIndex] as bigint;
  const ethCollateral = prediction?.[11] ?? 0n;
  const isReported = prediction?.[7] ?? false;
  const yesOutcome = prediction?.[1] ?? "Yes";
  const noOutcome = prediction?.[2] ?? "No";
  const optionToken1 = prediction?.[8] ?? "0x0000000000000000000000000000000000000000";
  const winningToken = prediction?.[10] ?? "0x0000000000000000000000000000000000000000";
  const winningOption = winningToken === optionToken1 ? yesOutcome : noOutcome;

  const etherToReceive = totalSupply
    ? (parseEther((inputBuyAmount || BigInt(0)).toString()) * ethCollateral) / totalSupply
    : 0n;
  const etherToWin = totalPriceInEth ? etherToReceive - totalPriceInEth : 0n;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
      <div className="flex justify-center">Tokens available to buy: {formatEther(yesTokenReserve ?? BigInt(0))}</div>

      <ProbabilityDisplay
        token1Reserve={yesTokenReserve ?? BigInt(0)}
        token2Reserve={noTokenReserve ?? BigInt(0)}
        tokenAddress={tokenAddress as string}
        isReported={isReported}
        winningOption={winningOption}
      />

      <div className="flex justify-center">
        <TokenBalance tokenAddress={tokenAddress as string} option={option as string} redeem={false} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Buy Section */}
        <div className={`bg-${colorScheme}-50 p-3 rounded-lg`}>
          <h2 className={`text-lg font-semibold text-${colorScheme}-800 mb-2`}>Buy &quot;{option}&quot;</h2>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Amount to buy"
              className="input input-bordered input-sm w-full"
              onChange={e => setInputBuyAmount(BigInt(e.target.value))}
            />

            {totalPriceInEth && (
              <>
                <div className="text-sm"></div>

                <ProbabilityDisplay
                  token1Reserve={(yesTokenReserve ?? BigInt(0)) - parseEther((inputBuyAmount || BigInt(0)).toString())}
                  token2Reserve={noTokenReserve ?? BigInt(0)}
                  tokenAddress={tokenAddress as string}
                  label="New Probability"
                  isReported={isReported}
                  winningOption={winningOption}
                />

                {totalSupply && (
                  <div className="text-sm">
                    For {Number(formatEther(totalPriceInEth)).toFixed(4)} ETH you have the chance to win Ξ
                    {Number(formatEther(etherToReceive)).toFixed(4)} (upside Ξ
                    {Number(formatEther(etherToWin)).toFixed(4)})
                  </div>
                )}
              </>
            )}

            <button
              className={`btn btn-sm w-full btn-primary text-white`}
              disabled={!totalPriceInEth}
              onClick={async () => {
                try {
                  await writeYourContractAsync({
                    functionName: "buyTokensWithETH",
                    args: [optionIndex, tokenBuyAmount],
                    value: totalPriceInEth,
                  });
                } catch (e) {
                  console.error("Error buying tokens:", e);
                }
              }}
            >
              Buy
            </button>
          </div>
        </div>

        <div className="bg-base-100 p-3 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sell &quot;{option}&quot;</h2>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Amount to sell"
              className="input input-bordered input-sm w-full"
              onChange={e => setInputSellAmount(BigInt(e.target.value))}
            />

            {sellTotalPriceInEth && (
              <>
                <div className="text-sm">ETH to receive: {formatEther(sellTotalPriceInEth)}</div>
                <ProbabilityDisplay
                  token1Reserve={(yesTokenReserve ?? BigInt(0)) + parseEther((inputSellAmount || BigInt(0)).toString())}
                  token2Reserve={noTokenReserve ?? BigInt(0)}
                  tokenAddress={tokenAddress as string}
                  label="New Probability"
                  isReported={isReported}
                  winningOption={winningOption}
                />
              </>
            )}

            <div className="flex gap-2">
              <GiveAllowance
                tokenAddress={tokenAddress as string}
                spenderAddress={contractAddress ?? ""}
                amount={inputSellAmount.toString()}
                showInput={false}
              />
              <button
                className="btn btn-sm flex-1 btn-primary text-white"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "sellTokensForEth",
                      args: [optionIndex, tokenSellAmount],
                    });
                  } catch (e) {
                    console.error("Error selling tokens:", e);
                  }
                }}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
