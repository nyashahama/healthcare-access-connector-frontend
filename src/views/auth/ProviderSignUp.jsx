import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";

const PROVIDER_ROLES = [
  {
    value: "clinic_admin",
    label: "Clinic Administrator",
    description: "Manage clinic operations, staff, and appointments",
    icon: "🏥",
  },
  {
    value: "provider_staff",
    label: "Healthcare Provider",
    description: "Doctor, nurse, or medical professional",
    icon: "👨‍⚕️",
  },
  {
    value: "caregiver",
    label: "Caregiver",
    description: "Professional caregiver or support staff",
    icon: "🤝",
  },
];

const ProviderSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    popiaConsent: false,
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register, resendVerification } = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    // Role validation
    if (!formData.role) {
      showToast("Please select your role", "warning");
      return false;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      showToast("Please enter your phone number", "warning");
      return false;
    }

    const phoneRegex = /^(?:(?:\+27|0)[\s-]?[1-9][\d\s-]{8,9})$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      showToast("Please enter a valid South African phone number", "warning");
      return false;
    }

    // Email validation (required for providers)
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "warning");
      return false;
    }

    // Password validation
    if (!formData.password.trim()) {
      showToast("Please enter a password", "warning");
      return false;
    }

    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters", "warning");
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      showToast(
        "Password must contain uppercase, lowercase and numbers",
        "warning"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return false;
    }

    // POPIA consent
    if (!formData.popiaConsent) {
      showToast("You must agree to the POPIA consent", "warning");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const registrationData = {
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        popiaConsent: formData.popiaConsent,
      };

      const result = await register(registrationData);

      if (result.success) {
        showToast(
          "Registration successful! Please check your email to verify your account.",
          "success"
        );
        setRegistrationComplete(true);
      } else {
        showToast(result.error || "Registration failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after registration
  if (registrationComplete) {
    return (
      <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-800">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <svg
                  className="h-10 w-10 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="mb-3 text-2xl font-bold text-navy-700 dark:text-white">
                Registration Successful!
              </h2>

              <p className="mb-6 text-gray-600 dark:text-gray-300">
                We've sent a verification email to{" "}
                <span className="font-semibold text-brand-500">
                  {formData.email}
                </span>
              </p>

              <div className="mb-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                  Next Steps:
                </h3>
                <ol className="space-y-2 text-left text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">1.</span>
                    <span>
                      Check your email inbox for the verification link
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">2.</span>
                    <span>
                      Click the verification link to activate your account
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">3.</span>
                    <span>Sign in with your credentials</span>
                  </li>
                  {formData.role === "clinic_admin" && (
                    <li className="flex items-start">
                      <span className="mr-2 font-bold">4.</span>
                      <span>
                        Complete your clinic registration and wait for admin
                        approval
                      </span>
                    </li>
                  )}
                </ol>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/auth/sign-in")}
                  className="w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600"
                >
                  Go to Sign In
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the email?{" "}
                  <button
                    onClick={async () => {
                      const result = await resendVerification(formData.email);
                      if (result.success) {
                        showToast("Verification email resent!", "success");
                      } else {
                        showToast("Failed to resend email", "error");
                      }
                    }}
                    className="font-medium text-brand-500 hover:text-brand-600"
                  >
                    Resend verification email
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Provider Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join the HealthConnect network
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                Select Your Role *
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                {PROVIDER_ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: role.value }))
                    }
                    disabled={isLoading}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      formData.role === role.value
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                        : "border-gray-200 hover:border-brand-300 dark:border-navy-700 dark:hover:border-brand-700"
                    } ${
                      isLoading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="mb-2 text-2xl">{role.icon}</div>
                    <div className="mb-1 font-semibold text-navy-700 dark:text-white">
                      {role.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {role.description}
                    </div>
                  </button>
                ))}
              </div>
              {formData.role === "clinic_admin" && (
                <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    📋 As a Clinic Administrator, you'll need to register your
                    clinic and wait for admin approval after email verification.
                  </p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Email */}
              <InputField
                variant="auth"
                label="Email Address *"
                placeholder="your.email@example.com"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                required
                disabled={isLoading}
              />

              {/* Phone */}
              <InputField
                variant="auth"
                label="Phone Number *"
                placeholder="071 234 5678"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Password */}
              <div className="relative">
                <InputField
                  variant="auth"
                  label="Password *"
                  placeholder="Min. 8 characters"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <InputField
                variant="auth"
                label="Confirm Password *"
                placeholder="Re-enter your password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type="password"
                required
                disabled={isLoading}
              />
            </div>

            {/* POPIA Consent */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="popiaConsent"
                  name="popiaConsent"
                  checked={formData.popiaConsent}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label htmlFor="popiaConsent" className="ml-3 text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    I agree to the POPIA (Protection of Personal Information
                    Act) consent *
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    I consent to HealthConnect collecting and processing my
                    personal and professional information for healthcare service
                    provision purposes, in compliance with POPIA regulations.
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="linear mt-4 w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                  Creating Account...
                </span>
              ) : (
                "Create Provider Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/auth/sign-in"
                className="font-medium text-brand-500 hover:text-brand-600"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Patient Registration Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Looking for patient registration?{" "}
              <Link
                to="/auth/sign-up/patient"
                className="font-medium text-brand-500 hover:text-brand-600"
              >
                Sign up as a patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSignUp;
