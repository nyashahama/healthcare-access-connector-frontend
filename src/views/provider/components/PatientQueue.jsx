import React from "react";
import { MdTimer, MdPerson, MdChatBubble } from "react-icons/md";

const PatientQueue = () => {
  const waitingPatients = [
    {
      id: 1,
      name: "Emma Wilson",
      waitTime: "15 min",
      reason: "Telemedicine Consultation",
      priority: "high",
    },
    {
      id: 2,
      name: "David Miller",
      waitTime: "25 min",
      reason: "Prescription Refill",
      priority: "medium",
    },
    {
      id: 3,
      name: "Sophia Chen",
      waitTime: "5 min",
      reason: "Follow-up Questions",
      priority: "low",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Patient Queue
        </h5>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MdTimer className="mr-2 h-4 w-4" />
          Avg wait: 15 min
        </div>
      </div>

      <div className="space-y-4">
        {waitingPatients.map((patient) => (
          <div
            key={patient.id}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
                  <MdPerson className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h6 className="font-bold text-navy-700 dark:text-white">
                    {patient.name}
                  </h6>
                  <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdTimer className="mr-1 h-3 w-3" />
                    Waiting: {patient.waitTime}
                  </div>
                </div>
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityColor(
                    patient.priority
                  )}`}
                >
                  {patient.priority}
                </span>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              <MdChatBubble className="mr-2 inline h-4 w-4" />
              {patient.reason}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="rounded-lg bg-brand-500 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
                Start Consultation
              </button>
              <button className="rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:bg-gray-100 dark:border-navy-600 dark:text-gray-300">
                View History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientQueue;
