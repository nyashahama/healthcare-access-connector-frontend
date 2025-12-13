import React, { useState } from "react";
import {
  MdVerified,
  MdLocationOn,
  MdPhone,
  MdCalendarToday,
  MdEdit,
  MdCameraAlt,
} from "react-icons/md";
import { FaUsers, FaStar, FaClock } from "react-icons/fa";
import clinicLogo from "assets/img/profile/image1.png";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const ClinicBanner = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [clinicInfo, setClinicInfo] = useState({
    name: "Sunninghill Community Clinic",
    type: "Public Health Clinic",
    location: "123 Health St, Johannesburg",
    phone: "+27 11 123 4567",
    rating: 4.8,
    totalPatients: 1247,
    todayAppointments: 18,
    waitTime: "15 min",
    onlineStaff: 3,
  });

  const { showToast } = useToast();

  const handleSaveChanges = () => {
    console.log("Saving clinic profile:", clinicInfo);
    setEditModalOpen(false);
    showToast("Clinic profile updated successfully!", "success");
  };

  const handleLogoUpload = () => {
    console.log("Uploading new logo");
    setLogoModalOpen(false);
    showToast("Clinic logo updated successfully!", "success");
  };

  return (
    <Card extra={"w-full h-full p-[16px]"}>
      {/* Edit Clinic Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Clinic Profile"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clinic Name *
            </label>
            <input
              type="text"
              value={clinicInfo.name}
              onChange={(e) =>
                setClinicInfo({ ...clinicInfo, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter clinic name"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Type *
              </label>
              <select
                value={clinicInfo.type}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, type: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Public Health Clinic">
                  Public Health Clinic
                </option>
                <option value="Private Clinic">Private Clinic</option>
                <option value="Community Health Center">
                  Community Health Center
                </option>
                <option value="Specialist Clinic">Specialist Clinic</option>
                <option value="Mobile Clinic">Mobile Clinic</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={clinicInfo.phone}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, phone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location *
            </label>
            <input
              type="text"
              value={clinicInfo.location}
              onChange={(e) =>
                setClinicInfo({ ...clinicInfo, location: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter full address"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Upload Logo Modal */}
      <Modal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        title="Upload Clinic Logo"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-dashed border-gray-300">
              <div className="text-center">
                <MdCameraAlt className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Upload Logo</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Recommended: 300x300px PNG or JPG
            </p>
          </div>

          <div className="flex justify-center">
            <button className="rounded-lg bg-gray-100 px-6 py-3 font-medium hover:bg-gray-200 dark:bg-navy-700">
              Choose File
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setLogoModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleLogoUpload}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Upload Logo
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Clinic Logo & Verification */}
        <div className="relative flex-shrink-0">
          <div
            onClick={() => setLogoModalOpen(true)}
            className="relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-2xl border-4 border-white bg-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-navy-700 dark:bg-navy-700"
          >
            <img
              className="h-full w-full rounded-2xl"
              src={clinicLogo}
              alt="Clinic"
            />
            <div className="absolute bottom-0 right-0 rounded-full bg-brand-500 p-1">
              <MdCameraAlt className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="absolute -right-2 -top-2 flex items-center rounded-full bg-green-100 px-2 py-1 dark:bg-green-900">
            <MdVerified className="mr-1 text-green-600 dark:text-green-400" />
            <span className="text-xs font-bold text-green-700 dark:text-green-300">
              Verified
            </span>
          </div>
        </div>

        {/* Clinic Info */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                {clinicInfo.name}
              </h4>
              <div className="mt-2 flex items-center justify-center md:justify-start">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-300">
                  {clinicInfo.type}
                </span>
                <div className="ml-3 flex items-center">
                  <FaStar className="mr-1 text-yellow-500" />
                  <span className="font-bold text-navy-700 dark:text-white">
                    {clinicInfo.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-600">
                    (247 reviews)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditModalOpen(true)}
              className="linear mt-3 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:scale-105 hover:bg-brand-600 md:mt-0"
            >
              Edit Clinic Profile
            </button>
          </div>

          {/* Contact & Location */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center justify-center md:justify-start">
              <MdLocationOn className="mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  {clinicInfo.location}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start">
              <MdPhone className="mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  {clinicInfo.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaUsers className="mr-2 text-blue-500" />
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {clinicInfo.totalPatients.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <MdCalendarToday className="mr-2 text-brand-500" />
                <p className="text-sm font-medium text-gray-600">Today</p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {clinicInfo.todayAppointments}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaClock className="mr-2 text-green-500" />
                <p className="text-sm font-medium text-gray-600">Avg. Wait</p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {clinicInfo.waitTime}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <MdVerified className="mr-2 text-purple-500" />
                <p className="text-sm font-medium text-gray-600">
                  Staff Online
                </p>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {clinicInfo.onlineStaff}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClinicBanner;
