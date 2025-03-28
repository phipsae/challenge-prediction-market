"use client";

import React from "react";

interface CarProps {
  position: number;
  lane: number;
  color: string;
  isWinner?: boolean;
}

const Car: React.FC<CarProps> = ({ position, lane, color, isWinner }) => {
  return (
    <div
      className="absolute transition-all duration-1000 ease-in-out"
      style={{
        left: isWinner ? "50%" : `${position}%`,
        top: isWinner ? "50%" : `${lane * 100 + 50}px`,
        transform: isWinner ? "translate(-50%, -50%)" : "translateY(-50%)",
        zIndex: 10,
      }}
    >
      {isWinner && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm">Winner!</div>
        </div>
      )}
      <div
        className="w-20 h-10 relative"
        style={{
          backgroundColor: color,
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Car body */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold"></div>

        {/* Car headlights */}
        <div className="absolute top-3 left-0 w-1 h-2 bg-yellow-300 rounded-r-sm"></div>
        <div className="absolute bottom-3 left-0 w-1 h-2 bg-yellow-300 rounded-r-sm"></div>

        {/* Car taillights */}
        <div className="absolute top-3 right-0 w-1 h-2 bg-red-500 rounded-l-sm"></div>
        <div className="absolute bottom-3 right-0 w-1 h-2 bg-red-500 rounded-l-sm"></div>

        {/* Wheels */}
        <div className="absolute -bottom-2 left-3 w-4 h-4 bg-black rounded-full border-2 border-gray-400"></div>
        <div className="absolute -bottom-2 right-3 w-4 h-4 bg-black rounded-full border-2 border-gray-400"></div>
        <div className="absolute -top-2 left-3 w-4 h-4 bg-black rounded-full border-2 border-gray-400"></div>
        <div className="absolute -top-2 right-3 w-4 h-4 bg-black rounded-full border-2 border-gray-400"></div>

        {/* Speed effect */}
        <div
          className="absolute left-[-15px] top-0 bottom-0 w-[15px] opacity-30"
          style={{
            background: `linear-gradient(to left, ${color}, transparent)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Car;
