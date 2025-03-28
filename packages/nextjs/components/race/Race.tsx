"use client";

import React, { useEffect, useRef, useState } from "react";
import Car from "./Car";
import RaceEffects from "./RaceEffects";

const RaceTrack: React.FC = () => {
  // Race configuration
  const RACE_DURATION = 30; // Duration in seconds

  // Two cars: red (id: 1) and blue (id: 2)
  const [cars, setCars] = useState([
    { id: 1, position: 0, lane: 0, color: "#2ecc71" },
    { id: 2, position: 0, lane: 1, color: "#e74c3c" },
  ]);
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceFinished, setRaceFinished] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const raceInterval = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Start the race with a fixed duration
  const startRace = () => {
    if (raceStarted) return;

    setRaceStarted(true);
    startTimeRef.current = Date.now();

    raceInterval.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const currentTime = (Date.now() - startTimeRef.current) / 1000; // seconds elapsed

      if (currentTime >= RACE_DURATION) {
        // At race end, set final positions
        setElapsedTime(RACE_DURATION);
        // Red car: constant speed 3 units/second → 3 * RACE_DURATION
        // Blue car: 2.8 for first 10 sec, then 3.6 for remaining time → (2.8*10) + (3.6*(RACE_DURATION-10))
        setCars([
          { id: 1, position: 3 * RACE_DURATION, lane: 0, color: "#2ecc71" },
          { id: 2, position: 2.8 * 10 + 3.6 * (RACE_DURATION - 10), lane: 1, color: "#e74c3c" },
        ]);
        setRaceFinished(true);
        if (raceInterval.current) clearInterval(raceInterval.current);
      } else {
        setElapsedTime(currentTime);
        // Update positions based on elapsed time:
        const redPosition = 3 * currentTime;
        const bluePosition = currentTime < 10 ? 2.8 * currentTime : 2.8 * 10 + 3.6 * (currentTime - 10);
        setCars([
          { id: 1, position: redPosition, lane: 0, color: "#2ecc71" },
          { id: 2, position: bluePosition, lane: 1, color: "#e74c3c" },
        ]);
      }
    }, 100); // update every 100ms
  };

  // Reset the race to the initial state
  const resetRace = () => {
    if (raceInterval.current) clearInterval(raceInterval.current);
    setRaceStarted(false);
    setRaceFinished(false);
    setElapsedTime(0);
    setCars([
      { id: 1, position: 0, lane: 0, color: "#2ecc71" },
      { id: 2, position: 0, lane: 1, color: "#e74c3c" },
    ]);
    startTimeRef.current = null;
  };

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Clean up the interval on component unmount
  useEffect(() => {
    return () => {
      if (raceInterval.current) clearInterval(raceInterval.current);
    };
  }, []);

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-5">
      <div className="w-full max-w-4xl mx-auto relative">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-2xl font-bold">Race Time: {formatTime(elapsedTime)}</div>
          <div className="space-x-4 flex items-center">
            <button
              onClick={startRace}
              disabled={raceStarted}
              className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
            >
              Start Race
            </button>
            <button
              onClick={resetRace}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md transition-colors"
            >
              Reset Race
            </button>
          </div>
        </div>

        <div className="relative w-full h-[200px] bg-gray-200 rounded-lg overflow-hidden">
          <RaceEffects isRacing={raceStarted && !raceFinished} />

          <div className="absolute top-0 bottom-0 w-4 bg-black" style={{ left: "90%", zIndex: 5 }}>
            <div className="h-full w-full grid grid-cols-2 grid-rows-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full ${(Math.floor(i / 2) + i) % 2 === 0 ? "bg-black" : "bg-white"}`}
                />
              ))}
            </div>
          </div>

          <div className="absolute left-0 right-0 h-[2px] bg-white" style={{ top: "50%" }}></div>

          {cars.map(car => (
            <Car
              key={car.id}
              position={car.position}
              lane={car.lane}
              color={car.color}
              isWinner={raceFinished && car.id === 2} // Car 2 (red) is the winner
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceTrack;
