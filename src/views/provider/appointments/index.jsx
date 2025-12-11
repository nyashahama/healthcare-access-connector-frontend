// Appointments/index.jsx
import React, { useState } from "react";
import {
  MdCalendarToday,
  MdAdd,
  MdFilterList,
  MdSearch,
  MdDownload,
} from "react-icons/md";
import Card from "components/card";
import TodaySchedule from "../components/TodaySchedule";
import AppointmentSettings from "../profile/components/AppointmentSettings";

const Appointments = () => {
  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointmentStats = [
    {
      title: "Today's Appointments",
      value: "12",
      change: "+2",
      color: "text-blue-600",
    },
    {
      title: "Scheduled This Week",
      value: "48",
      change: "+8",
      color: "text-green-600",
    },
    {
      title: "Cancellations",
      value: "3",
      change: "-1",
      color: "text-red-600",
    },
    {
      title: "No-Shows",
      value: "1",
      change: "0",
      color: "text-yellow-600",
    },
  ];

  const appointmentTypes = [
    { type: "Consultation", count: 24, color: "bg-blue-500" },
    { type: "Follow-up", count: 18, color: "bg-green-500" },
    { type: "Vaccination", count: 12, color: "bg-purple-500" },
    { type: "Check-up", count: 8, color: "bg-yellow-500" },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: "John Doe",
      time: "10:00 AM",
      type: "Consultation",
      doctor: "Dr. Smith",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "11:30 AM",
      type: "Vaccination",
      doctor: "Nurse Johnson",
      status: "confirmed",
    },
    {
      id: 3,
      patient: "Michael Brown",
      time: "02:00 PM",
      type: "Follow-up",
      doctor: "Dr. Nkosi",
      status: "pending",
    },
    {
      id: 4,
      patient: "Lisa Anderson",
      time: "03:30 PM",
      type: "Check-up",
      doctor: "Dr. Smith",
      status: "confirmed",
    },
  ];

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Appointments
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and schedule patient appointments
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
            <MdFilterList className="mr-2" />
            Filter
          </button>
          <button className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
            <MdAdd className="mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {appointmentStats.map((stat, index) => (
          <Card key={index} extra="p-4">
            <p className="text-sm text-gray-600">{stat.title}</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                {stat.value}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.change.includes("+")
                    ? "text-green-600"
                    : stat.change === "0"
                    ? "text-gray-600"
                    : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar & Today's Schedule */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    view === "day"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                  onClick={() => setView("day")}
                >
                  Day
                </button>
                <button
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    view === "week"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                  onClick={() => setView("week")}
                >
                  Week
                </button>
                <button
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    view === "month"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                  onClick={() => setView("month")}
                >
                  Month
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-navy-600 dark:bg-navy-700"
                  />
                </div>
                <button className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
                  <MdDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Calendar View */}
            <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-navy-600">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-navy-700 dark:text-white">
                  November 2024
                </h4>
                <div className="flex space-x-2">
                  <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-600">
                    ←
                  </button>
                  <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-navy-600">
                    Today
                  </button>
                  <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-600">
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
                    className={`rounded-lg p-2 text-center ${
                      day === 15
                        ? "bg-brand-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-navy-600"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                Today's Schedule
              </h4>
              <TodaySchedule />
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Upcoming
            </h4>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-navy-600"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-navy-700 dark:text-white">
                        {apt.patient}
                      </h5>
                      <p className="text-sm text-gray-600">{apt.doctor}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <MdCalendarToday className="mr-1 h-4 w-4" />
                      {apt.time}
                    </span>
                    <span className="text-gray-600">{apt.type}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className="rounded-lg bg-brand-500 py-1.5 text-sm text-white hover:bg-brand-600">
                      Start
                    </button>
                    <button className="rounded-lg border border-gray-300 py-1.5 text-sm hover:bg-gray-50 dark:border-navy-600">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Appointment Types Distribution */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Appointment Types
            </h4>
            <div className="space-y-3">
              {appointmentTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 h-3 w-3 rounded-full ${type.color}`}
                    ></div>
                    <span className="text-sm text-gray-600">{type.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">
                      {type.count}
                    </span>
                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(type.count / 62) * 100}%`,
                          backgroundColor: type.color.replace("bg-", ""),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Settings */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Quick Settings
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-confirm</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" checked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Send reminders</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" checked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Allow walk-ins</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" checked />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <button className="linear mt-4 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
              Manage Settings
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
