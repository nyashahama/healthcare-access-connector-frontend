import React from "react";
import Card from "components/card";
import { triageBadge } from "./symptomData";

/**
 * ResultCard renders the actual API response from the symptom checker backend.
 *
 * Props:
 *  session  – the SymptomSessionResponse object from the API
 *  config   – the matching resultConfig entry (icon, actions, color)
 *  onSaveResult, onShareResult, onAction, onRestart – handlers
 */
const ResultCard = ({
  session,
  config,
  onSaveResult,
  onShareResult,
  onAction,
  onRestart,
}) => {
  const triage = triageBadge[session.triage_level] ?? {
    label: session.triage_level,
    color: "bg-gray-100 text-gray-700",
  };

  const colorMap = {
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  const borderMap = {
    green:
      "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
    blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    yellow:
      "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
    red: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
  };

  return (
    <Card extra="p-6">
      <div className="flex flex-col items-center text-center">
        {/* Icon + Title */}
        <div className="mb-3">{config.icon}</div>
        <h4
          className={`text-2xl font-bold ${
            colorMap[config.color] || "text-navy-700"
          }`}
        >
          {config.label}
        </h4>

        {/* Triage badge */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Triage Level:
          </span>
          <span
            className={`rounded-full px-3 py-0.5 text-xs font-semibold ${triage.color}`}
          >
            {triage.label}
          </span>
        </div>

        {/* AI Summary */}
        {session.ai_summary && (
          <div
            className={`mt-5 w-full rounded-xl border p-4 text-left ${
              borderMap[config.color]
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              AI Clinical Summary
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {session.ai_summary}
            </p>
          </div>
        )}

        {/* Symptom summary */}
        <div className="mt-5 w-full text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Symptoms Reported
          </p>
          <div className="flex flex-wrap gap-2">
            {session.symptoms_reported?.map((s) => (
              <span
                key={s}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-navy-700 dark:text-gray-300"
              >
                {s.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {session.body_systems_affected?.length > 0 && (
            <>
              <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Body Systems Affected
              </p>
              <div className="flex flex-wrap gap-2">
                {session.body_systems_affected.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}

          {session.severity_score != null && (
            <div className="mt-4 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Severity Score:
              </p>
              <span className="text-sm font-bold text-navy-700 dark:text-white">
                {session.severity_score} / 10
              </span>
            </div>
          )}
        </div>

        {/* Save / Share */}
        <div className="mt-6 flex w-full flex-wrap justify-center gap-3">
          <button
            onClick={onSaveResult}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700 dark:text-gray-300"
          >
            Save Result
          </button>
          <button
            onClick={onShareResult}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700 dark:text-gray-300"
          >
            Share
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          {config.actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => onAction(action.type)}
              className={`rounded-xl px-4 py-3 font-medium transition-colors ${action.color}`}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="linear mt-6 rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700 dark:text-gray-300"
        >
          Start Over
        </button>

        {/* Session meta */}
        <p className="mt-4 text-xs text-gray-400">
          Session ID: {session.id} &middot;{" "}
          {new Date(session.created_at).toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default ResultCard;
