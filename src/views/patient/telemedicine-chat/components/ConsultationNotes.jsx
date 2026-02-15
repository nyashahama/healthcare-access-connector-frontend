import React from "react";
import Card from "components/card";

const ConsultationNotes = () => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Consultation Notes
      </h4>
      <div className="space-y-3">
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <h5 className="font-medium text-blue-800 dark:text-blue-300">
            Before Your Chat
          </h5>
          <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-400">
            <li>• Have your symptoms ready to describe</li>
            <li>• List any current medications</li>
            <li>• Prepare any questions you have</li>
          </ul>
        </div>
        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <h5 className="font-medium text-green-800 dark:text-green-300">
            What You Can Discuss
          </h5>
          <ul className="mt-2 space-y-1 text-sm text-green-600 dark:text-green-400">
            <li>• Symptoms assessment</li>
            <li>• Medication advice</li>
            <li>• Follow-up care</li>
            <li>• General health questions</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ConsultationNotes;
