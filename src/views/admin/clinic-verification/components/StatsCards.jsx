import React from "react";
import Card from "components/card";
import {
  MdCheckCircle,
  MdPendingActions,
  MdCancel,
  MdVerified,
} from "react-icons/md";

const StatsCards = ({ clinics }) => {
  const stats = {
    total: clinics?.length || 0,
    pending:
      clinics?.filter((c) => c.verification_status === "pending").length || 0,
    verified:
      clinics?.filter((c) => c.verification_status === "verified").length || 0,
    rejected:
      clinics?.filter((c) => c.verification_status === "rejected").length || 0,
  };

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card extra="p-6 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clinics</p>
            <p className="mt-2 text-3xl font-bold text-navy-700 dark:text-white">
              {stats.total}
            </p>
          </div>
          <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/30">
            <MdVerified className="h-6 w-6 text-brand-500" />
          </div>
        </div>
      </Card>

      <Card extra="p-6 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Review</p>
            <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.pending}
            </p>
          </div>
          <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
            <MdPendingActions className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </Card>

      <Card extra="p-6 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Verified</p>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.verified}
            </p>
          </div>
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <MdCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card extra="p-6 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.rejected}
            </p>
          </div>
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <MdCancel className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
