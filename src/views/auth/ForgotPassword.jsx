import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FaArrowLeft } from "react-icons/fa";
import {
  MdHealthAndSafety,
  MdSms,
  MdEmail,
  MdVerifiedUser,
} from "react-icons/md";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({
    identifier: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { requestPasswordReset, resetPassword, resendVerification } = useAuth();

  const isMounted = useRef(true);

  useEffect(() => {
    // Check for token in URL (email verification link)
    if (token) {
      setStep(3);
    }

    return () => {
      isMounted.current = false;
    };
  }, [token]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async () => {
    if (!formData.identifier.trim()) {
      showToast(
        method === "email"
          ? "Please enter your email address"
          : "Please enter your phone number",
        "warning"
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(formData.identifier);

      if (!isMounted.current) return;

      if (result.success) {
        setTimer(60);
        setStep(2);
        showToast(
          method === "email"
            ? `Reset link sent to ${formData.identifier}`
            : `OTP sent to ${formData.identifier}`,
          "success"
        );
      } else {
        showToast(result.error || "Failed to send reset code", "error");
      }
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Send code error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (!formData.identifier.trim()) {
      showToast("Please enter your email address", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resendVerification(formData.identifier);

      if (!isMounted.current) return;

      if (result.success) {
        setTimer(60);
        showToast("Verification code resent successfully", "success");
      } else {
        showToast(result.error || "Failed to resend code", "error");
      }
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Resend code error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
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
    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const resetData = {
        token: token || formData.otp,
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
        }, 1500);
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

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-brand-500 p-3">
            <MdHealthAndSafety className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            We'll help you get back into your account
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          {step === 1 && (
            <>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                  How would you like to reset?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose your preferred method
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMethod("email")}
                  disabled={isLoading}
                  className={`flex flex-col items-center rounded-xl p-4 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    method === "email"
                      ? "border-2 border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  <MdEmail className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Email</span>
                </button>

                <button
                  onClick={() => setMethod("sms")}
                  disabled={isLoading}
                  className={`flex flex-col items-center rounded-xl p-4 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    method === "sms"
                      ? "border-2 border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                  }`}
                >
                  <MdSms className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">SMS</span>
                </button>
              </div>

              <InputField
                variant="auth"
                label={method === "email" ? "Email Address" : "Phone Number"}
                placeholder={
                  method === "email" ? "your.email@example.com" : "071 234 5678"
                }
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleInputChange}
                type={method === "email" ? "email" : "tel"}
                extra="mb-6"
                disabled={isLoading}
              />

              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="linear w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                    >
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
                    Sending...
                  </span>
                ) : (
                  `Send ${method === "email" ? "Reset Link" : "OTP"}`
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                    <MdVerifiedUser className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                  Enter Verification Code
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {method === "email"
                    ? `Check your email for the 6-digit code`
                    : `Check your SMS for the 6-digit code`}
                </p>
              </div>

              <div className="mb-6">
                <InputField
                  variant="auth"
                  label="6-digit Code"
                  placeholder="123456"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  maxLength="6"
                  extra="mb-4"
                  disabled={isLoading}
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="text-sm text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaArrowLeft className="mr-2 inline h-3 w-3" />
                    Use different method
                  </button>

                  {timer > 0 ? (
                    <span className="text-sm text-gray-500">
                      Resend in {timer}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm text-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={isLoading || !formData.otp.trim()}
                className="linear w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Verify Code
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                  Create New Password
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
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                    >
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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}

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

export default ForgotPassword;
