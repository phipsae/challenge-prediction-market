import { useReadContract } from "wagmi";

export function ProbabilityDisplay({
  token1Reserve,
  token2Reserve,
  tokenAddress,
  label,
  isReported,
  winningOption,
}: {
  token1Reserve: bigint;
  token2Reserve: bigint;
  tokenAddress: string;
  label?: string;
  isReported: boolean;
  winningOption?: string;
}) {
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
    address: tokenAddress as string,
    functionName: "totalSupply",
  });

  if (isReported) return <span className="font-bold">{winningOption}</span>;

  const calculateProbability = (_token1Reserve: bigint, _token2Reserve: bigint) => {
    if (_token1Reserve === undefined || _token2Reserve === undefined || totalSupply === undefined) return 0;

    if (_token1Reserve === totalSupply && _token2Reserve === totalSupply) return 0.5;

    // Calculate tokens sold for each option
    const token1Sold = totalSupply - _token1Reserve;
    const token2Sold = totalSupply - _token2Reserve;

    // Calculate total tokens sold
    const totalTokensSold = token1Sold + token2Sold;

    const probability = Number(token1Sold * BigInt(1e18)) / Number(totalTokensSold);

    return probability / 1e18;
  };

  const probability = calculateProbability(token1Reserve, token2Reserve);

  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{label || "Probability"}</h3>
      <div className="radial-progress text-neutral" style={{ "--value": probability * 100 } as any}>
        {(probability * 100).toFixed(2) + "%"}
      </div>
    </div>
  );
}
