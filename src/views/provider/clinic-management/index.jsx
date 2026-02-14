import React, { useState } from "react";
import {
  MdSettings,
  MdBusiness,
  MdPeople,
  MdCalendarToday,
  MdAnalytics,
  MdSecurity,
} from "react-icons/md";
import { useToast } from "hooks/useToast";
import Card from "components/card";
import ClinicInformation from "../profile/components/ClinicInformation";
import ClinicBanner from "../profile/components/ClinicBanner";
import OperatingHours from "../profile/components/OperatingHours";
import MedicalStaff from "../profile/components/MedicalStaff";
import Credentials from "../profile/components/Credentials";
import ServicesOffered from "../profile/components/ServicesOffered";
import AppointmentSettings from "../profile/components/AppointmentSettings";
import PerformanceMetrics from "../profile/components/PerformanceMetrics";
import ClinicManagementHeader from "./ClinicManagementHeader";
import ClinicManagementTabs from "./ClinicManagementTabs";
import ClinicManagementStats from "./ClinicManagementStats";
import ClinicQuickActions from "./ClinicQuickActions";
import AddServiceModal from "./AddServiceModal";
import GenerateReportModal from "./GenerateReportModal";
import UpdateHoursModal from "./UpdateHoursModal";
import AddStaffModal from "./AddStaffModal";

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

  const handleAddStaff = (staffData) => {
    console.log("Adding staff:", staffData);
    setAddStaffModalOpen(false);
    showToast("Staff member added successfully!", "success");
  };

  return (
    <div className="h-full">
      {/* Modals */}
      <AddServiceModal
        isOpen={addServiceModalOpen}
        onClose={() => setAddServiceModalOpen(false)}
        newService={newService}
        setNewService={setNewService}
        onConfirm={handleAddService}
      />
      <GenerateReportModal
        isOpen={generateReportModalOpen}
        onClose={() => setGenerateReportModalOpen(false)}
        reportForm={reportForm}
        setReportForm={setReportForm}
        onConfirm={handleGenerateReport}
      />
      <UpdateHoursModal
        isOpen={updateHoursModalOpen}
        onClose={() => setUpdateHoursModalOpen(false)}
        hoursForm={hoursForm}
        setHoursForm={setHoursForm}
        onConfirm={handleUpdateHours}
      />
      <AddStaffModal
        isOpen={addStaffModalOpen}
        onClose={() => setAddStaffModalOpen(false)}
        onConfirm={handleAddStaff}
      />

      {/* Header */}
      <ClinicManagementHeader />

      {/* Clinic Banner */}
      <div className="mb-6">
        <ClinicBanner />
      </div>

      {/* Tabs */}
      <ClinicManagementTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Stats */}
      <ClinicManagementStats stats={managementStats} />

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
                            defaultChecked
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

        {/* Right Column - Quick Actions */}
        <div>
          <ClinicQuickActions
            onAddStaff={() => setAddStaffModalOpen(true)}
            onUpdateHours={() => setUpdateHoursModalOpen(true)}
            onGenerateReport={() => setGenerateReportModalOpen(true)}
            onAddService={() => setAddServiceModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicManagement;
