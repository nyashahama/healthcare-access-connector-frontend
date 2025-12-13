import React, { useState } from "react";
import {
  MdVerifiedUser,
  MdPeople,
  MdAnalytics,
  MdWarning,
  MdAdd,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdInfo,
  MdRefresh,
  MdNotifications,
  MdSecurity,
  MdBackup,
  MdSettings,
} from "react-icons/md";
import {
  FaClinicMedical,
  FaUserCheck,
  FaServer,
  FaDatabase,
} from "react-icons/fa";
import Widget from "components/widget/Widget";
import SystemHealth from "../components/SystemHealth";
import RegistrationQueue from "../components/RegistrationQueue";
import AnalyticsChart from "../components/AnalyticsChart";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const SystemDashboard = () => {
  const { showToast } = useToast();
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Modal states
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  // System alerts data
  const systemAlerts = [
    {
      id: 1,
      system: "Database Server",
      status: "warning",
      message: "High CPU usage detected",
      timestamp: "2 hours ago",
      severity: "medium",
    },
    {
      id: 2,
      system: "SMS Gateway",
      status: "error",
      message: "Credit balance low",
      timestamp: "1 hour ago",
      severity: "high",
    },
    {
      id: 3,
      system: "API Service",
      status: "success",
      message: "All systems operational",
      timestamp: "5 minutes ago",
      severity: "low",
    },
  ];

  const handleRestartSystem = (system) => {
    setSelectedSystem(system);
    setRestartModalOpen(true);
  };

  const handleBackupSystem = (system) => {
    setSelectedSystem(system);
    setBackupModalOpen(true);
  };

  const handleViewDetails = (system) => {
    setSelectedSystem(system);
    // In a real app, this would navigate to detailed system page
    showToast(`Viewing details for ${system}`, "info");
  };

  const confirmRestart = () => {
    console.log(`Restarting system: ${selectedSystem}`);
    setRestartModalOpen(false);
    showToast(`${selectedSystem} restart initiated`, "warning");
  };

  const confirmBackup = () => {
    console.log(`Creating backup for: ${selectedSystem}`);
    setBackupModalOpen(false);
    showToast(`Backup created for ${selectedSystem}`, "success");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        text: "Operational",
      },
      warning: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        text: "Warning",
      },
      error: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        text: "Error",
      },
    };

    const config = statusConfig[status] || statusConfig.success;
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="h-full">
      {/* Modals */}
      {/* Restart System Modal */}
      <Modal
        isOpen={restartModalOpen}
        onClose={() => setRestartModalOpen(false)}
        title="Restart System Service"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <MdRefresh className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Restart {selectedSystem}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This will temporarily interrupt service. Users may experience
              brief downtime.
            </p>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Warning:</strong> Restarting during peak hours may
                affect user experience.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setRestartModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmRestart}
              className="rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-yellow-600"
            >
              Restart System
            </button>
          </div>
        </div>
      </Modal>

      {/* Backup System Modal */}
      <Modal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        title="Create System Backup"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MdBackup className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Backup {selectedSystem}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This will create a complete backup of all data and configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Type</span>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-navy-700">
                <option>Full Backup</option>
                <option>Incremental Backup</option>
                <option>Configuration Only</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage Location</span>
              <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-navy-700">
                <option>Primary Server</option>
                <option>Secondary Server</option>
                <option>Cloud Storage</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBackupModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmBackup}
              className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-blue-600"
            >
              Create Backup
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="System Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                System Maintenance Window
              </label>
              <input
                type="text"
                defaultValue="02:00 - 04:00 AM"
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto Backup Schedule
              </label>
              <select className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700">
                <option>Daily at 01:00 AM</option>
                <option>Weekly on Sundays</option>
                <option>Manual Only</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alert Thresholds
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="CPU %"
                  defaultValue="80"
                  className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                />
                <input
                  type="number"
                  placeholder="Memory %"
                  defaultValue="85"
                  className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSettingsModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSettingsModalOpen(false);
                showToast("System settings updated", "success");
              }}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
            >
              Save Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            System Administrator Dashboard 🛡️
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Monitoring healthcare access across South Africa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20"
          >
            <MdSettings className="mr-2 h-4 w-4" />
            Settings
          </button>
          <button
            onClick={() => setNotificationModalOpen(true)}
            className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95 active:bg-brand-700"
          >
            <MdNotifications className="mr-2 h-4 w-4" />
            Send Notification
          </button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<FaClinicMedical className="h-7 w-7" />}
          title={"Active Clinics"}
          subtitle={"247"}
          trend="+12%"
          link="/admin/clinic-verification"
        />
        <Widget
          icon={<MdPeople className="h-7 w-7" />}
          title={"Total Patients"}
          subtitle={"12,458"}
          trend="+23%"
          link="/admin/user-management"
        />
        <Widget
          icon={<FaUserCheck className="h-7 w-7" />}
          title={"Active Providers"}
          subtitle={"589"}
          trend="+8%"
          link="/admin/user-management"
        />
        <Widget
          icon={<MdAnalytics className="h-7 w-7" />}
          title={"Appointments Today"}
          subtitle={"1,234"}
          trend="+15%"
          link="/admin/analytics"
        />
      </div>

      {/* System Health & Alerts */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SystemHealth />
        </div>

        <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-lg font-bold text-navy-700 dark:text-white">
              🔔 System Alerts
            </h5>
            <button className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-200 dark:bg-navy-700">
              Clear All
            </button>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {alert.status === "error" ? (
                      <FaServer className="mr-3 h-5 w-5 text-red-500" />
                    ) : alert.status === "warning" ? (
                      <FaDatabase className="mr-3 h-5 w-5 text-yellow-500" />
                    ) : (
                      <MdSecurity className="mr-3 h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <div className="font-medium text-navy-700 dark:text-white">
                        {alert.system}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {alert.message}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(alert.status)}
                    <div className="mt-1 text-xs text-gray-500">
                      {alert.timestamp}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewDetails(alert.system)}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
                  >
                    <MdVisibility className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleRestartSystem(alert.system)}
                    className="rounded-lg border border-yellow-300 px-3 py-1 text-xs font-medium text-yellow-700 transition-all duration-200 hover:scale-105 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400"
                  >
                    <MdRefresh className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleBackupSystem(alert.system)}
                    className="rounded-lg border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
                  >
                    <MdBackup className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Registration Queue */}
        <div className="lg:col-span-2">
          <RegistrationQueue />
        </div>

        {/* Quick Metrics */}
        <div className="space-y-5">
          <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
            <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              🚨 Pending Actions
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <MdVerifiedUser className="mr-3 h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Clinics to Verify
                  </span>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700 transition-all duration-200 hover:scale-105 dark:bg-yellow-900 dark:text-yellow-300">
                  8
                </span>
              </div>
              <div className="flex items-center justify-between transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center">
                  <MdWarning className="mr-3 h-5 w-5 text-red-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Flagged Content
                  </span>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700 transition-all duration-200 hover:scale-105 dark:bg-red-900 dark:text-red-300">
                  3
                </span>
              </div>
            </div>
          </div>

          {/* SMS Credits */}
          <div className="to-emerald-400 rounded-[20px] bg-gradient-to-r from-green-500 p-6 text-white transition-all duration-300 hover:scale-[1.02]">
            <h5 className="mb-2 text-lg font-bold">SMS Credits</h5>
            <div className="mb-4">
              <div className="flex justify-between text-sm">
                <span>Remaining</span>
                <span className="font-bold">12,458</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                <div className="h-2 w-3/4 rounded-full bg-white transition-all duration-1000"></div>
              </div>
            </div>
            <button className="linear w-full rounded-xl bg-white py-2 font-medium text-green-600 transition-all duration-200 hover:scale-105 hover:bg-gray-100">
              Add Credits
            </button>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
            <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              ⚡ Quick Actions
            </h5>
            <div className="space-y-3">
              <button
                onClick={() => showToast("System log downloaded", "success")}
                className="w-full rounded-lg bg-blue-50 py-3 text-sm font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
              >
                Download System Logs
              </button>
              <button
                onClick={() => handleBackupSystem("Database")}
                className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Create Full Backup
              </button>
              <button
                onClick={() =>
                  showToast("Cache cleared successfully", "success")
                }
                className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
              >
                Clear System Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="mt-5 transition-all duration-300 hover:scale-[1.005]">
        <AnalyticsChart />
      </div>

      {/* System Status Footer */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-green-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-green-900/20">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900">
              <MdSecurity className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <div className="font-medium text-green-800 dark:text-green-300">
                Security Status
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                All systems secure
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-blue-900/20">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <FaServer className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-300">
                Uptime
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                99.8% (Last 30 days)
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-purple-900/20">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <MdAnalytics className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <div className="font-medium text-purple-800 dark:text-purple-300">
                Response Time
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                142ms average
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard;
