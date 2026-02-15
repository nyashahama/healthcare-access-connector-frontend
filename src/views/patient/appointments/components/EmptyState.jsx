import React from "react";
import { FaRegCalendarCheck } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import Card from "components/card";

const EmptyState = ({ view, onBookNew }) => {
  return (
    <Card extra="p-12 text-center">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-navy-700">
        <FaRegCalendarCheck className="h-10 w-10 text-gray-400" />
      </div>
      <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
        No {view} appointments
      </h4>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        {view === "upcoming"
          ? "You don't have any upcoming appointments scheduled"
          : `No ${view} appointments found`}
      </p>
      {view === "upcoming" && (
        <button
          onClick={onBookNew}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
        >
          <MdAdd className="h-5 w-5" />
          Book New Appointment
        </button>
      )}
    </Card>
  );
};

export default EmptyState;
