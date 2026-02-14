import React from "react";
import Card from "components/card";

const MedicationsList = ({ medications }) => {
  return (
    <div className="space-y-4">
      {medications.map((med) => (
        <Card key={med.id} extra="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-bold text-navy-700 dark:text-white">
                {med.name}
              </h5>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Dosage: </span>
                  <span>{med.dosage}</span>
                </div>
                <div>
                  <span className="text-gray-500">Start Date: </span>
                  <span>{med.startDate}</span>
                </div>
                <div>
                  <span className="text-gray-500">Doctor: </span>
                  <span>{med.doctor}</span>
                </div>
                <div>
                  <span className="text-gray-500">Purpose: </span>
                  <span>{med.purpose}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span
                    className={`font-medium ${
                      med.status === "Active"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {med.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MedicationsList;
