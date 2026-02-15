export const categorizeAppointments = (allAppointments) => {
  const now = new Date();

  return {
    upcoming: allAppointments.filter((apt) => {
      const appointmentDate = new Date(apt.appointment_datetime);
      const isUpcoming = appointmentDate > now;
      const isConfirmed =
        apt.status === "confirmed" || apt.status === "pending";
      return isUpcoming && isConfirmed;
    }),
    past: allAppointments.filter((apt) => {
      const appointmentDate = new Date(apt.appointment_datetime);
      const isPast = appointmentDate <= now;
      const isCompleted =
        apt.status === "completed" || apt.status === "no_show";
      return isPast && isCompleted;
    }),
    cancelled: allAppointments.filter((apt) => apt.status === "cancelled"),
  };
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "pending":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "no_show":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const getStatusDisplay = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "no_show":
      return "No Show";
    default:
      return status;
  }
};

export const filterAppointments = (appointments, searchQuery) => {
  if (!searchQuery) return appointments;

  const query = searchQuery.toLowerCase();
  return appointments.filter(
    (appointment) =>
      appointment.patient_name?.toLowerCase().includes(query) ||
      appointment.doctor_name?.toLowerCase().includes(query) ||
      appointment.clinic_name?.toLowerCase().includes(query) ||
      appointment.reason_for_visit?.toLowerCase().includes(query)
  );
};
