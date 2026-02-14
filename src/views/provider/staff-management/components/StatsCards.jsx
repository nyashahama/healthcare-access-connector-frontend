import React from "react";
import Card from "components/card";

const StatsCards = ({
  staffTotal,
  staffList,
  activeDoctors,
  nurses,
  pendingInvites,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card extra="p-4">
        <p className="text-sm text-gray-600">Total Staff</p>
        <p className="text-2xl font-bold text-navy-700 dark:text-white">
          {staffTotal || staffList.length}
        </p>
      </Card>
      <Card extra="p-4">
        <p className="text-sm text-gray-600">Active Doctors</p>
        <p className="text-2xl font-bold text-navy-700 dark:text-white">
          {activeDoctors.length}
        </p>
      </Card>
      <Card extra="p-4">
        <p className="text-sm text-gray-600">Nurses</p>
        <p className="text-2xl font-bold text-navy-700 dark:text-white">
          {nurses.length}
        </p>
      </Card>
      <Card extra="p-4">
        <p className="text-sm text-gray-600">Pending Invites</p>
        <p className="text-2xl font-bold text-navy-700 dark:text-white">
          {pendingInvites}
        </p>
      </Card>
    </div>
  );
};

export default StatsCards;
