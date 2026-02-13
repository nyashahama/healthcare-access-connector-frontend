import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { updatePassword, user } = useAuth();

  const isMounted = useRef(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    // Validation
    if (!formData.currentPassword.trim()) {
      showToast("Please enter your current password", "warning");
      return;
    }

    if (!formData.newPassword.trim()) {
      showToast("Please enter a new password", "warning");
      return;
    }

    if (formData.newPassword.length < 8) {
      showToast("New password must be at least 8 characters", "warning");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      showToast(
        "New password must contain uppercase, lowercase and numbers",
        "warning"
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("New passwords do not match", "warning");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      showToast(
        "New password must be different from current password",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      const passwordData = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      };

      const result = await updatePassword(user?._id, passwordData);

      if (!isMounted.current) return;

      if (result.success) {
        showToast("Password changed successfully!", "success");

        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Redirect after delay
        setTimeout(() => {
          if (isMounted.current) {
            navigate(-1); // Go back to previous page
          }
        }, 1500);
      } else {
        showToast(result.error || "Failed to change password", "error");
      }
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Change password error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4 dark:from-navy-900 dark:to-gray-900">
      {" "}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-brand-500 p-3">
            <MdHealthAndSafety className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Change Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Update your password for better security
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <FaLock className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-navy-700 dark:text-white">
              Security First
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Choose a strong password to protect your account
            </p>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <InputField
                variant="auth"
                label="Current Password"
                placeholder="Enter your current password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                type={showCurrentPassword ? "text" : "password"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-10 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <InputField
                variant="auth"
                label="New Password"
                placeholder="Create a strong password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                type={showNewPassword ? "text" : "password"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-10 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <InputField
                variant="auth"
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type={showConfirmPassword ? "text" : "password"}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-10 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="mb-6 mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <h4 className="mb-2 text-sm font-bold text-navy-700 dark:text-white">
              Password Requirements:
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    formData.newPassword.length >= 8
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                At least 8 characters
              </li>
              <li className="flex items-center">
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    /[a-z]/.test(formData.newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                At least one lowercase letter
              </li>
              <li className="flex items-center">
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    /[A-Z]/.test(formData.newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                At least one uppercase letter
              </li>
              <li className="flex items-center">
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    /\d/.test(formData.newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                At least one number
              </li>
            </ul>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={isLoading}
            className="linear w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Changing Password...
              </span>
            ) : (
              "Change Password"
            )}
          </button>

          {/* Back Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="text-sm text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Back to Profile
            </button>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start">
            <MdHealthAndSafety className="mr-2 h-5 w-5 text-red-500 dark:text-red-300" />
            <div>
              <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                Medical Emergency?
              </h4>
              <p className="mt-1 text-xs text-red-700 dark:text-red-400">
                Call <strong>10177</strong> or go to the nearest emergency room
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
