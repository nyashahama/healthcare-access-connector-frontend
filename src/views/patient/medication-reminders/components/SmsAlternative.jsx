import React from "react";
import { MdPhone } from "react-icons/md";
import Card from "components/card";

const SmsAlternative = () => {
  return (
    <div className="mt-6">
      <Card extra="p-6">
        <div className="flex items-start">
          <MdPhone className="mr-3 h-5 w-5 text-green-500" />
          <div>
            <h5 className="font-bold text-green-700 dark:text-green-300">
              SMS Reminders for Non-Smartphone Users
            </h5>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Text "REMINDER" to 12345 followed by your medication name and time
              (e.g., "REMINDER Amoxicillin 8am 4pm 12am") to set up SMS
              reminders. Standard SMS rates apply.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SmsAlternative;
