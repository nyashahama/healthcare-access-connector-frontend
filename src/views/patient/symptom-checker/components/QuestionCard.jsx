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
  const isTextarea = question.type === "textarea";

  const currentValue = responses[question.id];

  const hasResponse = isMultiple
    ? currentValue?.length > 0
    : isTextarea
    ? currentValue?.trim()?.length >= (question.minLength || 1)
    : currentValue !== undefined && currentValue !== "";

  // For optional questions, allow skipping
  const canProceed = hasResponse || question.optional;

  return (
    <Card extra="p-6">
      <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
        {question.question}
      </h3>

      {question.optional && (
        <p className="mb-4 text-sm text-gray-400 dark:text-gray-500">
          Optional — you can skip this question
        </p>
      )}

      {/* ── Textarea input ── */}
      {isTextarea && (
        <div className="mt-4">
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-navy-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-navy-700 dark:text-white dark:placeholder-gray-500"
            rows={4}
            placeholder={question.placeholder || "Type your answer here..."}
            value={currentValue || ""}
            onChange={(e) => onResponse(question.id, e.target.value)}
          />
          {question.minLength && (
            <p className="mt-1 text-xs text-gray-400">
              {currentValue?.length || 0} characters
              {!hasResponse && currentValue?.length > 0
                ? ` — minimum ${question.minLength}`
                : ""}
            </p>
          )}
        </div>
      )}

      {/* ── Single / Multiple choice ── */}
      {!isTextarea && (
        <div className="mt-4 space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = isMultiple
              ? currentValue?.includes(option.value)
              : currentValue === option.value;

            return (
              <button
                key={idx}
                onClick={() =>
                  onResponse(question.id, option.value, isMultiple)
                }
                className={`flex w-full items-center rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                    : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-brand-700"
                }`}
              >
                {option.icon && (
                  <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30">
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
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                          option.severity === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : option.severity === "medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {option.severity}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>
                  )}
                </div>

                {/* Checkbox indicator for multi-select */}
                {isMultiple && (
                  <div
                    className={`ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-brand-500 bg-brand-500"
                        : "border-gray-300 dark:border-gray-600"
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
      )}

      {/* ── Next / Submit button ── */}
      {/* For single-select non-textarea, auto-advance is handled by the parent.
          Show the button explicitly for textarea and multiple. */}
      {(isMultiple || isTextarea || question.optional) && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`linear flex items-center rounded-lg px-6 py-3 font-medium transition duration-200 ${
              canProceed
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
            }`}
          >
            {isLastQuestion
              ? "Get Results"
              : question.optional && !hasResponse
              ? "Skip"
              : "Next"}
            <MdArrowForward className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}
    </Card>
  );
};

export default QuestionCard;
