import React from "react";

const SMSCreditsCard = ({ onAddCredits }) => {
  const remaining = 12458;
  const total = 20000;
  const percentage = (remaining / total) * 100;

  return (
    <div className="to-emerald-400 rounded-[20px] bg-gradient-to-r from-green-500 p-6 text-white transition-all duration-300 hover:scale-[1.02]">
      <h5 className="mb-2 text-lg font-bold">SMS Credits</h5>
      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span>Remaining</span>
          <span className="font-bold">{remaining.toLocaleString()}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-green-200">
          <div
            className="h-2 rounded-full bg-white transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs opacity-80">Last purchase: 2 days ago</div>
      </div>
      <button
        onClick={onAddCredits}
        className="linear w-full rounded-xl bg-white py-2 font-medium text-green-600 transition-all duration-200 hover:scale-105 hover:bg-gray-100"
      >
        Add Credits
      </button>
    </div>
  );
};

export default SMSCreditsCard;
