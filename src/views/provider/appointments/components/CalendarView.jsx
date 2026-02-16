import React from "react";
import Card from "components/card";

const CalendarView = ({ selectedDate, onDateChange }) => {
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleDayClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    onDateChange(newDate);
  };

  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          {selectedDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handlePrevDay}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-600"
          >
            ←
          </button>
          <button
            onClick={handleToday}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-navy-600"
          >
            Today
          </button>
          <button
            onClick={handleNextDay}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-600"
          >
            →
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className={`cursor-pointer rounded-lg p-2 text-center ${
              day === selectedDate.getDate()
                ? "bg-brand-500 text-white"
                : "hover:bg-gray-100 dark:hover:bg-navy-600"
            }`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CalendarView;
