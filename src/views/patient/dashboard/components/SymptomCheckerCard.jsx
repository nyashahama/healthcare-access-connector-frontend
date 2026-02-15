import React from "react";
import { FaStethoscope } from "react-icons/fa";

const SymptomCheckerCard = ({ onClick }) => {
  return (
    <div className="rounded-[20px] bg-gradient-to-r from-blue-500 to-brand-400 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-xl font-bold">Symptom Checker</h5>
          <p className="mt-2 text-blue-100">
            Check symptoms and get instant health advice
          </p>
        </div>
        <FaStethoscope className="h-12 w-12 opacity-80" />
      </div>
      <button
        onClick={onClick}
        className="linear mt-4 w-full rounded-xl bg-white py-3 font-medium text-brand-500 transition duration-200 hover:bg-gray-100"
      >
        Start Symptom Check
      </button>
    </div>
  );
};

export default SymptomCheckerCard;
