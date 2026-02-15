import { useState, useEffect } from "react";
import { useToast } from "hooks/useToast";
import { usePatient } from "hooks/usePatient";
import { useAppointment } from "hooks/useAppointment";
import { useAuth } from "context/AuthContext";

// Component imports
import WelcomeHeader from "./components/WelcomeHeader";
import QuickStatsWidgets from "./components/QuickStatsWidgets";
import LoadingState from "./components/LoadingState";
import SymptomCheckerCard from "./components/SymptomCheckerCard";
import EmergencyContactsCard from "./components/EmergencyContactsCard";
import HealthProfileCard from "./components/HealthProfileCard";
import {
  AppointmentReminderModal,
  HealthScoreModal,
  EmergencyContactsModal,
  NutritionTipModal,
} from "./components/DashboardModals";

// Existing components (keep these imports)
import UpcomingAppointments from "../components/UpcomingAppointments";
import QuickActions from "../components/QuickActions";
import ClinicSuggestions from "../components/ClinicSuggestions";
import HealthTipsCarousel from "../components/HealthTipsCarousel";

// Utility imports
import {
  getPatientName,
  formatDate,
  getUpcomingAppointments,
  getNextAppointment,
  getUpcomingForModal,
} from "./components/dashboardUtils";

const PatientDashboard = () => {
  const [modalState, setModalState] = useState({
    appointmentReminder: false,
    healthScoreDetails: false,
    emergencyContacts: false,
    nutritionTipDetails: false,
  });
  const [selectedTip, setSelectedTip] = useState(null);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [nextAppointment, setNextAppointment] = useState(null);
  const { showToast } = useToast();
  const { patient, getPatientProfileByUserId } = usePatient();
  const {
    appointments,
    getAppointmentsByPatient,
    loading: appointmentsLoading,
  } = useAppointment();
  const { getCurrentUser } = useAuth();

  const user = getCurrentUser();
  const patientId = patient?.user_id;

  // Load patient data on component mount
  useEffect(() => {
    if (user?.id) {
      loadPatientData();
    }
  }, [user?.id]);

  // Load appointments when patient is available
  useEffect(() => {
    if (patientId) {
      loadAppointments();
    }
  }, [patientId]);

  // Calculate upcoming appointments and next appointment
  useEffect(() => {
    if (appointments.length > 0) {
      const upcoming = getUpcomingAppointments(appointments);
      setUpcomingCount(upcoming.length);
      setNextAppointment(getNextAppointment(upcoming));
    } else {
      setUpcomingCount(0);
      setNextAppointment(null);
    }
  }, [appointments]);

  const loadPatientData = async () => {
    if (user?.id) {
      await getPatientProfileByUserId(user.id);
    }
  };

  const loadAppointments = async () => {
    if (patientId) {
      await getAppointmentsByPatient(patientId);
    }
  };

  // Modal handlers
  const handleAppointmentClick = () => {
    if (upcomingCount > 0) {
      setModalState((prev) => ({ ...prev, appointmentReminder: true }));
    } else {
      showToast("No upcoming appointments", "info");
      window.location.href = "/patient/find-clinic";
    }
  };

  const handleHealthScoreClick = () => {
    setModalState((prev) => ({ ...prev, healthScoreDetails: true }));
  };

  const handleEmergencyClick = () => {
    setModalState((prev) => ({ ...prev, emergencyContacts: true }));
  };

  const handleNutritionClick = () => {
    setModalState((prev) => ({ ...prev, nutritionTipDetails: true }));
    setSelectedTip({
      title: "Daily Nutrition Guide",
      content:
        "Children aged 2-5 need 5 servings of fruits and vegetables daily. Include protein sources like beans, eggs, or chicken in each meal.",
    });
  };

  const handleMessagesClick = () => {
    showToast("Opening messages...", "info");
    window.location.href = "/patient/telemedicine";
  };

  const handleSymptomCheckerClick = () => {
    showToast("Redirecting to Symptom Checker...", "info");
    setTimeout(() => {
      window.location.href = "/patient/symptom-checker";
    }, 1000);
  };

  const handleViewProfile = () => {
    window.location.href = "/patient/health-profile";
    showToast("Opening health profile...", "info");
  };

  const patientName = getPatientName(patient, user);
  const modalAppointments = getUpcomingForModal(appointments);

  return (
    <div>
      {/* Modals */}
      <AppointmentReminderModal
        isOpen={modalState.appointmentReminder}
        onClose={() =>
          setModalState((prev) => ({ ...prev, appointmentReminder: false }))
        }
        upcomingCount={upcomingCount}
        appointments={modalAppointments}
      />

      <HealthScoreModal
        isOpen={modalState.healthScoreDetails}
        onClose={() =>
          setModalState((prev) => ({ ...prev, healthScoreDetails: false }))
        }
      />

      <EmergencyContactsModal
        isOpen={modalState.emergencyContacts}
        onClose={() =>
          setModalState((prev) => ({ ...prev, emergencyContacts: false }))
        }
      />

      <NutritionTipModal
        isOpen={modalState.nutritionTipDetails}
        onClose={() =>
          setModalState((prev) => ({ ...prev, nutritionTipDetails: false }))
        }
        tip={selectedTip}
        showToast={showToast}
      />

      {/* Welcome Header */}
      <WelcomeHeader
        patientName={patientName}
        nextAppointment={nextAppointment}
        formatDate={formatDate}
      />

      {/* Quick Stats */}
      <QuickStatsWidgets
        upcomingCount={upcomingCount}
        healthStatus={patient?.health_status}
        isLoading={appointmentsLoading}
        onAppointmentClick={handleAppointmentClick}
        onHealthScoreClick={handleHealthScoreClick}
        onMessagesClick={handleMessagesClick}
        onNutritionClick={handleNutritionClick}
      />

      {/* Loading State for Appointments */}
      {appointmentsLoading && <LoadingState />}

      {/* Quick Actions */}
      {!appointmentsLoading && (
        <div className="mt-6">
          <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
            Quick Actions
          </h4>
          <QuickActions />
        </div>
      )}

      {/* Health Tips Carousel */}
      <div className="mt-6">
        <HealthTipsCarousel />
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-5">
          <UpcomingAppointments />
          <ClinicSuggestions />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <SymptomCheckerCard onClick={handleSymptomCheckerClick} />
          <EmergencyContactsCard onClick={handleEmergencyClick} />
          <HealthProfileCard
            patient={patient}
            onViewProfile={handleViewProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
