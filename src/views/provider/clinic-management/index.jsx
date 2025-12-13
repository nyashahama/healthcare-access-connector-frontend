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
import { useToast } from "hooks/useToast";
import Modal from "components/modal/Modal";

const ClinicManagement = () => {
  const { showToast } = useToast();
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

  // Modal states
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [editClinicModalOpen, setEditClinicModalOpen] = useState(false);
  const [generateReportModalOpen, setGenerateReportModalOpen] = useState(false);
  const [updateHoursModalOpen, setUpdateHoursModalOpen] = useState(false);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);

  const [newService, setNewService] = useState({
    name: "",
    category: "general",
    duration: "30",
    price: "",
    description: "",
  });

  const [reportForm, setReportForm] = useState({
    type: "monthly",
    startDate: "",
    endDate: "",
    include: ["revenue", "appointments", "patients"],
  });

  const [hoursForm, setHoursForm] = useState({
    monday: { open: "08:00", close: "18:00" },
    tuesday: { open: "08:00", close: "18:00" },
    wednesday: { open: "08:00", close: "18:00" },
    thursday: { open: "08:00", close: "18:00" },
    friday: { open: "08:00", close: "18:00" },
    saturday: { open: "09:00", close: "13:00" },
    sunday: { open: "", close: "" },
  });

  const handleAddService = () => {
    if (!newService.name || !newService.price) {
      showToast("Please fill in required fields", "error");
      return;
    }

    console.log("Adding service:", newService);
    setAddServiceModalOpen(false);
    showToast(`Service "${newService.name}" added successfully!`, "success");

    // Reset form
    setNewService({
      name: "",
      category: "general",
      duration: "30",
      price: "",
      description: "",
    });
  };

  const handleGenerateReport = () => {
    console.log("Generating report:", reportForm);
    setGenerateReportModalOpen(false);
    showToast("Report generated successfully!", "success");
  };

  const handleUpdateHours = () => {
    console.log("Updating hours:", hoursForm);
    setUpdateHoursModalOpen(false);
    showToast("Clinic hours updated successfully!", "success");
  };

  return (
    <div className="h-full">
      {/* Add Service Modal */}
      <Modal
        isOpen={addServiceModalOpen}
        onClose={() => setAddServiceModalOpen(false)}
        title="Add New Service"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Name *
              </label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Vaccination, Consultation"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                value={newService.category}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="general">General</option>
                <option value="specialist">Specialist</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="preventive">Preventive</option>
                <option value="surgical">Surgical</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration (minutes)
              </label>
              <select
                value={newService.duration}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price (R) *
              </label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) =>
                  setNewService((prev) => ({ ...prev, price: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={newService.description}
                onChange={(e) =>
                  setNewService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Describe the service..."
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddServiceModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddService}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Add Service
            </button>
          </div>
        </div>
      </Modal>

      {/* Generate Report Modal */}
      <Modal
        isOpen={generateReportModalOpen}
        onClose={() => setGenerateReportModalOpen(false)}
        title="Generate Report"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type *
            </label>
            <select
              value={reportForm.type}
              onChange={(e) =>
                setReportForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {reportForm.type === "custom" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={reportForm.startDate}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date *
                </label>
                <input
                  type="date"
                  value={reportForm.endDate}
                  onChange={(e) =>
                    setReportForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  min={reportForm.startDate}
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Include in Report
            </label>
            <div className="space-y-2">
              {["revenue", "appointments", "patients", "services", "staff"].map(
                (item) => (
                  <label key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reportForm.include.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReportForm((prev) => ({
                            ...prev,
                            include: [...prev.include, item],
                          }));
                        } else {
                          setReportForm((prev) => ({
                            ...prev,
                            include: prev.include.filter((i) => i !== item),
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm capitalize">{item}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setGenerateReportModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateReport}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Generate Report
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Hours Modal */}
      <Modal
        isOpen={updateHoursModalOpen}
        onClose={() => setUpdateHoursModalOpen(false)}
        title="Update Clinic Hours"
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            {Object.entries(hoursForm).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="w-24 capitalize">{day}</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) =>
                      setHoursForm((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], open: e.target.value },
                      }))
                    }
                    className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) =>
                      setHoursForm((prev) => ({
                        ...prev,
                        [day]: { ...prev[day], close: e.target.value },
                      }))
                    }
                    className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                  />
                  <label className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={!hours.open && !hours.close}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setHoursForm((prev) => ({
                            ...prev,
                            [day]: { open: "", close: "" },
                          }));
                        } else {
                          setHoursForm((prev) => ({
                            ...prev,
                            [day]: { open: "08:00", close: "18:00" },
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm">Closed</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setUpdateHoursModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateHours}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Update Hours
            </button>
          </div>
        </div>
      </Modal>

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

        <div>
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => setAddStaffModalOpen(true)}
                className="flex w-full items-center justify-between rounded-lg bg-brand-50 p-3 text-left hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50"
              >
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

              <button
                onClick={() => setUpdateHoursModalOpen(true)}
                className="flex w-full items-center justify-between rounded-lg bg-green-50 p-3 text-left hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50"
              >
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

              <button
                onClick={() => setGenerateReportModalOpen(true)}
                className="flex w-full items-center justify-between rounded-lg bg-purple-50 p-3 text-left hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
              >
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

              <button
                onClick={() => setAddServiceModalOpen(true)}
                className="flex w-full items-center justify-between rounded-lg bg-blue-50 p-3 text-left hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
              >
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
        </div>
      </div>
    </div>
  );
};

export default ClinicManagement;
