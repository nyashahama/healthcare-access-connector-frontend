import React from "react";
import Card from "components/card";

const VaccinationsList = ({ vaccinations }) => {
  return (
    <div className="space-y-4">
      {vaccinations.map((vac) => (
        <Card key={vac.id} extra="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-bold text-navy-700 dark:text-white">
                {vac.vaccine}
              </h5>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Date: </span>
                  <span>{vac.date}</span>
                </div>
                <div>
                  <span className="text-gray-500">Dose: </span>
                  <span>{vac.dose}</span>
                </div>
                <div>
                  <span className="text-gray-500">Location: </span>
                  <span>{vac.location}</span>
                </div>
                <div>
                  <span className="text-gray-500">Next Due: </span>
                  <span>{vac.nextDue}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span
                    className={`font-medium ${
                      vac.status === "Complete"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {vac.status}
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

export default VaccinationsList;
