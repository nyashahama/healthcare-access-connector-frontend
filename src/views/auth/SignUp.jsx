import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import InputField from "components/fields/InputField";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaUserInjured,
  FaUserMd,
  FaUserShield,
} from "react-icons/fa";
import { MdHealthAndSafety, MdArrowBack } from "react-icons/md";
import Checkbox from "components/checkbox";
import { useToast } from "hooks/useToast";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Step 2
    idNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    postalCode: "",

    // Terms
    termsAccepted: false,
    newsletter: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim()) {
      showToast("Please enter your first name", "warning");
      return false;
    }
    if (!formData.lastName.trim()) {
      showToast("Please enter your last name", "warning");
      return false;
    }
    if (!formData.email.trim()) {
      showToast("Please enter your email", "warning");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "warning");
      return false;
    }
    if (!formData.phone.trim()) {
      showToast("Please enter your phone number", "warning");
      return false;
    }
    if (!formData.password.trim()) {
      showToast("Please enter a password", "warning");
      return false;
    }
    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters", "warning");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "warning");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.idNumber.trim()) {
      showToast("Please enter your ID number", "warning");
      return false;
    }
    if (!formData.dateOfBirth.trim()) {
      showToast("Please enter your date of birth", "warning");
      return false;
    }
    if (!formData.gender.trim()) {
      showToast("Please select your gender", "warning");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      showToast("Please accept the terms and conditions", "warning");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showToast(
        "Account created successfully! Please check your email for verification.",
        "success"
      );

      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 2000);
    }, 3000);
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
            Create Your Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join HealthConnect in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step >= stepNum
                      ? "bg-brand-500 text-white"
                      : "bg-gray-200 text-gray-400 dark:bg-gray-700"
                  }`}
                >
                  {stepNum}
                </div>
                <span className="mt-1 text-xs">
                  {stepNum === 1 ? "Basic Info" : "Details"}
                </span>
              </div>
            ))}
            <div className="absolute left-0 right-0 top-4 -z-10 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-navy-700 dark:text-white">
              I am a:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "patient", label: "Patient", icon: <FaUserInjured /> },
                { id: "provider", label: "Provider", icon: <FaUserMd /> },
                { id: "admin", label: "Admin", icon: <FaUserShield /> },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setUserType(role.id)}
                  className={`flex flex-col items-center rounded-xl px-3 py-4 transition-all ${
                    userType === role.id
                      ? "border-2 border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-900/20"
                      : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  <span className="mb-2 text-xl">{role.icon}</span>
                  <span className="text-xs font-medium">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          {step === 1 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  variant="auth"
                  label="First Name"
                  placeholder="John"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  variant="auth"
                  label="Last Name"
                  placeholder="Doe"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <InputField
                variant="auth"
                label="Email Address"
                placeholder="your.email@example.com"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                required
              />

              <InputField
                variant="auth"
                label="Phone Number"
                placeholder="071 234 5678"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                required
              />

              <div className="relative">
                <InputField
                  variant="auth"
                  label="Password"
                  placeholder="Create a strong password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <InputField
                variant="auth"
                label="Confirm Password"
                placeholder="Re-enter your password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type="password"
                required
              />
            </div>
          ) : (
            <div className="space-y-4">
              <InputField
                variant="auth"
                label="South African ID Number"
                placeholder="Enter 13-digit ID number"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                required
              />

              <InputField
                variant="auth"
                label="Date of Birth"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                type="date"
                required
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Male", "Female", "Other"].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, gender }))
                      }
                      className={`rounded-lg px-3 py-2 text-sm ${
                        formData.gender === gender
                          ? "bg-brand-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    name="termsAccepted"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-brand-500 hover:underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-brand-500 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-center">
                  <Checkbox
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    name="newsletter"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Receive health tips and updates
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            <button
              onClick={handleNextStep}
              disabled={isLoading}
              className="linear w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600 disabled:opacity-50"
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
                  {step === 1 ? "Creating Account..." : "Finalizing..."}
                </span>
              ) : step === 1 ? (
                "Continue"
              ) : (
                "Create Account"
              )}
            </button>

            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="linear w-full rounded-xl border border-gray-300 bg-white py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <MdArrowBack className="mr-2 inline h-4 w-4" />
                Back
              </button>
            )}
          </div>

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

export default SignUp;
