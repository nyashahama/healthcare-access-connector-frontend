import React from "react";

const WelcomeHeader = ({ patientName, nextAppointment, formatDate }) => {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
        Welcome back, {patientName}! 👋
      </h3>
      {nextAppointment ? (
        <p className="text-gray-600 dark:text-gray-300">
          Your next appointment is{" "}
          {formatDate(nextAppointment.appointment_datetime)}. Stay healthy!
        </p>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          You have no upcoming appointments. Book a check-up to stay on top of
          your health!
        </p>
      )}
    </div>
  );
};

export default WelcomeHeader;
