"use client";

import React, { useEffect, useRef } from "react";
import Car from "./Car";
import RaceEffects from "./RaceEffects";
import { useRaceStore } from "~~/services/store/raceStore";

const RaceTrack: React.FC = () => {
  // Race configuration
  const RACE_DURATION = 30; // Duration in seconds

  const {
    raceStarted,
    raceFinished,
    elapsedTime,
    cars,
    startTime,
    setRaceStarted,
    setRaceFinished,
    setElapsedTime,
    setCars,
    setStartTime,
    resetRace,
  } = useRaceStore();

  const raceInterval = useRef<NodeJS.Timeout | null>(null);

  // Start the race with a fixed duration
  const startRace = () => {
    if (raceStarted) return;

    const newStartTime = Date.now();
    setStartTime(newStartTime);
    setRaceStarted(true);

    // Clear any existing interval
    if (raceInterval.current) {
      clearInterval(raceInterval.current);
    }

    // Start new interval
    raceInterval.current = setInterval(() => {
      const currentTime = (Date.now() - newStartTime) / 1000; // seconds elapsed

      if (currentTime >= RACE_DURATION) {
        // At race end, set final positions
        setElapsedTime(RACE_DURATION);
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

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle visibility change and race state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden, clear the interval
        if (raceInterval.current) {
          clearInterval(raceInterval.current);
        }
      } else if (raceStarted && !raceFinished && startTime) {
        // Tab is visible and race is in progress, restart the interval
        const currentTime = (Date.now() - startTime) / 1000;
        if (currentTime < RACE_DURATION) {
          // Clear any existing interval
          if (raceInterval.current) {
            clearInterval(raceInterval.current);
          }

          // Start new interval
          raceInterval.current = setInterval(() => {
            const updatedTime = (Date.now() - startTime) / 1000;
            if (updatedTime >= RACE_DURATION) {
              setElapsedTime(RACE_DURATION);
              setCars([
                { id: 1, position: 3 * RACE_DURATION, lane: 0, color: "#2ecc71" },
                { id: 2, position: 2.8 * 10 + 3.6 * (RACE_DURATION - 10), lane: 1, color: "#e74c3c" },
              ]);
              setRaceFinished(true);
              if (raceInterval.current) clearInterval(raceInterval.current);
            } else {
              setElapsedTime(updatedTime);
              const redPosition = 3 * updatedTime;
              const bluePosition = updatedTime < 10 ? 2.8 * updatedTime : 2.8 * 10 + 3.6 * (updatedTime - 10);
              setCars([
                { id: 1, position: redPosition, lane: 0, color: "#2ecc71" },
                { id: 2, position: bluePosition, lane: 1, color: "#e74c3c" },
              ]);
            }
          }, 100);
        } else {
          // Race has finished while tab was hidden
          setElapsedTime(RACE_DURATION);
          setCars([
            { id: 1, position: 3 * RACE_DURATION, lane: 0, color: "#2ecc71" },
            { id: 2, position: 2.8 * 10 + 3.6 * (RACE_DURATION - 10), lane: 1, color: "#e74c3c" },
          ]);
          setRaceFinished(true);
        }
      }
    };

    // Initial setup if race is already started
    if (raceStarted && !raceFinished && startTime) {
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime < RACE_DURATION) {
        if (raceInterval.current) {
          clearInterval(raceInterval.current);
        }
        raceInterval.current = setInterval(() => {
          const updatedTime = (Date.now() - startTime) / 1000;
          if (updatedTime >= RACE_DURATION) {
            setElapsedTime(RACE_DURATION);
            setCars([
              { id: 1, position: 3 * RACE_DURATION, lane: 0, color: "#2ecc71" },
              { id: 2, position: 2.8 * 10 + 3.6 * (RACE_DURATION - 10), lane: 1, color: "#e74c3c" },
            ]);
            setRaceFinished(true);
            if (raceInterval.current) clearInterval(raceInterval.current);
          } else {
            setElapsedTime(updatedTime);
            const redPosition = 3 * updatedTime;
            const bluePosition = updatedTime < 10 ? 2.8 * updatedTime : 2.8 * 10 + 3.6 * (updatedTime - 10);
            setCars([
              { id: 1, position: redPosition, lane: 0, color: "#2ecc71" },
              { id: 2, position: bluePosition, lane: 1, color: "#e74c3c" },
            ]);
          }
        }, 100);
      } else {
        setElapsedTime(RACE_DURATION);
        setCars([
          { id: 1, position: 3 * RACE_DURATION, lane: 0, color: "#2ecc71" },
          { id: 2, position: 2.8 * 10 + 3.6 * (RACE_DURATION - 10), lane: 1, color: "#e74c3c" },
        ]);
        setRaceFinished(true);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (raceInterval.current) clearInterval(raceInterval.current);
    };
  }, [raceStarted, raceFinished, startTime, RACE_DURATION]);

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-5">
      <div className="w-full max-w-4xl mx-auto relative">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-2xl font-bold">
            {raceFinished ? (
              <span className="flex items-center gap-2">
                Winner: <span style={{ color: "#e74c3c" }}>Red Car</span> 🏆
              </span>
            ) : (
              `Race Time: ${formatTime(elapsedTime)}`
            )}
          </div>
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
