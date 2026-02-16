import React, { useState } from "react";
import { MdRefresh, MdDownload, MdAdd } from "react-icons/md";
import { useToast } from "hooks/useToast";

// Components
import QueueStats from "./components/QueueStats";
import QueueFilters from "./components/QueueFilters";
import QueueControls from "./components/QueueControls";
import PatientQueue from "../components/PatientQueue"; // existing component
import {
  AddPatientModal,
  ClearQueueModal,
  CallNextModal,
  MarkAllSeenModal,
} from "./components/QueueModals";

const Queue = () => {
  const { showToast } = useToast();

  // State
  const [queueStats, setQueueStats] = useState({
    totalWaiting: 12,
    avgWaitTime: "18 min",
    completedToday: 24,
  });

  const [queueFilters, setQueueFilters] = useState([
    { label: "All", count: 12, active: true },
    { label: "High Priority", count: 3, active: false },
    { label: "Telemedicine", count: 4, active: false },
    { label: "Walk-ins", count: 5, active: false },
    { label: "My Patients", count: 6, active: false },
  ]);

  const [settings, setSettings] = useState({
    autoAssign: true,
    sendUpdates: true,
  });

  const [sortBy, setSortBy] = useState("priority");

  // Modal states
  const [modals, setModals] = useState({
    addPatient: false,
    clearQueue: false,
    callNext: false,
    markAllSeen: false,
  });

  // Handlers
  const handleFilterClick = (index) => {
    setQueueFilters((prev) =>
      prev.map((filter, i) => ({
        ...filter,
        active: i === index,
      }))
    );
  };

  const toggleSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    showToast(`Setting updated`, "success");
  };

  const refreshQueue = () => {
    setQueueStats({
      totalWaiting: Math.floor(Math.random() * 20) + 1,
      avgWaitTime: `${Math.floor(Math.random() * 30) + 5} min`,
      completedToday: Math.floor(Math.random() * 30) + 10,
    });
    showToast("Queue data refreshed!", "success");
  };

  const exportQueue = () => {
    showToast("Queue exported successfully!", "success");
  };

  // Modal confirm handlers
  const handleAddPatient = (patientData) => {
    console.log("Adding patient:", patientData);
    setModals((prev) => ({ ...prev, addPatient: false }));
    showToast(`${patientData.name} added to queue!`, "success");
  };

  const handleClearQueue = () => {
    setModals((prev) => ({ ...prev, clearQueue: false }));
    showToast("Queue cleared successfully!", "success");
  };

  const handleCallNext = () => {
    setModals((prev) => ({ ...prev, callNext: false }));
    showToast("Next patient called!", "success");
  };

  const handleMarkAllSeen = () => {
    setModals((prev) => ({ ...prev, markAllSeen: false }));
    showToast("All patients marked as seen!", "success");
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Patient Queue
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and monitor patient waiting times
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshQueue}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
          <button
            onClick={exportQueue}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
          >
            <MdDownload className="mr-2" />
            Export List
          </button>
          <button
            onClick={() => setModals((prev) => ({ ...prev, addPatient: true }))}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
          >
            <MdAdd className="mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <QueueStats stats={queueStats} />

      {/* Queue Filters */}
      <QueueFilters
        filters={queueFilters}
        onFilterClick={handleFilterClick}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Queue */}
        <div className="lg:col-span-2">
          <PatientQueue />
        </div>

        {/* Queue Controls */}
        <QueueControls
          stats={queueStats}
          settings={settings}
          onToggleSetting={toggleSetting}
          onCallNext={() => setModals((prev) => ({ ...prev, callNext: true }))}
          onMarkAllSeen={() =>
            setModals((prev) => ({ ...prev, markAllSeen: true }))
          }
          onClearQueue={() =>
            setModals((prev) => ({ ...prev, clearQueue: true }))
          }
        />
      </div>

      {/* Modals */}
      <AddPatientModal
        isOpen={modals.addPatient}
        onClose={() => setModals((prev) => ({ ...prev, addPatient: false }))}
        onConfirm={handleAddPatient}
      />

      <ClearQueueModal
        isOpen={modals.clearQueue}
        onClose={() => setModals((prev) => ({ ...prev, clearQueue: false }))}
        onConfirm={handleClearQueue}
      />

      <CallNextModal
        isOpen={modals.callNext}
        onClose={() => setModals((prev) => ({ ...prev, callNext: false }))}
        onConfirm={handleCallNext}
      />

      <MarkAllSeenModal
        isOpen={modals.markAllSeen}
        onClose={() => setModals((prev) => ({ ...prev, markAllSeen: false }))}
        onConfirm={handleMarkAllSeen}
      />
    </div>
  );
};

export default Queue;
