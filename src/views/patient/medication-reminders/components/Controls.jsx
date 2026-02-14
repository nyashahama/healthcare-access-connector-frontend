import React from "react";
import { MdAdd, MdNotifications } from "react-icons/md";

const Controls = ({ onAdd, onSettings }) => {
  return (
    <div className="mb-6 flex justify-between">
      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          <MdAdd className="mr-2 h-4 w-4" />
          Add Reminder
        </button>
        <button
          onClick={onSettings}
          className="flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
        >
          <MdNotifications className="mr-2 h-4 w-4" />
          Notification Settings
        </button>
      </div>
    </div>
  );
};

export default Controls;
