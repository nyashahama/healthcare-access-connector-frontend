import React from "react";

const ProviderMessageBubble = ({ message }) => {
  if (message.sender === "system") {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-600 dark:bg-navy-700 dark:text-gray-300">
          {message.text}
        </div>
      </div>
    );
  }

  // From provider's perspective: "provider" = self (right), "patient" = them (left)
  const isProvider = message.sender === "provider";

  return (
    <div className={`flex ${isProvider ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          isProvider
            ? "bg-brand-500 text-white"
            : "bg-gray-100 text-gray-800 dark:bg-navy-700 dark:text-gray-300"
        }`}
      >
        {!isProvider && (
          <div className="mb-1 text-xs font-medium opacity-70">
            {message.patient}
          </div>
        )}
        <p>{message.text}</p>
        <div
          className={`mt-1 text-xs ${
            isProvider ? "text-white/70" : "text-gray-500"
          }`}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
};

export default ProviderMessageBubble;
