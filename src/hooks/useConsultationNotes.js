import consultationNotesService from "api/services/consultationNotesService";
import { useCallback, useState } from "react";

/**
 * Custom hook for consultation notes operations.
 *
 * authored_by_staff_id is never sent — derived from JWT.
 */
export const useConsultationNotes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null); // current note for a consultation
  const [providerNoteHistory, setProviderNoteHistory] = useState([]);
  const [patientNoteHistory, setPatientNoteHistory] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  });

  // ─── CRUD ───────────────────────────────────────────────────────────────

  const createNote = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.createNote(
        consultationId
      );
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to create note";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchNoteByConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.getNoteByConsultationID(
        consultationId
      );
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      // 404 is possible if no note exists yet — treat as null, not error
      if (err.response?.status === 404) {
        setNote(null);
        setLoading(false);
        return { success: true, data: null };
      }
      const msg = err.response?.data?.error || "Failed to fetch note";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const updateNote = useCallback(async (consultationId, noteId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.updateNote(
        consultationId,
        noteId,
        data
      );
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update note";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const finaliseNote = useCallback(async (consultationId, noteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.finaliseNote(
        consultationId,
        noteId
      );
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to finalise note";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const finaliseNoteByConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await consultationNotesService.finaliseNoteByConsultation(
          consultationId
        );
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to finalise note by consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchNoteByID = useCallback(async (noteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.getNoteByID(noteId);
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch note";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchNoteWithProviderInfo = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.getNoteWithProviderInfo(
        consultationId
      );
      setNote(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch note with provider info";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── History ─────────────────────────────────────────────────────────────

  const fetchProviderNoteHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.getProviderNoteHistory(
        params
      );
      setProviderNoteHistory(response.notes || []);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      });
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch provider note history";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchPatientNoteHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationNotesService.getPatientNoteHistory();
      setPatientNoteHistory(response.notes || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch patient note history";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Clear helpers ──────────────────────────────────────────────────────

  const clearNote = useCallback(() => {
    setNote(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setProviderNoteHistory([]);
    setPatientNoteHistory([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Methods
    createNote,
    fetchNoteByConsultation,
    updateNote,
    finaliseNote,
    finaliseNoteByConsultation,
    fetchNoteByID,
    fetchNoteWithProviderInfo,
    fetchProviderNoteHistory,
    fetchPatientNoteHistory,
    clearNote,
    clearHistory,
    clearError,

    // State
    loading,
    error,
    note,
    providerNoteHistory,
    patientNoteHistory,
    pagination,

    // Derived
    hasNote: !!note,
    hasProviderNotes: providerNoteHistory.length > 0,
    hasPatientNotes: patientNoteHistory.length > 0,
  };
};
