import React from "react";
import { MdArrowBack } from "react-icons/md";

const NavigationButtons = ({ currentStep, onBack, showBack = true }) => {
  if (!showBack || currentStep <= 1) {
    return null;
  }

  return (
    <div className="mb-4">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-brand-500 dark:text-gray-400"
      >
        <MdArrowBack className="mr-2 h-5 w-5" />
        Back to Previous Question
      </button>
    </div>
  );
};

export default NavigationButtons;
