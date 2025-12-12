import React, { useEffect } from "react";
import {
  MdCheckCircle,
  MdError,
  MdWarning,
  MdInfo,
  MdClose,
} from "react-icons/md";

const Toast = ({ message, type = "info", onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <MdCheckCircle className="h-5 w-5 text-green-500" />,
    error: <MdError className="h-5 w-5 text-red-500" />,
    warning: <MdWarning className="h-5 w-5 text-yellow-500" />,
    info: <MdInfo className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success:
      "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    warning:
      "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
  };

  const textColors = {
    success: "text-green-800 dark:text-green-300",
    error: "text-red-800 dark:text-red-300",
    warning: "text-yellow-800 dark:text-yellow-300",
    info: "text-blue-800 dark:text-blue-300",
  };

  return (
    <div
      className={`animate-slideInRight fixed bottom-4 right-4 z-50 rounded-lg border p-4 shadow-xl ${bgColors[type]} ${textColors[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <div className="pr-6">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-black/5 absolute right-2 top-2 rounded p-1"
        >
          <MdClose className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="bg-black/10 mt-2 h-1 w-full overflow-hidden rounded-full">
        <div
          className={`h-full ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
              ? "bg-red-500"
              : type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{ animation: `shrink ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
};

export default Toast;
