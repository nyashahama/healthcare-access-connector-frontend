import React, { useState, useEffect, useCallback } from "react";
import Card from "components/card";
import {
  MdEdit,
  MdLock,
  MdAdd,
  MdSave,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

/**
 * ConsultationNotes — shows the live SOAP note for a consultation.
 *
 * For providers: full SOAP editor with auto-save and finalise.
 * For patients (or when no consultationId): shows a read-only pre-consultation checklist.
 */
const ConsultationNotes = ({
  consultationId,
  note,
  onCreateNote,
  onUpdateNote,
  onFinaliseNote,
  isProvider = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [localNote, setLocalNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  // Sync local state when note arrives
  useEffect(() => {
    if (note) {
      setLocalNote({
        subjective: note.subjective || "",
        objective: note.objective || "",
        assessment: note.assessment || "",
        plan: note.plan || "",
      });
    }
  }, [note]);

  const handleCreate = async () => {
    if (!consultationId || !onCreateNote) return;
    setCreating(true);
    await onCreateNote(consultationId);
    setCreating(false);
    setEditing(true);
    setExpanded(true);
  };

  const handleSave = useCallback(async () => {
    if (!consultationId || !note?.id || !onUpdateNote) return;
    setSaving(true);
    await onUpdateNote(consultationId, note.id, localNote);
    setSaving(false);
    setEditing(false);
  }, [consultationId, note, onUpdateNote, localNote]);

  const handleFinalise = async () => {
    if (!consultationId || !note?.id || !onFinaliseNote) return;
    setSaving(true);
    await onFinaliseNote(consultationId, note.id);
    setSaving(false);
    setEditing(false);
  };

  // ── No consultation yet — show patient checklist ──────────────────────
  if (!consultationId) {
    return (
      <Card extra="p-6">
        <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
          Consultation Notes
        </h4>
        <div className="space-y-3">
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <h5 className="font-medium text-blue-800 dark:text-blue-300">
              Before Your Chat
            </h5>
            <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-400">
              <li>• Have your symptoms ready to describe</li>
              <li>• List any current medications</li>
              <li>• Prepare any questions you have</li>
            </ul>
          </div>
          <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
            <h5 className="font-medium text-green-800 dark:text-green-300">
              What You Can Discuss
            </h5>
            <ul className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-400">
              <li>• Symptom assessment</li>
              <li>• Medication advice</li>
              <li>• Follow-up care</li>
              <li>• General health questions</li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  // ── No note exists yet ─────────────────────────────────────────────────
  if (!note) {
    return (
      <Card extra="p-6">
        <h4 className="mb-3 text-lg font-bold text-navy-700 dark:text-white">
          Clinical Note
        </h4>
        {isProvider ? (
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-300 p-4 text-brand-500 transition-colors hover:border-brand-500 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900/20"
          >
            <MdAdd className="h-5 w-5" />
            <span className="text-sm font-medium">
              {creating ? "Creating…" : "Open SOAP Note"}
            </span>
          </button>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The provider will open a clinical note for this consultation.
          </p>
        )}
      </Card>
    );
  }

  // ── Note exists ────────────────────────────────────────────────────────
  const isFinalised = note.is_finalised;

  return (
    <Card extra="p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Clinical Note
          </h4>
          {isFinalised ? (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <MdLock className="h-3 w-3" /> Finalised
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              Draft
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isProvider && !isFinalised && !editing && (
            <button
              onClick={() => {
                setEditing(true);
                setExpanded(true);
              }}
              className="rounded p-1 text-gray-400 transition-colors hover:text-brand-500"
              title="Edit note"
            >
              <MdEdit className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600"
          >
            {expanded ? (
              <MdExpandLess className="h-5 w-5" />
            ) : (
              <MdExpandMore className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3">
          {["subjective", "objective", "assessment", "plan"].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {editing && isProvider ? (
                <textarea
                  value={localNote[field]}
                  onChange={(e) =>
                    setLocalNote((prev) => ({
                      ...prev,
                      [field]: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none dark:border-gray-600 dark:bg-navy-700 dark:text-white"
                  placeholder={`Enter ${field}…`}
                />
              ) : (
                <p className="min-h-[36px] rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-navy-700 dark:text-gray-300">
                  {note[field] || (
                    <span className="italic text-gray-400">Not recorded</span>
                  )}
                </p>
              )}
            </div>
          ))}

          {note.diagnosis_codes?.length > 0 && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Diagnosis Codes
              </label>
              <div className="flex flex-wrap gap-1">
                {note.diagnosis_codes.map((code) => (
                  <span
                    key={code}
                    className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Provider actions */}
          {isProvider && !isFinalised && (
            <div className="flex gap-2 pt-1">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
                  >
                    <MdSave className="h-4 w-4" />
                    {saving ? "Saving…" : "Save Draft"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFinalise}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60"
                >
                  <MdLock className="h-4 w-4" />
                  {saving ? "Finalising…" : "Finalise Note"}
                </button>
              )}
            </div>
          )}

          {note.finalised_at && (
            <p className="text-right text-xs text-gray-400">
              Finalised {new Date(note.finalised_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default ConsultationNotes;
