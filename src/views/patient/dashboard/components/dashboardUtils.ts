interface Patient {
  first_name?: string;
}

interface User {
  first_name?: string;
}

interface Appointment {
  appointment_datetime: string;
  status: string;
}

export const getPatientName = (patient: Patient | null | undefined, user: User | null | undefined): string => {
  if (patient?.first_name) {
    return patient.first_name;
  }
  if (user?.first_name) {
    return user.first_name;
  }
  return "User";
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return "today";
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return "tomorrow";
  }

  const diffTime = Math.abs(date.getTime() - now.getTime());
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

export const getUpcomingAppointments = (appointments: Appointment[]) => {
  const now = new Date();
  return appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointment_datetime);
    const isUpcoming = appointmentDate > now;
    const isNotCancelled = appointment.status !== "cancelled";
    return isUpcoming && isNotCancelled;
  });
};

export const getNextAppointment = (upcomingAppointments: Appointment[]) => {
  if (upcomingAppointments.length === 0) return null;

  const sorted = [...upcomingAppointments].sort(
    (a, b) =>
      new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
  );
  return sorted[0];
};

export const getUpcomingForModal = (appointments: Appointment[]) => {
  const upcoming = getUpcomingAppointments(appointments);
  return upcoming
    .sort(
      (a, b) =>
        new Date(a.appointment_datetime).getTime() - new Date(b.appointment_datetime).getTime()
    )
    .slice(0, 3);
};
