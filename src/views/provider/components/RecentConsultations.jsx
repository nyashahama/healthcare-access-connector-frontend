import React from "react";
import { MdAccessTime, MdPerson, MdCheckCircle } from "react-icons/md";

const RecentConsultations = () => {
  const consultations = [
    {
      id: 1,
      patient: "John Doe",
      time: "09:00 AM",
      duration: "30 min",
      type: "Follow-up",
      status: "completed",
      notes: "Patient recovering well",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "10:30 AM",
      duration: "45 min",
      type: "New Consultation",
      status: "completed",
      notes: "Prescribed medication",
    },
    {
      id: 3,
      patient: "Michael Brown",
      time: "02:00 PM",
      duration: "20 min",
      type: "Telemedicine",
      status: "completed",
      notes: "Scheduled lab tests",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Recent Consultations
        </h5>
        <button className="text-sm text-brand-500 hover:text-brand-600">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {consultations.map((consultation) => (
          <div
            key={consultation.id}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <MdCheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-3">
                  <h6 className="font-bold text-navy-700 dark:text-white">
                    {consultation.patient}
                  </h6>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdAccessTime className="mr-1 h-3 w-3" />
                    {consultation.time} • {consultation.duration}
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {consultation.type}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {consultation.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentConsultations;
