import React from "react";
import { MdInfo, MdCheckCircle, MdWarning, MdCancel } from "react-icons/md";

const ToastNotification = ({ toasts, onRemove }) => {
  const getToastStyles = (type) => {
    const styles = {
      success: {
        bg: "bg-green-100 dark:bg-green-900/30",
        border: "border-green-500",
        text: "text-green-800 dark:text-green-300",
        icon: <MdCheckCircle className="h-5 w-5" />,
      },
      error: {
        bg: "bg-red-100 dark:bg-red-900/30",
        border: "border-red-500",
        text: "text-red-800 dark:text-red-300",
        icon: <MdCancel className="h-5 w-5" />,
      },
      warning: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        border: "border-yellow-500",
        text: "text-yellow-800 dark:text-yellow-300",
        icon: <MdWarning className="h-5 w-5" />,
      },
      info: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-500",
        text: "text-blue-800 dark:text-blue-300",
        icon: <MdInfo className="h-5 w-5" />,
      },
    };
    return styles[type] || styles.info;
  };

  return (
    <div className="fixed right-5 top-5 z-50 space-y-3">
      {toasts.map((toast) => {
        const style = getToastStyles(toast.type);
        return (
          <div
            key={toast.id}
            className={`flex items-center rounded-lg border-l-4 p-4 shadow-xl transition-all duration-300 hover:scale-105 ${style.bg} ${style.border}`}
          >
            <div className={style.text}>{style.icon}</div>
            <span className={`ml-3 font-medium ${style.text}`}>
              {toast.message}
            </span>
            <button
              onClick={() => onRemove(toast.id)}
              className={`ml-4 hover:opacity-70 ${style.text}`}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotification;
