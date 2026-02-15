import React from "react";
import Card from "components/card";

const ResultCard = ({
  result,
  onSaveResult,
  onShareResult,
  onAction,
  onRestart,
}) => {
  return (
    <Card extra="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{result.icon}</div>
        <h4
          className={`text-2xl font-bold ${
            result.color === "green"
              ? "text-green-600"
              : result.color === "yellow"
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {result.title}
        </h4>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Based on your symptoms, here's our assessment
        </p>

        {/* Recommendations */}
        <div className="mt-6 w-full">
          <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            Recommendations
          </h5>
          <div className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start rounded-lg bg-gray-50 p-4 dark:bg-navy-700"
              >
                <div
                  className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full ${
                    result.color === "green"
                      ? "bg-green-100 text-green-600"
                      : result.color === "yellow"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="flex-1 text-left text-gray-700 dark:text-gray-300">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Action Buttons */}
        <div className="mt-6 flex w-full flex-wrap justify-center gap-3">
          <button
            onClick={onSaveResult}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
          >
            Save Result
          </button>
          <button
            onClick={onShareResult}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
          >
            Share
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {result.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => onAction(action.type)}
              className={`rounded-xl px-4 py-3 font-medium transition-colors ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="linear mt-6 rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 transition duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700 dark:text-gray-300"
        >
          Start Over
        </button>
      </div>
    </Card>
  );
};

export default ResultCard;
