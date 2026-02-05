import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";
import patientService from "api/services/patientService";

export default function SignIn() {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login, loading: authLoading } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!credentials.identifier.trim()) {
      showToast("Please enter your email or phone number", "warning");
      return;
    }

    if (!credentials.password.trim()) {
      showToast("Please enter your password", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(credentials);

      if (result.success) {
        showToast("Login successful!", "success");

        // Get user role
        const user = result.data?.user;
        if (user) {
          // Store remember me preference
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          } else {
            localStorage.removeItem("rememberMe");
          }

          // Check patient profile ONLY for patient role
          if (user.role === "patient") {
            try {
              const patientRes = await patientService.getPatientProfileByUserId(
                user.id
              );
              const completion =
                patientService.calculateProfileCompletion(patientRes);

              // If profile is less than 50% complete, redirect to complete profile
              if (completion < 50) {
                // Store where the user was trying to go (usually dashboard)
                localStorage.setItem(
                  "returnAfterProfile",
                  "/patient/dashboard"
                );
                navigate("/auth/complete-patient-profile");
                return;
              }

              // Profile is complete enough, go to dashboard
              navigate("/patient/dashboard");
              return;
            } catch (err) {
              // If 404 (no profile found), redirect to complete profile
              if (err.response?.status === 404) {
                localStorage.setItem(
                  "returnAfterProfile",
                  "/patient/dashboard"
                );
                navigate("/auth/complete-patient-profile");
                return;
              }
              // For other errors, still allow access to dashboard
              console.error("Error checking patient profile:", err);
              navigate("/patient/dashboard");
              return;
            }
          }

          // Redirect based on user role from backend for non-patient users
          const role = user.role;

          switch (role) {
            case "provider":
            case "doctor":
            case "nurse":
            case "clinic_admin":
              navigate("/provider/dashboard");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
            default:
              navigate("/patient/dashboard");
          }
        }
      } else {
        showToast(result.error || "Login failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth implementation
    showToast("Google login coming soon!", "info");
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2 text-4xl font-bold text-navy-700 dark:text-white">
          Welcome to HealthConnect
        </h4>
        <p className="mb-6 ml-1 text-base text-gray-600 dark:text-gray-300">
          Connecting healthcare with those who need it most
        </p>

        {/* SMS-Only Option */}
        <div className="mb-6 rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <p className="mb-2 text-sm font-medium text-navy-700 dark:text-white">
            No smartphone? Use SMS:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Text <span className="font-bold text-brand-500">HELP</span> to{" "}
            <span className="font-bold text-brand-500">12345</span> for free
            assistance
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">
            {" "}
            or continue with{" "}
          </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          disabled={isLoading || authLoading}
        >
          <FcGoogle className="h-5 w-5" />
          <span>Continue with Google</span>
        </button>

        <form onSubmit={handleSubmit}>
          {/* Email/Phone */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email or Phone*"
            placeholder="your.email@example.com or 0712345678"
            id="identifier"
            name="identifier"
            type="text"
            value={credentials.identifier}
            onChange={handleInputChange}
            disabled={isLoading || authLoading}
          />

          {/* Password with show/hide */}
          <div className="relative mb-3">
            <InputField
              variant="auth"
              label="Password*"
              placeholder="Min. 8 characters"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleInputChange}
              disabled={isLoading || authLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || authLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Checkbox and Forgot Password */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading || authLoading}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || authLoading}
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            {isLoading || authLoading ? (
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Registration Links */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <span className="text-sm font-medium text-navy-700 dark:text-gray-300">
              Need a patient account?
            </span>
            <Link
              to="/auth/sign-up/patient"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Register as Patient
            </Link>
          </div>

          <div className="text-center">
            <span className="text-sm font-medium text-navy-700 dark:text-gray-300">
              Healthcare provider?
            </span>
            <Link
              to="/auth/sign-up/provider"
              className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              Register Your Clinic
            </Link>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-6 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start">
            <svg
              className="mr-2 h-5 w-5 text-red-500 dark:text-red-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
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
}
