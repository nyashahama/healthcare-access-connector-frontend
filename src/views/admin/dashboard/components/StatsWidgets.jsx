import React from "react";
import Widget from "components/widget/Widget";

const StatsWidgets = ({
  totalClinics,
  activeUsers,
  systemHealth,
  smsBalance,
}) => {
  return (
    <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Widget
        icon={totalClinics.icon}
        title={totalClinics.title}
        subtitle={totalClinics.value}
        trend={totalClinics.trend}
        extra="transition-all duration-300 hover:scale-[1.02]"
      />
      <Widget
        icon={activeUsers.icon}
        title={activeUsers.title}
        subtitle={activeUsers.value}
        trend={activeUsers.trend}
        extra="transition-all duration-300 hover:scale-[1.02]"
      />
      <Widget
        icon={systemHealth.icon}
        title={systemHealth.title}
        subtitle={systemHealth.value}
        trend={systemHealth.trend}
        extra="transition-all duration-300 hover:scale-[1.02]"
      />
      <Widget
        icon={smsBalance.icon}
        title={smsBalance.title}
        subtitle={smsBalance.value}
        trend={smsBalance.trend}
        extra="transition-all duration-300 hover:scale-[1.02]"
      />
    </div>
  );
};

export default StatsWidgets;
