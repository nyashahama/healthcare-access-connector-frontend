import React, { useState, useEffect } from "react";
import {
  MdPeople,
} from "react-icons/md";
import {
  FaClinicMedical,
  FaServer,
  FaDatabase,
} from "react-icons/fa";
import SystemHealth from "../components/SystemHealth";
import RegistrationQueue from "../components/RegistrationQueue";
import AnalyticsChart from "../components/AnalyticsChart";
import { useToast } from "hooks/useToast";
import apiClient from "api/apiClient";

// Component imports
import StatsWidgets from "./components/StatsWidgets";
import QuickActionsPanel from "./components/QuickActionsPanel";
import SystemAlertsPanel from "./components/SystemAlertsPanel";
import PendingActionsCard from "./components/PendingActionsCard";
import SMSCreditsCard from "./components/SMSCreditsCard";
import QuickActionsButtons from "./components/QuickActionsButtons";
import SystemStatusFooter from "./components/SystemStatusFooter";
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
  const { showToast } = useToast();

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

  // Live stats state
  const [liveStats, setLiveStats] = useState({
    totalClinics: 0,
    activeUsers: 0,
    systemStatus: "loading",
    systemHealthy: true,
    statsLoading: true,
  });

  const [systemAlerts, setSystemAlerts] = useState([]);

  // Fetch live stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clinicsRes, usersRes, healthRes] = await Promise.all([
          apiClient.get("/api/v1/providers/clinics?limit=1"),
          apiClient.get("/api/v1/users/count"),
          fetch("http://localhost:8080/health").then(r => r.json()),
        ]);

        const clinicCount = clinicsRes.data?.count || 0;
        const userCount = usersRes.data?.count || 0;
        const healthStatus = healthRes?.status === "healthy";
        const services = healthRes?.services || {};

        const healthyServices = Object.values(services).filter(s => s === "healthy").length;
        const totalServices = Object.values(services).length;
        const healthPercent = totalServices > 0 ? Math.round((healthyServices / totalServices) * 100) : 0;

        setLiveStats({
          totalClinics: clinicCount,
          activeUsers: userCount,
          systemStatus: healthStatus ? "healthy" : "degraded",
          systemHealthy: healthStatus,
          healthyServices,
          totalServices,
          healthPercent,
          statsLoading: false,
        });

        // Build alerts from health data
        const alerts = [];
        Object.entries(services).forEach(([name, status]) => {
          if (status !== "healthy" && status !== "disabled") {
            alerts.push({
              id: name,
              system: name.charAt(0).toUpperCase() + name.slice(1),
              status: status === "healthy" ? "success" : "error",
              message: `Service status: ${status}`,
              timestamp: "Now",
              severity: "high",
            });
          }
        });
        setSystemAlerts(alerts);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setLiveStats(prev => ({ ...prev, statsLoading: false, systemStatus: "unknown" }));
      }
    };

    fetchStats();
  }, []);

  // Stats widget data from live API
  const statsData = {
    totalClinics: {
      icon: <FaClinicMedical className="h-7 w-7" />,
      title: "Total Clinics",
      value: liveStats.statsLoading ? "..." : String(liveStats.totalClinics),
      trend: "Registered clinics",
    },
    activeUsers: {
      icon: <MdPeople className="h-7 w-7" />,
      title: "Active Users",
      value: liveStats.statsLoading ? "..." : String(liveStats.activeUsers),
      trend: "Total users",
    },
    systemHealth: {
      icon: <FaServer className="h-7 w-7" />,
      title: "System Health",
      value: liveStats.statsLoading ? "..." : `${liveStats.healthPercent}%`,
      trend: liveStats.statsLoading ? "Loading..." : `${liveStats.healthyServices}/${liveStats.totalServices} services healthy`,
    },
    smsBalance: {
      icon: <FaDatabase className="h-7 w-7" />,
      title: "System Status",
      value: liveStats.systemStatus === "healthy" ? "Healthy" : liveStats.systemStatus === "loading" ? "..." : "Degraded",
      trend: liveStats.systemStatus === "healthy" ? "All systems operational" : "Check alerts",
    },
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
    if (!selectedClinic) return;
    console.log(`Approving clinic: ${selectedClinic.name}`);
    setApproveClinicModalOpen(false);
    showToast(
      `Clinic "${selectedClinic.name}" approved successfully`,
      "success"
    );
  };

  const confirmRejectClinic = () => {
    if (!selectedClinic) return;
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
