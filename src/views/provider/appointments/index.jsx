import React, { useState, useEffect } from "react";
import { useToast } from "hooks/useToast";
import { useAppointment } from "hooks/useAppointment";
import { useAuth } from "context/AuthContext";
import ErrorBoundaryWrapper from "components/error-boundaries/ErrorBoundaryWrapper";
import CriticalFeatureFallback from "components/error-boundaries/CriticalFeatureFallback";

// Component imports
import StatsCards from "./components/StatsCards";
import ControlsBar from "./components/ControlsBar";
import CalendarView from "./components/CalendarView";
import UpcomingList from "./components/UpcomingList";
import AppointmentTypesCard from "./components/AppointmentTypesCard";
import QuickActionsCard from "./components/QuickActionsCard";
import {
  NewAppointmentModal,
  RescheduleModal,
  CancelModal,
} from "./components/AppointmentModals";

// Existing component
import TodaySchedule from "../components/TodaySchedule";
import { useProvider } from "hooks/useProvider";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const {
    error,
    appointments,
    todayAppointments,
    bookAppointment,
    getAppointmentsByClinic,
    getTodayAppointments,
    getPendingAppointments,
    rescheduleAppointment,
    cancelAppointment,
    confirmAppointment,
  } = useAppointment();

  const { clinic, getClinics } = useProvider();

  const currentUser = getCurrentUser();

  // Modal states
  const [newAppointmentModalOpen, setNewAppointmentModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [clinicId, setClinicId] = useState(null);

  // Form states
  const [newAppointment, setNewAppointment] = useState({
    clinic_id: "",
    patient_id: "",
    patient_name: "",
    patient_phone: "",
    patient_email: "",
    appointment_date: "",
    appointment_time: "",
    reason_for_visit: "",
    notes: "",
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  const [cancelForm, setCancelForm] = useState({
    cancellation_reason: "",
  });

  // Calculate stats
  const appointmentStats = {
    today: todayAppointments?.length || 0,
    thisWeek: appointments?.length || 0,
    cancellations:
      appointments?.filter((apt) => apt.status === "cancelled")?.length || 0,
    noShows:
      appointments?.filter((apt) => apt.status === "no-show")?.length || 0,
  };

  // Calculate appointment types
  const appointmentTypes = React.useMemo(() => {
    const typeCount = {};
    appointments?.forEach((apt) => {
      const type = apt.reason_for_visit || "Other";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-red-500",
    ];
    return Object.entries(typeCount).map(([type, count], index) => ({
      type,
      count,
      color: colors[index % colors.length],
    }));
  }, [appointments]);

  // Get upcoming appointments - now shows all future appointments, not just next 2 hours
  const upcomingAppointments = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      appointments
        ?.filter((apt) => {
          const appointmentDate = new Date(apt.appointment_date);
          appointmentDate.setHours(0, 0, 0, 0);
          // Show future appointments (after today) that aren't cancelled or completed
          return (
            appointmentDate > today &&
            apt.status !== "cancelled" &&
            apt.status !== "completed"
          );
        })
        ?.sort(
          (a, b) =>
            new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
        ) || []
    );
  }, [appointments]);

  // Load appointments on mount
  useEffect(() => {
    const fetchClinicAndAppointments = async () => {
      // Get clinics list - this returns the user's clinic
      const result = await getClinics();

      if (
        result.success &&
        result.data?.clinics &&
        result.data.clinics.length > 0
      ) {
        // Use the first clinic from the list
        const userClinic = result.data.clinics[0];
        console.log("Got clinic from getClinics:", userClinic);
        setClinicId(userClinic.id);

        // Fetch appointments for this clinic
        getTodayAppointments(userClinic.id);
        getPendingAppointments(userClinic.id);
        getAppointmentsByClinic(userClinic.id);

        // Update form with clinic_id
        setNewAppointment((prev) => ({
          ...prev,
          clinic_id: userClinic.id,
        }));
      } else {
        showToast("No clinic found for this user", "error");
      }
    };

    fetchClinicAndAppointments();
  }, [getAppointmentsByClinic, getClinics, getPendingAppointments, getTodayAppointments, showToast]);

  console.log("do i have a clinic id?", clinic);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const refreshAppointments = async () => {
    if (clinicId) {
      await getTodayAppointments(clinicId);
      await getPendingAppointments(clinicId);
      await getAppointmentsByClinic(clinicId);
      showToast("Appointments refreshed!", "success");
    }
  };

  const handleAddAppointment = async () => {
    if (
      !newAppointment.patient_name ||
      !newAppointment.appointment_date ||
      !newAppointment.appointment_time
    ) {
      showToast("Please fill in required fields", "error");
      return;
    }

    const result = await bookAppointment({
      ...newAppointment,
      appointment_datetime: `${newAppointment.appointment_date} ${newAppointment.appointment_time}`,
    });

    if (result.success) {
      setNewAppointmentModalOpen(false);
      showToast(
        `Appointment scheduled for ${newAppointment.patient_name}!`,
        "success"
      );
      setNewAppointment({
        clinic_id: clinicId || "",
        patient_id: "",
        patient_name: "",
        patient_phone: "",
        patient_email: "",
        appointment_date: "",
        appointment_time: "",
        reason_for_visit: "",
        notes: "",
      });
      refreshAppointments();
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({
      appointment_date: appointment.date || "",
      appointment_time: appointment.time || "",
      notes: "",
    });
    setRescheduleModalOpen(true);
  };

  const confirmReschedule = async () => {
    if (!selectedAppointment?.id) return;

    const result = await rescheduleAppointment(selectedAppointment.id, {
      ...rescheduleForm,
      appointment_datetime: `${rescheduleForm.appointment_date} ${rescheduleForm.appointment_time}`,
    });

    if (result.success) {
      setRescheduleModalOpen(false);
      showToast("Appointment rescheduled!", "success");
      refreshAppointments();
    }
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelForm({ cancellation_reason: "" });
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment?.id) return;

    const result = await cancelAppointment(selectedAppointment.id, {
      ...cancelForm,
      cancelled_by: currentUser?.id || "",
    });

    if (result.success) {
      setCancelModalOpen(false);
      showToast("Appointment cancelled", "success");
      refreshAppointments();
    }
  };

  const handleStartAppointment = async (id) => {
    const result = await confirmAppointment(id);
    if (result.success) {
      showToast("Appointment started!", "success");
      refreshAppointments();
    }
  };

  const handleNewAppointmentChange = (field, value) => {
    setNewAppointment((prev) => ({ ...prev, [field]: value }));
  };

  const handleRescheduleChange = (field, value) => {
    setRescheduleForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelChange = (field, value) => {
    setCancelForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Modals */}
      <NewAppointmentModal
        isOpen={newAppointmentModalOpen}
        onClose={() => setNewAppointmentModalOpen(false)}
        appointment={newAppointment}
        onChange={handleNewAppointmentChange}
        onSubmit={handleAddAppointment}
      />

      <RescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        form={rescheduleForm}
        onChange={handleRescheduleChange}
        onSubmit={confirmReschedule}
      />

      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        form={cancelForm}
        onChange={handleCancelChange}
        onSubmit={confirmCancel}
      />

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Appointment Management
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your clinic's appointment schedule
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={appointmentStats} />

      {/* Controls */}
      <div className="mt-6">
        <ControlsBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={() => setNewAppointmentModalOpen(true)}
          onFilterClick={() => showToast("Filter coming soon", "info")}
          onDownloadClick={() => showToast("Export coming soon", "info")}
          onRefreshClick={refreshAppointments}
        />
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Section */}
        <div className="space-y-6 lg:col-span-2">
          <CalendarView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          <div>
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Today's Schedule
            </h4>
            <TodaySchedule />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <UpcomingList
            appointments={upcomingAppointments}
            onStart={handleStartAppointment}
            onReschedule={handleReschedule}
            onCancel={handleCancelAppointment}
          />
          <AppointmentTypesCard types={appointmentTypes} />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
};

const AppointmentsWithBoundary = (props) => (
  <ErrorBoundaryWrapper
    fallback={(fallbackProps) => (
      <CriticalFeatureFallback
        feature="Appointment Management"
        {...fallbackProps}
      />
    )}
    context="appointments"
  >
    <Appointments {...props} />
  </ErrorBoundaryWrapper>
);

export default AppointmentsWithBoundary;
