import React from "react";
import { MdVideoCall, MdPhone, MdMedicalServices } from "react-icons/md";
import { FaUserMd, FaRegClock } from "react-icons/fa";

const ProviderChatHeader = ({ isConsulting, activePatient }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
      {isConsulting && activePatient ? (
        <>
          <div className="flex items-center">
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl dark:bg-brand-900/30">
              {activePatient.avatar}
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                {activePatient.name}
              </h4>
              <p className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                Age {activePatient.age} · {activePatient.chiefComplaint}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {activePatient.priority === "urgent" && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                URGENT
              </span>
            )}
            <button
              className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
              title="Start Video Call"
            >
              <MdVideoCall className="h-5 w-5" />
            </button>
            <button
              className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
              title="Start Phone Call"
            >
              <MdPhone className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <FaUserMd className="mr-3 h-8 w-8 text-brand-500" />
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Provider Consultation Room
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select a patient from the queue to begin
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <FaRegClock className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">
              No active consultation
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProviderChatHeader;
