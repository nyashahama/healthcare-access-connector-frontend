import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "@tanstack/react-router";
import InputField from "components/fields/InputField";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdArrowBack, MdLock, MdWork } from "react-icons/md";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import staffService from "api/services/staffService";
import { getDashboardPath } from "utils/roleUtils";

const StaffRegistration = () => {
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get("invitation_token");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { registerInvitedStaff } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInvitation, setIsFetchingInvitation] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    const token = invitationToken;
    if (!token) {
      setIsFetchingInvitation(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const fetchInvitation = async () => {
      setIsFetchingInvitation(true);

      try {
        const details = await staffService.getInvitationDetails(token);
        if (cancelled || !mountedRef.current) return;

        setInvitation(details);
        setFormData((prev: any) => ({
          ...prev,
          email: details.work_email || prev.email,
        }));
      } catch (error) {
        if (!mountedRef.current || cancelled) return;

        setInvitation(null);
        showToast(
          error.message || "Invalid or expired invitation",
          "error"
        );
      } finally {
        if (!cancelled && mountedRef.current) {
          setIsFetchingInvitation(false);
          setIsLoading(false);
        }
      }
    };

    fetchInvitation();

    return () => {
      cancelled = true;
    };
  }, [invitationToken, showToast]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const isPhoneValid = (value: any) => {
    if (!value) return true;
    return /^(?:(?:\+27|0)[\s-]?[1-9][\d\s-]{8,9})$/.test(
      value.replace(/\s/g, "")
    );
  };

  const validateForm = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      showToast("Please enter a valid email address", "warning");
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

    if (!isPhoneValid(formData.phone)) {
      showToast("Please enter a valid South African phone number", "warning");
      return false;
    }

    return true;
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!invitationToken) {
      showToast("Missing invitation token", "error");
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        invitation_token: invitationToken,
        email: formData.email,
        password: formData.password,
      };

      if (formData.phone.trim()) {
        payload.phone = formData.phone;
      }

      const response = await registerInvitedStaff(payload);

      if (!mountedRef.current) return;

      if (!response.success) {
        showToast(response.error || "Registration failed", "error");
        return;
      }

      setIsRegistered(true);

      if (response.data?.token) {
        const nextPath = getDashboardPath(response.data?.user?.role || "provider_staff");
        setShowSuccessMessage(
          "Account created successfully. You are now signed in."
        );
        showToast("Registration successful", "success");
        setTimeout(() => {
          if (mountedRef.current) navigate({ to: nextPath });
        }, 1500);
      } else {
        setShowSuccessMessage(
          "Registration successful. Please sign in to continue."
        );
      }
    } catch (error) {
      if (!mountedRef.current) return;
      showToast("An unexpected error occurred", "error");
      console.error("Staff registration submit error:", error);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const isExpired =
    invitation?.invitation_expires &&
    new Date(invitation.invitation_expires) < new Date();

  if (!isFetchingInvitation && !invitation) {
    return (
      <div className="mb-16 mt-16 flex min-h-screen w-full items-center justify-center px-2 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800">
          <div className="mb-6 flex items-center">
            <button
              type="button"
              onClick={() => navigate({ to: "/auth/sign-in" })}
              className="mr-3 rounded-lg p-2 text-navy-500 hover:bg-gray-100 dark:hover:bg-navy-700"
            >
              <MdArrowBack className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-navy-700 dark:text-white">
              Invalid invitation
            </h1>
          </div>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            We couldn't find a valid staff invitation. Please check your link or
            contact your clinic administrator.
          </p>
          <Link
            to="/auth/sign-in"
            className="inline-block rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="mb-16 mt-16 flex min-h-screen w-full items-center justify-center px-2 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-navy-800">
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

          <h1 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
            Staff Registration Complete
          </h1>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {showSuccessMessage}
          </p>

          <button
            onClick={() => navigate(showSuccessMessage.includes("signed in") ? "/provider/dashboard" : "/auth/sign-in")}
            className="w-full rounded-xl bg-brand-500 py-3 text-white hover:bg-brand-600"
          >
            {showSuccessMessage.includes("signed in") ? "Go to dashboard" : "Go to sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 mt-16 flex min-h-screen items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-navy-800 md:p-10">
        <div className="mb-8 flex items-center">
          <button
            type="button"
            onClick={() => navigate({ to: "/auth/sign-in" })}
            className="mr-3 rounded-lg p-2 text-navy-500 hover:bg-gray-100 dark:hover:bg-navy-700"
            disabled={isFetchingInvitation}
          >
            <MdArrowBack className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-navy-700 dark:text-white">
              Staff Invitation Registration
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Complete your account setup to join your clinic team
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="mb-3 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-100">
            <MdWork className="h-5 w-5" />
            <span>Invitation Details</span>
          </div>

          {isFetchingInvitation ? (
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Loading invitation details...
            </p>
          ) : isExpired ? (
            <p className="text-sm text-red-600 dark:text-red-300">
              This invitation link has expired. Ask your administrator for a new
              invitation.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Clinic:</strong> {invitation?.clinic_name}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Role:</strong> {invitation?.staff_role}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Email:</strong> {invitation?.work_email}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Invitation expires:</strong>{" "}
                {invitation?.invitation_expires
                  ? new Date(invitation.invitation_expires).toLocaleString()
                  : "N/A"}
              </p>
            </>
          )}
        </div>

        {isExpired && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-200">
              This invitation is no longer valid. Please request a new invite from
              your clinic administrator.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            variant="auth"
            label="Email Address *"
            placeholder="your.email@example.com"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            type="email"
            disabled
          />

          <InputField
            variant="auth"
            label="Phone number (optional)"
            placeholder="+27 82 123 4567"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            type="tel"
            disabled={isLoading || isFetchingInvitation}
          />

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
              disabled={isLoading || isFetchingInvitation}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev: any) => !prev)}
              className="absolute right-3 top-10 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || isFetchingInvitation}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <InputField
              variant="auth"
              label="Confirm Password *"
              placeholder="Re-enter your password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              type={showConfirmPassword ? "text" : "password"}
              disabled={isLoading || isFetchingInvitation}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev: any) => !prev)}
              className="absolute right-3 top-10 text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || isFetchingInvitation}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              isFetchingInvitation ||
              !invitationToken ||
              isExpired ||
              !invitation
            }
            className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200"
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
                Creating account...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <MdLock className="h-5 w-5" />
                Complete Registration
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffRegistration;
