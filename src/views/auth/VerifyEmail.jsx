import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { MdHealthAndSafety, MdCheckCircle, MdError } from "react-icons/md";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { verifyEmail, resendVerification } = useAuth();

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const isMounted = useRef(true);

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setStatus("error");
      showToast("Invalid verification link", "error");
    }

    return () => {
      isMounted.current = false;
    };
  }, [token]);

  const verifyEmailToken = async () => {
    setIsLoading(true);

    try {
      const result = await verifyEmail(token);

      if (!isMounted.current) return;

      if (result.success) {
        setStatus("success");
        showToast("Email verified successfully!", "success");

        // Redirect to sign-in after 3 seconds
        setTimeout(() => {
          if (isMounted.current) {
            navigate("/auth/sign-in");
          }
        }, 3000);
      } else {
        setStatus("error");
        showToast(result.error || "Email verification failed", "error");
      }
    } catch (error) {
      if (isMounted.current) {
        setStatus("error");
        showToast("An unexpected error occurred", "error");
        console.error("Verify email error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      showToast("Email address is required to resend verification", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const result = await resendVerification(email);

      if (!isMounted.current) return;

      if (result.success) {
        showToast("Verification email resent successfully!", "success");
      } else {
        showToast(
          result.error || "Failed to resend verification email",
          "error"
        );
      }
    } catch (error) {
      if (isMounted.current) {
        showToast("An unexpected error occurred", "error");
        console.error("Resend verification error:", error);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const getContent = () => {
    switch (status) {
      case "verifying":
        return {
          icon: <MdHealthAndSafety className="h-16 w-16 text-blue-500" />,
          title: "Verifying Your Email",
          message: "Please wait while we verify your email address...",
          color: "blue",
        };
      case "success":
        return {
          icon: <MdCheckCircle className="h-16 w-16 text-green-500" />,
          title: "Email Verified!",
          message:
            "Your email has been successfully verified. Redirecting to sign in...",
          color: "green",
        };
      case "error":
        return {
          icon: <MdError className="h-16 w-16 text-red-500" />,
          title: "Verification Failed",
          message: token
            ? "Unable to verify your email. The link may have expired or is invalid."
            : "Invalid verification link.",
          color: "red",
        };
      default:
        return {
          icon: <MdHealthAndSafety className="h-16 w-16 text-gray-500" />,
          title: "Verification",
          message: "Processing your request...",
          color: "gray",
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-navy-900">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center">
            {content.icon}
          </div>

          <h1
            className={`mb-3 text-3xl font-bold text-${content.color}-700 dark:text-${content.color}-300`}
          >
            {content.title}
          </h1>

          <p className="mb-8 text-gray-600 dark:text-gray-300">
            {content.message}
          </p>

          {isLoading && status === "verifying" && (
            <div className="mb-6">
              <div className="border-current border-r-transparent inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isLoading || !email}
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
                  "Resend Verification Email"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/auth/sign-in"
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="border-r-transparent mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You will be redirected automatically...
              </p>
              <Link
                to="/auth/sign-in"
                className="mt-4 inline-block text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Go to Sign In Now
              </Link>
            </div>
          )}
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
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

export default VerifyEmail;
