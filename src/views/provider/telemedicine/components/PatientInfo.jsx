import React from "react";
import Card from "components/card";
import ConsultationNotes from "views/patient/telemedicine-chat/components/ConsultationNotes";

const TRIAGE_COLORS = {
  emergency: "text-red-600 dark:text-red-400",
  high: "text-orange-600 dark:text-orange-400",
  medium: "text-yellow-600 dark:text-yellow-500",
  low: "text-green-600 dark:text-green-400",
};

/**
 * PatientInfo — provider sidebar panel shown during an active consultation.
 *
 * Props
 *   patient         – mapped from ConsultationWithDetailsResponse:
 *                     { id, name, chiefComplaint, channel, triageLevel,
 *                       severityScore, aiSummary, symptomsReported,
 *                       preferredComm, priority }
 *   note            – current SOAP note (or null)
 *   consultationId  – UUID string
 *   onCreateNote    – (consultationId) => Promise
 *   onUpdateNote    – (consultationId, noteId, data) => Promise
 *   onFinaliseNote  – (consultationId, noteId) => Promise
 */
const PatientInfo = ({
  patient,
  note,
  consultationId,
  onCreateNote,
  onUpdateNote,
  onFinaliseNote,
}) => {
  if (!patient) return null;

  return (
    <div className="space-y-4">
      {/* ── Patient overview card ────────────────────────────────────────── */}
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          Patient Overview
        </h4>

        <div className="space-y-3">
          {/* Chief complaint */}
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <h5 className="font-medium text-blue-800 dark:text-blue-300">
              Chief Complaint
            </h5>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              {patient.chiefComplaint}
            </p>
          </div>

          {/* Key details */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
            <h5 className="mb-2 font-medium text-gray-800 dark:text-gray-300">
              Details
            </h5>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              {patient.triageLevel && (
                <li className="flex items-center justify-between">
                  <span className="font-medium">Triage:</span>
                  <span
                    className={`font-semibold capitalize ${
                      TRIAGE_COLORS[patient.triageLevel] || ""
                    }`}
                  >
                    {patient.triageLevel}
                  </span>
                </li>
              )}
              {patient.severityScore != null && (
                <li className="flex items-center justify-between">
                  <span className="font-medium">Severity:</span>
                  <span>{patient.severityScore}/10</span>
                </li>
              )}
              {patient.channel && (
                <li className="flex items-center justify-between">
                  <span className="font-medium">Channel:</span>
                  <span className="capitalize">{patient.channel}</span>
                </li>
              )}
              {patient.preferredComm && (
                <li className="flex items-center justify-between">
                  <span className="font-medium">Preferred comm:</span>
                  <span className="capitalize">{patient.preferredComm}</span>
                </li>
              )}
              <li>
                <span className="font-medium">Priority:</span>{" "}
                <span
                  className={
                    patient.priority === "urgent"
                      ? "font-bold text-red-600 dark:text-red-400"
                      : "capitalize"
                  }
                >
                  {patient.priority}
                </span>
              </li>
            </ul>
          </div>

          {/* Symptoms reported */}
          {patient.symptomsReported?.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
              <h5 className="mb-2 font-medium text-gray-800 dark:text-gray-300">
                Symptoms Reported
              </h5>
              <div className="flex flex-wrap gap-1">
                {patient.symptomsReported.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI summary */}
          {patient.aiSummary && (
            <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <h5 className="mb-1 font-medium text-purple-800 dark:text-purple-300">
                AI Summary
              </h5>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                {patient.aiSummary}
              </p>
            </div>
          )}

          {/* Clinical reminders */}
          <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <h5 className="font-medium text-yellow-800 dark:text-yellow-300">
              Reminders
            </h5>
            <ul className="mt-2 space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
              <li>• Check for known allergies before prescribing</li>
              <li>• Confirm medical aid authorisation if needed</li>
              <li>• Document all findings in clinical notes below</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* ── Inline SOAP note editor ──────────────────────────────────────── */}
      <ConsultationNotes
        consultationId={consultationId}
        note={note}
        onCreateNote={onCreateNote}
        onUpdateNote={onUpdateNote}
        onFinaliseNote={onFinaliseNote}
        isProvider={true}
      />
    </div>
  );
};

export default PatientInfo;
