import React from "react";
import Card from "components/card";
import { FaUserInjured } from "react-icons/fa";
import { MdRefresh, MdCheckCircle, MdCancel } from "react-icons/md";

const TRIAGE_COLORS = {
  emergency: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const CHANNEL_ICON = { chat: "💬", video: "📹", phone: "📞" };

/**
 * PatientQueue
 *
 * Props
 *   patients        – array mapped from WaitingRoomEntryResponse:
 *                     { id, name, chiefComplaint, triageLevel, severityScore,
 *                       channel, fee, aiSummary, requestedAt,
 *                       priority ("urgent"|"normal"), waitTime, status }
 *   activePatient   – the patient currently being consulted (or null)
 *   onAcceptPatient – (patient) => void
 *   onDeclinePatient– (patient) => void
 *   loading         – boolean
 *   onRefresh       – () => void
 */
const PatientQueue = ({
  patients = [],
  activePatient,
  onAcceptPatient,
  onDeclinePatient,
  loading = false,
  onRefresh,
}) => {
  const waitingCount = patients.filter((p) => p.status === "waiting").length;

  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Patient Queue
          </h4>
          {waitingCount > 0 && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              {waitingCount} waiting
            </span>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="rounded p-1 text-gray-400 transition-colors hover:text-brand-500"
            title="Refresh queue"
          >
            <MdRefresh className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && patients.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center rounded-lg border border-gray-100 p-3 dark:border-gray-700"
            >
              <div className="mr-3 h-10 w-10 rounded-full bg-gray-200 dark:bg-navy-600" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-navy-600" />
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-navy-600" />
              </div>
            </div>
          ))}
        </div>
      ) : patients.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FaUserInjured className="mb-3 h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No patients waiting
          </p>
          <p className="mt-1 text-xs text-gray-400">
            New patients will appear here automatically
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => {
            const isActive = activePatient?.id === patient.id;

            return (
              <div
                key={patient.id}
                className={`rounded-lg border p-3 transition-all ${
                  isActive
                    ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Patient name + badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <h5 className="font-medium text-navy-700 dark:text-white">
                    {patient.name}
                  </h5>
                  {patient.triageLevel && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        TRIAGE_COLORS[patient.triageLevel] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {patient.triageLevel}
                    </span>
                  )}
                  {CHANNEL_ICON[patient.channel] && (
                    <span title={patient.channel} className="text-sm">
                      {CHANNEL_ICON[patient.channel]}
                    </span>
                  )}
                </div>

                {/* Chief complaint */}
                <p className="mt-0.5 truncate text-sm text-gray-600 dark:text-gray-400">
                  {patient.chiefComplaint}
                </p>

                {/* Meta row */}
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span>⏱ {patient.waitTime}</span>
                  {patient.severityScore != null && (
                    <span>Severity: {patient.severityScore}/10</span>
                  )}
                  {patient.fee != null && <span>R{patient.fee}</span>}
                </div>

                {/* AI summary */}
                {patient.aiSummary && (
                  <p className="mt-1.5 line-clamp-2 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                    🤖 {patient.aiSummary}
                  </p>
                )}

                {/* Actions — only shown when not the currently active consultation */}
                {!isActive ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onAcceptPatient(patient)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
                    >
                      <MdCheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                    {onDeclinePatient && (
                      <button
                        onClick={() => onDeclinePatient(patient)}
                        className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <MdCancel className="h-4 w-4" />
                        Decline
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Active consultation
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default PatientQueue;
