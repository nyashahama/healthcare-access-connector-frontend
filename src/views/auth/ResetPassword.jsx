import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { MdHealthAndSafety, MdLock, MdCheckCircle } from "react-icons/md";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { resetPassword } = useAuth();

  const isMounted = useRef(true);

  useEffect(() => {
    // Validate token on mount
    if (token) {
      // In a real app, you might want to validate the token with an API call
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
      showToast("Invalid reset link", "error");
    }

    return () => {
      isMounted.current = false;
    };
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async () => {
    if (!formData.newPassword.trim()) {
      showToast("Please enter a new password", "warning");
      return;
    }
    if (formData.newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "warning");
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      showToast(
        "Password must contain uppercase, lowercase and numbers",
        "warning"
      );
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const resetData = {
        token: token,
        new_password: formData.newPassword,
      };

      const result = await resetPassword(resetData);

      if (!isMounted.current) return;

      if (result.success) {
        showToast("Password reset successfully!", "success");

        setTimeout(() => {
          if (isMounted.current) {
            navigate("/auth/sign-in");
          }
        }, 2000);
      } else {
        showToast(result.error || "Password reset failed", "error");
      }
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Reset password error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  if (isValidToken === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-r-transparent h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500"></div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <MdHealthAndSafety className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-3 text-2xl font-bold text-red-600">
            Invalid Reset Link
          </h1>
          <p className="mb-6 text-gray-600">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/auth/forgot-password"
            className="inline-block rounded-xl bg-brand-500 px-6 py-3 text-white hover:bg-brand-600"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-brand-500 p-3">
            <MdLock className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Set New Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create a new password for your account
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <MdCheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
          </div>

          <div className="mb-6 text-center">
            <h3 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
              Almost Done!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your new password below
            </p>
          </div>

          <div className="space-y-4">
            <InputField
              variant="auth"
              label="New Password"
              placeholder="Create a strong password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              type="password"
              disabled={isLoading}
            />

            <InputField
              variant="auth"
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              type="password"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="linear mt-6 w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                to="/auth/sign-in"
                className="font-medium text-brand-500 hover:text-brand-600"
              >
                Sign in
              </Link>
            </p>
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

export default ResetPassword;
