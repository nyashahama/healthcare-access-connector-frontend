import React, { useState } from "react";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { useSymptomChecker } from "hooks/useSymptomChecker";

// Component imports
import ProgressBar from "./components/ProgressBar";
import NavigationButtons from "./components/NavigationButtons";
import QuestionCard from "./components/QuestionCard";
import ResultCard from "./components/ResultCard";
import DisclaimerBanner from "./components/DisclaimerBanner";
import {
  EmergencyModal,
  SaveResultModal,
  ShareModal,
  SelfCareModal,
} from "./components/SymptomModals";

// Data + payload builder
import {
  getVisibleQuestions,
  buildApiPayload,
  resultConfig,
} from "./components/symptomData";

const SymptomChecker = () => {
  const { user } = useAuth();
  const {
    submitSession,
    loading: submitting,
    error: submitError,
  } = useSymptomChecker();
  const { showToast } = useToast();

  // step is an index into the visible questions array
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState({});

  // session holds the raw API response on success
  const [session, setSession] = useState(null);

  // Modal states
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [saveResultModalOpen, setSaveResultModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selfCareModalOpen, setSelfCareModalOpen] = useState(false);

  // Derive visible questions on every render so conditional questions
  // appear/disappear correctly based on current responses.
  const visibleQuestions = getVisibleQuestions(responses);
  const currentQuestion = visibleQuestions[stepIndex];
  const isResultStep = session !== null;
  const isLastQuestion = stepIndex === visibleQuestions.length - 1;

  // ─── Response handler ────────────────────────────────────────────────────────

  const handleResponse = (questionId, value, isMultiple = false) => {
    if (isMultiple) {
      setResponses((prev) => ({
        ...prev,
        [questionId]: prev[questionId]?.includes(value)
          ? prev[questionId].filter((v) => v !== value)
          : [...(prev[questionId] || []), value],
      }));
      // Multi-select does NOT auto-advance — user clicks Next/Skip
    } else {
      const updated = { ...responses, [questionId]: value };
      setResponses(updated);

      // For single-select non-last questions auto-advance after a brief delay
      // so the user can see their selection register before moving on.
      if (!isLastQuestion) {
        setTimeout(() => setStepIndex((i) => i + 1), 280);
      }
      // If it IS the last question auto-submit
      else {
        setTimeout(() => handleSubmit(updated), 280);
      }
    }
  };

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit(responses);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  // ─── Submit to API ───────────────────────────────────────────────────────────

  const handleSubmit = async (finalResponses) => {
    if (!user?.id) {
      showToast(
        "You must be logged in to submit a symptom assessment",
        "error"
      );
      return;
    }

    const payload = buildApiPayload(finalResponses);

    // Quick guard — chief_complaint must be present
    if (!payload.chief_complaint?.trim()) {
      showToast(
        "Please describe your main concern before submitting",
        "warning"
      );
      return;
    }

    const result = await submitSession(payload);

    if (result.success) {
      const triageLevel = result.data.triage_level;

      if (triageLevel === "emergency") {
        showToast("⚠️ Emergency — please seek immediate care!", "error");
      } else if (triageLevel === "high") {
        showToast(
          "Urgent symptoms detected — please see a doctor soon",
          "warning"
        );
      } else if (triageLevel === "medium") {
        showToast("Moderate concern — a consultation is recommended", "info");
      } else {
        showToast("Assessment complete", "success");
      }

      setSession(result.data);
    } else {
      showToast(
        result.error || "Failed to submit assessment. Please try again.",
        "error"
      );
    }
  };

  // ─── Restart ────────────────────────────────────────────────────────────────

  const handleRestart = () => {
    setStepIndex(0);
    setResponses({});
    setSession(null);
    showToast("Assessment reset", "info");
  };

  // ─── Actions from result card ────────────────────────────────────────────────

  const handleAction = (actionType) => {
    switch (actionType) {
      case "emergency":
        setEmergencyModalOpen(true);
        break;
      case "self-care":
        setSelfCareModalOpen(true);
        break;
      case "book":
        showToast("Redirecting to appointment booking...", "info");
        setTimeout(() => {
          window.location.href = "/patient/find-clinic";
        }, 1000);
        break;
      case "chat":
        showToast("Connecting to telemedicine...", "info");
        setTimeout(() => {
          window.location.href = "/patient/telemedicine";
        }, 1000);
        break;
      case "clinic":
        showToast("Finding nearby clinics...", "info");
        setTimeout(() => {
          window.location.href = "/patient/find-clinic";
        }, 1000);
        break;
      default:
        break;
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  // Derive result config from the API response's recommended_action
  const currentResultConfig = session
    ? resultConfig[session.recommended_action] ?? resultConfig["visit_clinic"]
    : null;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Symptom Checker
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Answer a few questions to get an AI-powered health assessment
        </p>
      </div>

      {/* Progress bar — hidden on result step */}
      {!isResultStep && (
        <ProgressBar
          currentStep={stepIndex + 1}
          totalSteps={visibleQuestions.length}
        />
      )}

      {/* Back navigation */}
      {!isResultStep && (
        <NavigationButtons currentStep={stepIndex + 1} onBack={handleBack} />
      )}

      {/* Question */}
      {!isResultStep && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          responses={responses}
          onResponse={handleResponse}
          onNext={handleNext}
          isLastQuestion={isLastQuestion}
        />
      )}

      {/* Submitting state */}
      {submitting && (
        <div className="mt-6 flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="border-t-transparent h-8 w-8 animate-spin rounded-full border-4 border-brand-500" />
          <p className="text-sm">Analysing your symptoms with AI...</p>
        </div>
      )}

      {/* API error */}
      {submitError && !submitting && !isResultStep && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {submitError}
        </div>
      )}

      {/* Result */}
      {isResultStep && session && currentResultConfig && (
        <ResultCard
          session={session}
          config={currentResultConfig}
          onSaveResult={() => setSaveResultModalOpen(true)}
          onShareResult={() => setShareModalOpen(true)}
          onAction={handleAction}
          onRestart={handleRestart}
        />
      )}

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Modals */}
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
      <SaveResultModal
        isOpen={saveResultModalOpen}
        onClose={() => setSaveResultModalOpen(false)}
        onConfirm={() => {
          setSaveResultModalOpen(false);
          showToast("Assessment saved to your health records", "success");
        }}
      />
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={(method) => {
          setShareModalOpen(false);
          showToast(`Assessment shared via ${method}`, "success");
        }}
      />
      <SelfCareModal
        isOpen={selfCareModalOpen}
        onClose={() => setSelfCareModalOpen(false)}
      />
    </div>
  );
};

export default SymptomChecker;
