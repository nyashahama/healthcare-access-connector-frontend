// ClinicManagement/index.jsx
import React, { useState } from "react";
import {
  MdSettings,
  MdBusiness,
  MdPeople,
  MdCalendarToday,
  MdAnalytics,
  MdSecurity,
} from "react-icons/md";
import Card from "components/card";
import ClinicInformation from "../profile/components/ClinicInformation";
import ClinicBanner from "../profile/components/ClinicBanner";
import OperatingHours from "../profile/components/OperatingHours";
import MedicalStaff from "../profile/components/MedicalStaff";
import Credentials from "../profile/components/Credentials";
import ServicesOffered from "../profile/components/ServicesOffered";
import AppointmentSettings from "../profile/components/AppointmentSettings";
import PerformanceMetrics from "../profile/components/PerformanceMetrics";

const ClinicManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: <MdBusiness /> },
    { id: "staff", label: "Staff", icon: <MdPeople /> },
    { id: "services", label: "Services", icon: <MdSettings /> },
    { id: "appointments", label: "Appointments", icon: <MdCalendarToday /> },
    { id: "analytics", label: "Analytics", icon: <MdAnalytics /> },
    { id: "security", label: "Security", icon: <MdSecurity /> },
  ];

  const managementStats = [
    { label: "Total Staff", value: "8", change: "+2" },
    { label: "Active Services", value: "12", change: "+3" },
    { label: "Monthly Revenue", value: "R245,800", change: "+12%" },
    { label: "Patient Satisfaction", value: "4.8/5", change: "+0.2" },
  ];

  const recentActivities = [
    { time: "10:30 AM", action: "Dr. Smith added to schedule", user: "Admin" },
    { time: "09:15 AM", action: "New service added", user: "Manager" },
    { time: "Yesterday", action: "Clinic hours updated", user: "Admin" },
    { time: "Nov 10", action: "Staff credentials verified", user: "System" },
  ];

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Clinic Management
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Manage clinic settings, staff, services, and performance
        </p>
      </div>

      {/* Clinic Banner */}
      <div className="mb-6">
        <ClinicBanner />
      </div>

      {/* Management Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-navy-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center rounded-t-lg px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-brand-500 bg-white text-brand-500 dark:bg-navy-800"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Management Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {managementStats.map((stat, index) => (
          <Card key={index} extra="p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                {stat.value}
              </p>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.change.includes("+") ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Clinic Details & Settings */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Active Tab Content */}
            {activeTab === "overview" && (
              <>
                <ClinicInformation />
                <OperatingHours />
              </>
            )}

            {activeTab === "staff" && (
              <>
                <MedicalStaff />
                <Credentials />
              </>
            )}

            {activeTab === "services" && (
              <>
                <ServicesOffered />
                <Card extra="p-6">
                  <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                    Service Analytics
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Most Popular Service
                      </span>
                      <span className="font-medium">Immunizations (95%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Revenue Generating Service
                      </span>
                      <span className="font-medium">
                        Chronic Care (R18,200)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeTab === "appointments" && <AppointmentSettings />}
            {activeTab === "analytics" && <PerformanceMetrics />}
            {activeTab === "security" && (
              <Card extra="p-6">
                <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                  Security & Access Control
                </h4>
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-600">
                    <h5 className="mb-2 font-medium">User Permissions</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Admin Access</span>
                        <span className="text-sm text-gray-600">2 users</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Doctor Access</span>
                        <span className="text-sm text-gray-600">3 users</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nurse Access</span>
                        <span className="text-sm text-gray-600">2 users</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-600">
                    <h5 className="mb-2 font-medium">Security Settings</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Two-Factor Auth</span>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked
                          />
                          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Session Timeout</span>
                        <span className="text-sm text-gray-600">30 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions & Recent Activity */}
        <div>
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-brand-50 p-3 text-left hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50">
                <div>
                  <p className="font-medium text-brand-700 dark:text-brand-300">
                    Add New Staff
                  </p>
                  <p className="text-sm text-brand-600 dark:text-brand-400">
                    Invite medical professionals
                  </p>
                </div>
                <MdPeople className="text-brand-600 dark:text-brand-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-lg bg-green-50 p-3 text-left hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50">
                <div>
                  <p className="font-medium text-green-700 dark:text-green-300">
                    Update Schedule
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Modify operating hours
                  </p>
                </div>
                <MdCalendarToday className="text-green-600 dark:text-green-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-lg bg-purple-50 p-3 text-left hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50">
                <div>
                  <p className="font-medium text-purple-700 dark:text-purple-300">
                    Generate Reports
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Download performance data
                  </p>
                </div>
                <MdAnalytics className="text-purple-600 dark:text-purple-400" />
              </button>

              <button className="flex w-full items-center justify-between rounded-lg bg-blue-50 p-3 text-left hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50">
                <div>
                  <p className="font-medium text-blue-700 dark:text-blue-300">
                    Configure Services
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Add or modify services
                  </p>
                </div>
                <MdSettings className="text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card extra="p-6 mt-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Recent Activity
            </h4>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm text-navy-700 dark:text-white">
                      {activity.action}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                      <span>{activity.user}</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* System Status */}
          <Card extra="p-6 mt-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              System Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <span className="flex items-center text-sm text-green-600">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="flex items-center text-sm text-green-600">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm text-gray-600">78% used</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm text-gray-600">99.8%</span>
              </div>
            </div>
            <button className="linear mt-4 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
              System Settings
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClinicManagement;
