import React, { useState } from "react";
import {
  MdVerifiedUser,
  MdPeople,
  MdAnalytics,
  MdWarning,
} from "react-icons/md";
import {
  FaClinicMedical,
  FaUserCheck,
  FaServer,
  FaDatabase,
  FaUserMd,
} from "react-icons/fa";
import SystemHealth from "../components/SystemHealth";
import RegistrationQueue from "../components/RegistrationQueue";
import AnalyticsChart from "../components/AnalyticsChart";

// Component imports
import StatsWidgets from "./components/StatsWidgets";
import QuickActionsPanel from "./components/QuickActionsPanel";
import SystemAlertsPanel from "./components/SystemAlertsPanel";
import PendingActionsCard from "./components/PendingActionsCard";
import SMSCreditsCard from "./components/SMSCreditsCard";
import QuickActionsButtons from "./components/QuickActionsButtons";
import SystemStatusFooter from "./components/SystemStatusFooter";
import ToastNotification from "./components/ToastNotification";
import {
  RestartModal,
  BackupModal,
  SettingsModal,
} from "./components/SystemActionModals";
import {
  ApproveClinicModal,
  RejectClinicModal,
} from "./components/ClinicActionModals";
import NotificationModal from "./components/NotificationModal";

const SystemDashboard = () => {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [approveClinicModalOpen, setApproveClinicModalOpen] = useState(false);
  const [rejectClinicModalOpen, setRejectClinicModalOpen] = useState(false);

  // Form states
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAudience, setNotificationAudience] = useState("All Users");
  const [rejectReason, setRejectReason] = useState("");

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

  // Stats widget data
  const statsData = {
    totalClinics: {
      icon: <FaClinicMedical className="h-7 w-7" />,
      title: "Total Clinics",
      value: "1,247",
      trend: "+12% from last month",
    },
    activeUsers: {
      icon: <MdPeople className="h-7 w-7" />,
      title: "Active Users",
      value: "45,823",
      trend: "+8.2% this week",
    },
    systemHealth: {
      icon: <FaServer className="h-7 w-7" />,
      title: "System Health",
      value: "98.5%",
      trend: "All services operational",
    },
    smsBalance: {
      icon: <FaDatabase className="h-7 w-7" />,
      title: "SMS Balance",
      value: "12,458",
      trend: "Credits remaining",
    },
  };

  // Toast notification system
  const showToast = (message, type = "info") => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Handlers for system actions
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
    showToast(`Viewing details for ${system}`, "info");
  };

  const handleApproveClinic = (clinic) => {
    setSelectedClinic(clinic);
    setApproveClinicModalOpen(true);
  };

  const handleRejectClinic = (clinic) => {
    setSelectedClinic(clinic);
    setRejectClinicModalOpen(true);
  };

  const handleViewAllRegistrations = () => {
    showToast("Opening full registration queue...", "info");
  };

  const handleAddCredits = () => {
    showToast("Redirecting to SMS credit purchase...", "info");
  };

  const handleClearCache = () => {
    showToast("System cache cleared successfully", "success");
  };

  const handleDownloadLogs = () => {
    showToast("System logs downloaded successfully", "success");
  };

  const handleClearAlerts = () => {
    showToast("All alerts cleared", "info");
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

  const confirmApproveClinic = () => {
    console.log(`Approving clinic: ${selectedClinic.name}`);
    setApproveClinicModalOpen(false);
    showToast(
      `Clinic "${selectedClinic.name}" approved successfully`,
      "success"
    );
  };

  const confirmRejectClinic = () => {
    console.log(`Rejecting clinic: ${selectedClinic.name}`);
    setRejectClinicModalOpen(false);
    setRejectReason("");
    showToast(
      `Clinic "${selectedClinic.name}" registration rejected`,
      "warning"
    );
  };

  const sendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      showToast("Please fill in all notification fields", "error");
      return;
    }

    console.log(`Sending notification to ${notificationAudience}`);
    setNotificationModalOpen(false);
    setNotificationTitle("");
    setNotificationMessage("");
    showToast(`Notification sent to ${notificationAudience}`, "success");
  };

  return (
    <div className="h-full">
      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          System Administration Dashboard
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Monitor and manage all platform operations
        </p>
      </div>

      {/* Stats Widgets */}
      <StatsWidgets
        totalClinics={statsData.totalClinics}
        activeUsers={statsData.activeUsers}
        systemHealth={statsData.systemHealth}
        smsBalance={statsData.smsBalance}
      />

      {/* Quick Actions and System Health */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SystemHealth />
        </div>
        <div>
          <QuickActionsPanel
            onSendNotification={() => setNotificationModalOpen(true)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onClearAlerts={handleClearAlerts}
          />
        </div>
      </div>

      {/* System Alerts */}
      <div className="mb-5">
        <SystemAlertsPanel
          alerts={systemAlerts}
          onViewDetails={handleViewDetails}
          onRestartSystem={handleRestartSystem}
          onBackupSystem={handleBackupSystem}
        />
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Registration Queue */}
        <div className="lg:col-span-2">
          <RegistrationQueue
            onApprove={handleApproveClinic}
            onReject={handleRejectClinic}
            onViewAll={handleViewAllRegistrations}
          />
        </div>

        {/* Quick Metrics */}
        <div className="space-y-5">
          <PendingActionsCard />
          <SMSCreditsCard onAddCredits={handleAddCredits} />
          <QuickActionsButtons
            onDownloadLogs={handleDownloadLogs}
            onBackupSystem={() => handleBackupSystem("Database")}
            onClearCache={handleClearCache}
            onGenerateReport={() => showToast("Audit report generated", "info")}
          />
        </div>
      </div>

      {/* Analytics */}
      <div className="mt-5 transition-all duration-300 hover:scale-[1.005]">
        <AnalyticsChart />
      </div>

      {/* System Status Footer */}
      <SystemStatusFooter />

      {/* Modals */}
      <RestartModal
        isOpen={restartModalOpen}
        onClose={() => setRestartModalOpen(false)}
        system={selectedSystem}
        onConfirm={confirmRestart}
      />

      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        system={selectedSystem}
        onConfirm={confirmBackup}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        notificationTitle={notificationTitle}
        setNotificationTitle={setNotificationTitle}
        notificationMessage={notificationMessage}
        setNotificationMessage={setNotificationMessage}
        notificationAudience={notificationAudience}
        setNotificationAudience={setNotificationAudience}
        onSend={sendNotification}
      />

      <ApproveClinicModal
        isOpen={approveClinicModalOpen}
        onClose={() => setApproveClinicModalOpen(false)}
        clinic={selectedClinic}
        onConfirm={confirmApproveClinic}
      />

      <RejectClinicModal
        isOpen={rejectClinicModalOpen}
        onClose={() => setRejectClinicModalOpen(false)}
        clinic={selectedClinic}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        onConfirm={confirmRejectClinic}
      />
    </div>
  );
};

export default SystemDashboard;
