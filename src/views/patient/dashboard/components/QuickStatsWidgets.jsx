import React from "react";
import { IoMdCalendar, IoMdMedical, IoMdChatbubbles } from "react-icons/io";
import { FaAppleAlt } from "react-icons/fa";
import Widget from "components/widget/Widget";

const QuickStatsWidgets = ({
  upcomingCount,
  healthStatus,
  isLoading,
  onAppointmentClick,
  onHealthScoreClick,
  onMessagesClick,
  onNutritionClick,
}) => {
  const widgets = [
    {
      icon: <IoMdCalendar className="h-7 w-7" />,
      title: "Upcoming Appointments",
      subtitle: upcomingCount.toString(),
      onClick: onAppointmentClick,
      bgColor: "bg-blue-500",
      isLoading,
    },
    {
      icon: <IoMdMedical className="h-7 w-7" />,
      title: "Health Status",
      subtitle: healthStatus || "Not set",
      onClick: onHealthScoreClick,
      bgColor: "bg-green-500",
    },
    {
      icon: <IoMdChatbubbles className="h-7 w-7" />,
      title: "Unread Messages",
      subtitle: "0",
      onClick: onMessagesClick,
      bgColor: "bg-purple-500",
    },
    {
      icon: <FaAppleAlt className="h-7 w-7" />,
      title: "Nutrition Tips",
      subtitle: "5 new",
      onClick: onNutritionClick,
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {widgets.map((widget, index) => (
        <Widget key={index} {...widget} />
      ))}
    </div>
  );
};

export default QuickStatsWidgets;
