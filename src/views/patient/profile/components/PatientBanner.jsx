import React, { useState } from "react";
import { FaUser, FaBaby, FaHeartbeat, FaNotesMedical } from "react-icons/fa";
import avatar from "assets/img/avatars/avatar11.png";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { MdEdit, MdSave, MdCameraAlt } from "react-icons/md";

const PatientBanner = () => {
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    title: "Patient & Mother of 2 • Johannesburg, Gauteng",
    stats: {
      children: 2,
      upcoming: 2,
      consultations: 12,
      healthScore: "Good",
    },
    avatar: avatar,
  });

  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    title: profile.title,
  });

  const handleEditClick = () => {
    setProfileForm({
      name: profile.name,
      title: profile.title,
    });
    setEditModalOpen(true);
  };

  const handleAvatarClick = () => {
    setAvatarModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const confirmEdit = () => {
    setProfile((prev) => ({
      ...prev,
      name: profileForm.name,
      title: profileForm.title,
    }));
    setEditModalOpen(false);
    showToast("Profile updated successfully!", "success");
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
        setAvatarModalOpen(false);
        showToast("Profile picture updated!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Title
              </label>
              <input
                type="text"
                value={profileForm.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Patient & Mother of 2 • Johannesburg, Gauteng"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmEdit}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Avatar Modal */}
      <Modal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        title="Change Profile Picture"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-navy-700">
              <img
                src={profile.avatar}
                alt="Current avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Upload a new profile picture
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <label
                htmlFor="avatar-upload"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700"
              >
                <MdCameraAlt className="h-5 w-5" />
                Upload New Photo
              </label>
            </div>
            <button className="w-full rounded-lg border border-red-300 bg-red-50 py-3 text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300">
              Remove Current Photo
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            Recommended: Square image, at least 400x400 pixels
          </div>
        </div>
      </Modal>

      <Card extra={"items-center w-full h-full p-[16px]"}>
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-pink-400 shadow-xl dark:border-navy-700">
              <img
                className="h-full w-full rounded-full"
                src={profile.avatar}
                alt="Patient"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600"
              >
                <MdCameraAlt className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex-grow text-center md:text-left">
            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
              {profile.name}
            </h4>
            <p className="text-base font-normal text-gray-600">
              {profile.title}
            </p>

            {/* Health Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center">
                  <FaBaby className="mr-2 text-brand-500" />
                  <p className="text-sm font-medium text-gray-600">Children</p>
                </div>
                <p className="text-xl font-bold text-navy-700 dark:text-white">
                  {profile.stats.children}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center">
                  <FaHeartbeat className="mr-2 text-green-500" />
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                </div>
                <p className="text-xl font-bold text-navy-700 dark:text-white">
                  {profile.stats.upcoming}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center">
                  <FaNotesMedical className="mr-2 text-purple-500" />
                  <p className="text-sm font-medium text-gray-600">
                    Consultations
                  </p>
                </div>
                <p className="text-xl font-bold text-navy-700 dark:text-white">
                  {profile.stats.consultations}
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-blue-500" />
                  <p className="text-sm font-medium text-gray-600">
                    Health Score
                  </p>
                </div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {profile.stats.healthScore}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex-shrink-0">
            <button
              onClick={handleEditClick}
              className="linear flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
            >
              <MdEdit className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default PatientBanner;
