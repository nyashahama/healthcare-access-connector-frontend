import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
  MdVisibility,
  MdLocationOn,
  MdVerified,
  MdPendingActions,
  MdWarning,
} from "react-icons/md";
import { FaFileMedical, FaClinicMedical } from "react-icons/fa";
import Card from "components/card";

const ClinicVerification = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const verificationStats = [
    {
      title: "Pending Review",
      count: "8",
      icon: <MdPendingActions className="h-6 w-6 text-yellow-500" />,
      color: "yellow",
      trend: "+2 this week",
    },
    {
      title: "Approved This Month",
      count: "24",
      icon: <MdCheckCircle className="h-6 w-6 text-green-500" />,
      color: "green",
      trend: "+15%",
    },
    {
      title: "Rejected",
      count: "3",
      icon: <MdCancel className="h-6 w-6 text-red-500" />,
      color: "red",
      trend: "-1 this month",
    },
    {
      title: "Total Verified",
      count: "247",
      icon: <MdVerified className="h-6 w-6 text-blue-500" />,
      color: "blue",
      trend: "+12%",
    },
  ];

  const pendingClinics = [
    {
      id: 1,
      name: "Sunrise Medical Center",
      location: "Johannesburg, Gauteng",
      type: "Private Clinic",
      submitted: "2024-01-15",
      documents: [
        { name: "Registration Certificate", verified: true },
        { name: "Medical License", verified: true },
        { name: "Facility Photos", verified: false },
      ],
      services: ["Pediatrics", "Vaccinations", "Emergency Care"],
      contact: "+27 11 234 5678",
      status: "pending",
    },
    {
      id: 2,
      name: "Rural Health Outreach Clinic",
      location: "Limpopo Province",
      type: "NGO Clinic",
      submitted: "2024-01-14",
      documents: [
        { name: "NGO Certificate", verified: true },
        { name: "Facility Photos", verified: true },
        { name: "Staff Credentials", verified: false },
      ],
      services: ["Primary Care", "Maternal Health", "Nutrition"],
      contact: "+27 15 345 6789",
      status: "pending",
    },
    {
      id: 3,
      name: "City Pediatrics Specialists",
      location: "Cape Town, Western Cape",
      type: "Specialist Clinic",
      submitted: "2024-01-13",
      documents: [
        { name: "Specialist License", verified: true },
        { name: "Facility Photos", verified: true },
        { name: "Equipment List", verified: true },
      ],
      services: ["Pediatric Care", "Vaccinations", "Development Checks"],
      contact: "+27 21 456 7890",
      status: "pending",
    },
    {
      id: 4,
      name: "Community Wellness Center",
      location: "Durban, KwaZulu-Natal",
      type: "Public Clinic",
      submitted: "2024-01-12",
      documents: [
        { name: "Government Certificate", verified: true },
        { name: "Facility Photos", verified: false },
        { name: "Service Capacity", verified: false },
      ],
      services: ["HIV Testing", "TB Treatment", "Chronic Care"],
      contact: "+27 31 567 8901",
      status: "pending",
    },
    {
      id: 5,
      name: "Mobile Health Unit #3",
      location: "Eastern Cape",
      type: "Mobile Clinic",
      submitted: "2024-01-11",
      documents: [
        { name: "Vehicle Registration", verified: true },
        { name: "Equipment List", verified: true },
        { name: "Route Schedule", verified: false },
      ],
      services: ["Vaccinations", "Health Screenings", "Emergency"],
      contact: "+27 43 678 9012",
      status: "pending",
    },
  ];

  const verificationHistory = [
    {
      id: 101,
      name: "Hillbrow Community Clinic",
      location: "Johannesburg, Gauteng",
      type: "Public Clinic",
      verifiedDate: "2024-01-10",
      verifiedBy: "Dr. Sarah Johnson",
      status: "approved",
    },
    {
      id: 102,
      name: "Khayelitsha Health Center",
      location: "Cape Town, WC",
      type: "Public Clinic",
      verifiedDate: "2024-01-09",
      verifiedBy: "Dr. Michael Chen",
      status: "approved",
    },
    {
      id: 103,
      name: "Alexandra Mobile Unit",
      location: "Alexandra, Gauteng",
      type: "Mobile Clinic",
      verifiedDate: "2024-01-08",
      verifiedBy: "Dr. Sarah Johnson",
      status: "approved",
    },
    {
      id: 104,
      name: "Soweto Private Practice",
      location: "Soweto, Gauteng",
      type: "Private Clinic",
      verifiedDate: "2024-01-07",
      verifiedBy: "Dr. James Wilson",
      status: "rejected",
      rejectionReason: "Incomplete documentation",
    },
  ];

  const handleApprove = (clinicId) => {
    console.log(`Approving clinic ${clinicId}`);
    // API call to approve clinic
  };

  const handleReject = (clinicId) => {
    console.log(`Rejecting clinic ${clinicId}`);
    // API call to reject clinic
  };

  const handleViewDetails = (clinicId) => {
    console.log(`Viewing details for clinic ${clinicId}`);
    // Navigate to clinic details
  };

  const DocumentStatus = ({ documents }) => {
    const verifiedCount = documents.filter((doc) => doc.verified).length;
    const totalCount = documents.length;

    return (
      <div className="flex items-center">
        <span
          className={`mr-2 font-bold ${
            verifiedCount === totalCount
              ? "text-green-500"
              : verifiedCount > totalCount / 2
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {verifiedCount}/{totalCount}
        </span>
        <div className="flex">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`ml-1 h-2 w-2 rounded-full ${
                doc.verified ? "bg-green-500" : "bg-red-500"
              }`}
              title={doc.name}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Clinic Verification Portal
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Review and verify healthcare facility registrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700">
            <FaClinicMedical className="mr-2 h-4 w-4" />
            Bulk Import
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {verificationStats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl border border-gray-200 p-4 dark:border-gray-700 ${
              stat.color === "yellow"
                ? "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10"
                : stat.color === "green"
                ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
                : stat.color === "red"
                ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"
                : "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.title}
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {stat.count}
                </div>
              </div>
              <div className="rounded-full bg-white p-3 dark:bg-navy-700">
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="mb-6 rounded-xl bg-white p-4 dark:bg-navy-800">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clinics by name, location, or type..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {["pending", "approved", "rejected", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                  selectedTab === tab
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pending Verification List */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                  Pending Verification
                </h4>
                <p className="text-sm text-gray-600">
                  {pendingClinics.length} clinics awaiting review
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Sort by:{" "}
                <select className="bg-transparent ml-2 rounded border px-2 py-1">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Location</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {pendingClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="rounded-lg border border-gray-200 p-4 hover:border-brand-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                              {clinic.name}
                            </h5>
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300">
                              {clinic.type}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <MdLocationOn className="mr-2 h-4 w-4" />
                            {clinic.location}
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <FaFileMedical className="mr-2 h-4 w-4 text-gray-400" />
                            <DocumentStatus documents={clinic.documents} />
                            <span className="ml-2 text-gray-500">
                              Documents
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Submitted: {clinic.submitted}
                          </div>
                          <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {clinic.contact}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {clinic.services.map((service, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                    <button
                      onClick={() => handleViewDetails(clinic.id)}
                      className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                    >
                      <MdVisibility className="mr-2 h-4 w-4" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleReject(clinic.id)}
                      className="flex items-center rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                    >
                      <MdCancel className="mr-2 h-4 w-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(clinic.id)}
                      className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                    >
                      <MdCheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Verification History and Quick Actions */}
        <div className="space-y-6">
          {/* Verification History */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Recent Verifications
            </h4>
            <div className="space-y-4">
              {verificationHistory.map((clinic) => (
                <div
                  key={clinic.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-navy-700 dark:text-white">
                        {clinic.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {clinic.location}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        clinic.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {clinic.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Verified {clinic.verifiedDate} by {clinic.verifiedBy}
                  </div>
                  {clinic.rejectionReason && (
                    <div className="mt-2 flex items-start text-xs text-red-600 dark:text-red-400">
                      <MdWarning className="mr-1 mt-0.5 h-3 w-3" />
                      {clinic.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
              View All History →
            </button>
          </Card>

          {/* Quick Verification Guidelines */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              📋 Verification Guidelines
            </h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="mr-3 rounded-full bg-green-100 p-1 dark:bg-green-900">
                  <MdCheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Required Documents
                  </div>
                  <div className="text-xs text-gray-500">
                    Registration certificate, medical license, facility photos
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 rounded-full bg-yellow-100 p-1 dark:bg-yellow-900">
                  <MdWarning className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Common Issues
                  </div>
                  <div className="text-xs text-gray-500">
                    Blurry photos, expired licenses, incomplete forms
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                  <MdVerified className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority Clinics
                  </div>
                  <div className="text-xs text-gray-500">
                    Rural areas, pediatric services, emergency care
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Bulk Actions */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              ⚡ Bulk Actions
            </h4>
            <div className="space-y-3">
              <button className="w-full rounded-lg bg-brand-50 py-3 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300">
                Approve All Complete Applications
              </button>
              <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
                Request Missing Documents
              </button>
              <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400">
                Export Verification Report
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
        <p>
          ⚠️ <strong>Important:</strong> Clinic verification typically takes 2-3
          business days. Urgent requests can be expedited via priority queue.
        </p>
      </div>
    </div>
  );
};

export default ClinicVerification;
