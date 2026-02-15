import React, { useState } from "react";
import { useToast } from "hooks/useToast";

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

// Data imports
import {
  questions,
  results,
  calculateSeverity,
} from "./components/symptomData";

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const { showToast } = useToast();

  // Modal states
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [saveResultModalOpen, setSaveResultModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selfCareModalOpen, setSelfCareModalOpen] = useState(false);

  // Handler functions
  const handleResponse = (questionId, value, isMultiple = false) => {
    if (isMultiple) {
      setResponses((prev) => ({
        ...prev,
        [questionId]: prev[questionId]?.includes(value)
          ? prev[questionId].filter((v) => v !== value)
          : [...(prev[questionId] || []), value],
      }));
    } else {
      setResponses((prev) => ({
        ...prev,
        [questionId]: value,
      }));
      if (step < questions.length) {
        setTimeout(() => setStep(step + 1), 300);
      } else {
        handleCalculateResult();
      }
    }
  };

  const handleCalculateResult = () => {
    const severity = calculateSeverity(responses);

    if (severity === "high") {
      showToast("⚠️ Urgent symptoms detected!", "warning");
    } else if (severity === "medium") {
      showToast("Moderate symptoms detected", "info");
    } else {
      showToast("Mild symptoms detected", "success");
    }

    setResult(results[severity]);
    setStep(questions.length + 1);
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      handleCalculateResult();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setResponses({});
    setResult(null);
    showToast("Assessment reset", "info");
  };

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

  const handleSaveResult = () => {
    setSaveResultModalOpen(true);
  };

  const confirmSaveResult = () => {
    setSaveResultModalOpen(false);
    showToast("Assessment saved to your health records", "success");
  };

  const handleShareResult = () => {
    setShareModalOpen(true);
  };

  const confirmShareResult = (method) => {
    setShareModalOpen(false);
    showToast(`Assessment shared via ${method}`, "success");
  };

  const currentQuestion = questions[step - 1];
  const isResultStep = step > questions.length;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Symptom Checker
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Answer a few questions to get personalized health guidance
        </p>
      </div>

      {/* Progress Bar */}
      {!isResultStep && (
        <ProgressBar currentStep={step} totalSteps={questions.length} />
      )}

      {/* Navigation */}
      {!isResultStep && (
        <NavigationButtons currentStep={step} onBack={handleBack} />
      )}

      {/* Question Card */}
      {!isResultStep && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          responses={responses}
          onResponse={handleResponse}
          onNext={handleNext}
          isLastQuestion={step === questions.length}
        />
      )}

      {/* Result Card */}
      {isResultStep && result && (
        <ResultCard
          result={result}
          onSaveResult={handleSaveResult}
          onShareResult={handleShareResult}
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
        onConfirm={confirmSaveResult}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={confirmShareResult}
      />

      <SelfCareModal
        isOpen={selfCareModalOpen}
        onClose={() => setSelfCareModalOpen(false)}
      />
    </div>
  );
};

export default SymptomChecker;
