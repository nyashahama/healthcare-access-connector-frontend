import React, { useState } from "react";
import { MdVideoCall, MdChat, MdAccessTime, MdPerson } from "react-icons/md";

const TelemedicineIntegration = ({ appointment, onStartTelemedicine }) => {
  const [isTelemedicineActive, setIsTelemedicineActive] = useState(false);

  const handleStartTelemedicine = () => {
    setIsTelemedicineActive(true);
    onStartTelemedicine(appointment);

    // In real implementation, this would:
    // 1. Create a WebSocket room
    // 2. Send SMS notification to patient
    // 3. Update appointment status
    // 4. Open chat interface
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MdPerson className="mr-3 h-5 w-5 text-brand-500" />
          <div>
            <h5 className="font-medium text-navy-700 dark:text-white">
              {appointment.patient}
            </h5>
            <p className="text-sm text-gray-600">ID: {appointment.patientId}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="flex items-center text-sm text-gray-600">
            <MdAccessTime className="mr-1 h-4 w-4" />
            {appointment.time}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm text-gray-600">Reason: {appointment.reason}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {!isTelemedicineActive ? (
          <>
            <button
              onClick={handleStartTelemedicine}
              className="flex items-center justify-center rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
            >
              <MdVideoCall className="mr-2 h-4 w-4" />
              Start Video Call
            </button>
            <button
              onClick={handleStartTelemedicine}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white py-2.5 text-sm hover:bg-gray-50 dark:border-navy-600"
            >
              <MdChat className="mr-2 h-4 w-4" />
              Chat Only
            </button>
          </>
        ) : (
          <div className="col-span-2">
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span className="font-medium text-green-800 dark:text-green-300">
                  Telemedicine session active
                </span>
              </div>
              <button
                onClick={() => setIsTelemedicineActive(false)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400"
              >
                End session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemedicineIntegration;
