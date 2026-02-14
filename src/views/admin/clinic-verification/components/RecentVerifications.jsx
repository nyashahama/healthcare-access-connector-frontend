import React from "react";
import Card from "components/card";
import { getStatusBadge, getTimeAgo } from "./clinicUtils";

const RecentVerifications = ({ clinics }) => {
  const recentVerifications =
    clinics?.filter((c) => c.verification_status !== "pending").slice(0, 3) ||
    [];

  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Recent Verifications
      </h4>
      <div className="space-y-4">
        {recentVerifications.map((clinic) => (
          <div
            key={clinic.id}
            className="rounded-lg border border-gray-200 p-3 transition-all duration-300 hover:scale-[1.02] hover:border-brand-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-navy-700 dark:text-white">
                  {clinic.clinic_name}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {clinic.city}, {clinic.province}
                </div>
              </div>
              {getStatusBadge(clinic.verification_status)}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Updated {getTimeAgo(clinic.updated_at)}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
        View All History →
      </button>
    </Card>
  );
};

export default RecentVerifications;
