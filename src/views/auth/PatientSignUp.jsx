import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";

const PatientSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(() => {
    // Check sessionStorage on initial mount
    return sessionStorage.getItem("patientRegistrationPending") === "true";
  });
  const [formData, setFormData] = useState({
    phone: "",
    email: sessionStorage.getItem("registeredEmail") || "",
    password: "",
    confirmPassword: "",
    popiaConsent: false,
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register, resendVerification } = useAuth();

  // Debug mount/unmount
  useEffect(() => {
    console.log("PatientSignUp mounted");
    return () => console.log("PatientSignUp unmounted");
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
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

    // Email validation (required)
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
        role: "patient",
        popiaConsent: formData.popiaConsent,
      };

      const result = await register(registrationData);

      if (result.success) {
        // Store in sessionStorage to survive unmounts
        sessionStorage.setItem("patientRegistrationPending", "true");
        sessionStorage.setItem("registeredEmail", formData.email);

        setRegistrationComplete(true);
        showToast(
          "Registration successful! Please check your email to verify your account.",
          "success"
        );
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

  // Clear sessionStorage when navigating away from success screen
  const handleGoToSignIn = () => {
    sessionStorage.removeItem("patientRegistrationPending");
    sessionStorage.removeItem("registeredEmail");
    navigate("/auth/sign-in");
  };

  // Show success message after registration
  if (registrationComplete) {
    const registeredEmail =
      sessionStorage.getItem("registeredEmail") || formData.email;

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
                  {registeredEmail}
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
                </ol>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoToSignIn}
                  className="w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600"
                >
                  Go to Sign In
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Didn't receive the email?{" "}
                  <button
                    onClick={async () => {
                      const result = await resendVerification(registeredEmail);
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
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-navy-700 dark:text-white">
            Patient Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get started in under 2 minutes
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email - Required */}
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

            {/* Phone (Required) */}
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
                    personal information for healthcare purposes only, in
                    compliance with POPIA regulations.
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
                "Create Patient Account"
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
};

export default PatientSignUp;
