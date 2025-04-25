"use client";

import Image from "next/image";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex items-center flex-col flex-grow mt-4">
          <div className="px-5 w-[90%]">
            <h1 className="text-center mb-6">
              <span className="block text-4xl font-bold">Challenge #6: Prediction Market</span>
            </h1>
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/hero-home.png"
                width="727"
                height="231"
                alt="challenge banner"
                className="rounded-xl border-4 border-primary"
              />
              <div className="max-w-3xl">
                <p className="text-center text-lg mt-8">
                  🔮 This challenge will guide you through building and understanding a simple prediction market, where
                  users can buy and sell ERC20 outcome shares based on the result of an event. You&apos;ll step into
                  three roles: liquidity provider, oracle, and user. The event? A car race 🏎️🏁.
                </p>
                <p className="text-center text-lg">
                  🌟 The final deliverable is an app where users can bet on the outcome of a race, trade outcome shares
                  while the race is ongoing, and redeem their shares once it ends. Liquidity providers can add or remove
                  liquidity, and an oracle reports the race result. Deploy your contracts to a testnet then build and
                  upload your app to a public web server. Submit the url on{" "}
                  <a href="https://speedrunethereum.com/" target="_blank" rel="noreferrer" className="underline">
                    SpeedRunEthereum.com
                  </a>{" "}
                  !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
