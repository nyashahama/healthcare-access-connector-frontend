import consultationNotesService from "api/services/consultationNotesService";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for consultation notes operations.
 *
 * authored_by_staff_id is never sent — derived from JWT.
 */
export const useConsultationNotes = () => {
  const queryClient = useQueryClient();
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

  // Active parameter states for useQuery keys
  const [activeConsultationId, setActiveConsultationId] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [activeProviderHistoryParams, setActiveProviderHistoryParams] =
    useState(null);

  // useQuery hooks with enabled: false for cache observation
  useQuery({
    queryKey: queryKeys.consultation.notes(activeConsultationId),
    queryFn: () =>
      consultationNotesService.getNoteByConsultationID(activeConsultationId),
    enabled: false,
  });

  useQuery({
    queryKey: ["consultationNotes", "detail", activeNoteId],
    queryFn: () => consultationNotesService.getNoteByID(activeNoteId),
    enabled: false,
  });

  useQuery({
    queryKey: [
      ...queryKeys.consultation.notes(activeConsultationId),
      "providerInfo",
    ],
    queryFn: () =>
      consultationNotesService.getNoteWithProviderInfo(activeConsultationId),
    enabled: false,
  });

  useQuery({
    queryKey: [
      "consultationNotes",
      "providerHistory",
      activeProviderHistoryParams,
    ],
    queryFn: () =>
      consultationNotesService.getProviderNoteHistory(
        activeProviderHistoryParams
      ),
    enabled: false,
  });

  useQuery({
    queryKey: ["consultationNotes", "patientHistory"],
    queryFn: () => consultationNotesService.getPatientNoteHistory(),
    enabled: false,
  });

  // Mutations
  const createNoteMutation = useMutation({
    mutationFn: (consultationId) =>
      consultationNotesService.createNote(consultationId),
    onSuccess: (data, consultationId) => {
      setNote(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(consultationId),
      });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ consultationId, noteId, data }) =>
      consultationNotesService.updateNote(consultationId, noteId, data),
    onSuccess: (data, variables) => {
      setNote(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(variables.consultationId),
      });
    },
  });

  const finaliseNoteMutation = useMutation({
    mutationFn: ({ consultationId, noteId }) =>
      consultationNotesService.finaliseNote(consultationId, noteId),
    onSuccess: (data, variables) => {
      setNote(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(variables.consultationId),
      });
    },
  });

  const finaliseNoteByConsultationMutation = useMutation({
    mutationFn: (consultationId) =>
      consultationNotesService.finaliseNoteByConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      setNote(data);
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(consultationId),
      });
    },
  });

  // ─── CRUD ───────────────────────────────────────────────────────────────

  const createNote = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createNoteMutation.mutateAsync(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to create note";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [createNoteMutation]
  );

  const fetchNoteByConsultation = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.consultation.notes(consultationId),
          queryFn: () =>
            consultationNotesService.getNoteByConsultationID(consultationId),
        });
        setNote(response);
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        // 404 is possible if no note exists yet — treat as null, not error
        if (err.response?.status === 404) {
          setNote(null);
          setActiveConsultationId(consultationId);
          setLoading(false);
          return { success: true, data: null };
        }
        const msg = err.response?.data?.error || "Failed to fetch note";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const updateNote = useCallback(
    async (consultationId, noteId, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateNoteMutation.mutateAsync({
          consultationId,
          noteId,
          data,
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to update note";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [updateNoteMutation]
  );

  const finaliseNote = useCallback(
    async (consultationId, noteId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await finaliseNoteMutation.mutateAsync({
          consultationId,
          noteId,
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to finalise note";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [finaliseNoteMutation]
  );

  const finaliseNoteByConsultation = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response =
          await finaliseNoteByConsultationMutation.mutateAsync(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Failed to finalise note by consultation";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [finaliseNoteByConsultationMutation]
  );

  const fetchNoteByID = useCallback(
    async (noteId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["consultationNotes", "detail", noteId],
          queryFn: () => consultationNotesService.getNoteByID(noteId),
        });
        setNote(response);
        setActiveNoteId(noteId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch note";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const fetchNoteWithProviderInfo = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.notes(consultationId),
            "providerInfo",
          ],
          queryFn: () =>
            consultationNotesService.getNoteWithProviderInfo(consultationId),
        });
        setNote(response);
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Failed to fetch note with provider info";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  // ─── History ─────────────────────────────────────────────────────────────

  const fetchProviderNoteHistory = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["consultationNotes", "providerHistory", params],
          queryFn: () =>
            consultationNotesService.getProviderNoteHistory(params),
        });
        setProviderNoteHistory(response.notes || []);
        setPagination({
          limit: response.limit,
          offset: response.offset,
          total: response.count,
        });
        setActiveProviderHistoryParams(params);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Failed to fetch provider note history";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const fetchPatientNoteHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["consultationNotes", "patientHistory"],
        queryFn: () => consultationNotesService.getPatientNoteHistory(),
      });
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
  }, [queryClient]);

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
