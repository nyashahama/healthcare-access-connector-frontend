export const getPatientName = (patient, user) => {
  if (patient?.first_name) {
    return patient.first_name;
  }
  if (user?.first_name) {
    return user.first_name;
  }
  return "User";
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return "today";
  }

  // Check if it's tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return "tomorrow";
  }

  // Return relative time
  const diffTime = Math.abs(date - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `in ${weeks} week${weeks > 1 ? "s" : ""}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `in ${months} month${months > 1 ? "s" : ""}`;
  }
};

export const getUpcomingAppointments = (appointments) => {
  const now = new Date();
  return appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointment_datetime);
    const isUpcoming = appointmentDate > now;
    const isNotCancelled = appointment.status !== "cancelled";
    return isUpcoming && isNotCancelled;
  });
};

export const getNextAppointment = (upcomingAppointments) => {
  if (upcomingAppointments.length === 0) return null;

  const sorted = [...upcomingAppointments].sort(
    (a, b) =>
      new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
  );
  return sorted[0];
};

export const getUpcomingForModal = (appointments) => {
  const upcoming = getUpcomingAppointments(appointments);
  return upcoming
    .sort(
      (a, b) =>
        new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
    )
    .slice(0, 3); // Show only next 3 appointments
};
