import React, { useState, useEffect } from "react";
import { useToast } from "hooks/useToast";
import { useAppointment } from "hooks/useAppointment";
import { usePatient } from "hooks/usePatient";

// Component imports
import QuickStats from "./components/QuickStats";
import SearchAndControls from "./components/SearchAndControls";
import ViewTabs from "./components/ViewTabs";
import AppointmentCard from "./components/AppointmentCard";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import {
  DetailsModal,
  CancelModal,
  RescheduleModal,
} from "./components/AppointmentModals";

// Utility imports
import {
  categorizeAppointments,
  getStatusColor,
  getStatusDisplay,
  filterAppointments,
} from "./components/appointmentUtils";

const PatientAppointments = () => {
  const [view, setView] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalState, setModalState] = useState({
    details: false,
    cancel: false,
    reschedule: false,
  });
  const { showToast } = useToast();

  const { patient } = usePatient();
  const {
    getAppointmentsByPatient,
    rescheduleAppointment,
    cancelAppointment,
    clearError,
    loading,
    error,
    appointments,
  } = useAppointment();

  // Load appointments on component mount
  useEffect(() => {
    if (patient?.user_id) {
      loadPatientAppointments();
    }
  }, [patient?.user_id]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [error]);

  const loadPatientAppointments = async () => {
    if (patient?.user_id) {
      await getAppointmentsByPatient(patient?.user_id);
    }
  };

  const categorizedAppointments = categorizeAppointments(appointments);
  const filteredAppointments = filterAppointments(
    categorizedAppointments[view],
    searchQuery
  );

  // Handler functions
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, details: true });
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, cancel: true });
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, reschedule: true });
  };

  const confirmReschedule = async (newDate, newTime) => {
    if (!selectedAppointment) return;

    const appointmentDatetime = new Date(newDate);
    const [hours, minutes] = newTime.split(":");
    appointmentDatetime.setHours(parseInt(hours), parseInt(minutes));

    const result = await rescheduleAppointment(selectedAppointment.id, {
      appointment_date: newDate,
      appointment_time: newTime,
      appointment_datetime: appointmentDatetime.toISOString(),
    });

    if (result.success) {
      setModalState({ ...modalState, reschedule: false });
      showToast("Appointment rescheduled successfully", "success");
      await loadPatientAppointments();
    }
  };

  const confirmCancel = async (cancellationReason) => {
    if (!selectedAppointment) return;

    const result = await cancelAppointment(selectedAppointment.id, {
      cancellation_reason: cancellationReason,
      cancelled_by: patient?.user_id,
    });

    if (result.success) {
      setModalState({ ...modalState, cancel: false });
      showToast("Appointment cancelled successfully", "success");
      await loadPatientAppointments();
    }
  };

  const handleBookNew = () => {
    window.location.href = "/patient/find-clinic";
  };

  return (
    <div className="h-full">
      {/* Modals */}
      <DetailsModal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        appointment={selectedAppointment}
        getStatusColor={getStatusColor}
        getStatusDisplay={getStatusDisplay}
      />

      <CancelModal
        isOpen={modalState.cancel}
        onClose={() => setModalState({ ...modalState, cancel: false })}
        appointment={selectedAppointment}
        onConfirm={confirmCancel}
      />

      <RescheduleModal
        isOpen={modalState.reschedule}
        onClose={() => setModalState({ ...modalState, reschedule: false })}
        appointment={selectedAppointment}
        onConfirm={confirmReschedule}
        showToast={showToast}
      />

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          My Appointments
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage and track all your healthcare appointments
        </p>
      </div>

      {/* Loading State */}
      {loading && <LoadingState />}

      {!loading && (
        <>
          {/* Quick Stats */}
          <QuickStats categorizedAppointments={categorizedAppointments} />

          {/* Search & Controls */}
          <SearchAndControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onFilterClick={() => setFilterOpen(!filterOpen)}
            onBookNew={handleBookNew}
          />

          {/* View Tabs */}
          <ViewTabs
            currentView={view}
            onViewChange={setView}
            categorizedAppointments={categorizedAppointments}
          />

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <EmptyState view={view} onBookNew={handleBookNew} />
            ) : (
              filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  showActions={view === "upcoming"}
                  onViewDetails={handleViewDetails}
                  onReschedule={handleRescheduleAppointment}
                  onCancel={handleCancelAppointment}
                  getStatusColor={getStatusColor}
                  getStatusDisplay={getStatusDisplay}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientAppointments;
