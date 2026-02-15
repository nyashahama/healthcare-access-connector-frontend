import React from "react";
import { MdCheckCircle, MdArrowForward } from "react-icons/md";
import Card from "components/card";

const QuestionCard = ({
  question,
  responses,
  onResponse,
  onNext,
  isLastQuestion,
}) => {
  const isMultiple = question.type === "multiple";
  const hasResponse = isMultiple
    ? responses[question.id]?.length > 0
    : responses[question.id];

  return (
    <Card extra="p-6">
      <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
        {question.question}
      </h3>

      <div className="space-y-4">
        {question.options.map((option, idx) => {
          const isSelected = isMultiple
            ? responses[question.id]?.includes(option.value)
            : responses[question.id] === option.value;

          return (
            <button
              key={idx}
              onClick={() => onResponse(question.id, option.value, isMultiple)}
              className={`flex w-full items-center rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                  : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-700"
              }`}
            >
              {option.icon && (
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30">
                  {option.icon}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-navy-700 dark:text-white">
                    {option.label}
                  </span>
                  {option.severity && (
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                        option.severity === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : option.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      }`}
                    >
                      {option.severity}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                )}
              </div>
              {isMultiple && (
                <div
                  className={`ml-4 flex h-6 w-6 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-brand-500 bg-brand-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <MdCheckCircle className="h-4 w-4 text-white" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Next/Submit Button */}
      {(isMultiple || hasResponse) && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            disabled={isMultiple && !hasResponse}
            className={`linear flex items-center rounded-lg px-6 py-3 font-medium transition duration-200 ${
              hasResponse
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "bg-gray-100 text-gray-400 dark:bg-gray-700"
            }`}
          >
            {isLastQuestion ? "Get Results" : "Next"}
            <MdArrowForward className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
