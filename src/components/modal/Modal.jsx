import React from "react";
import { MdClose } from "react-icons/md";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="bg-black animate-fadeIn fixed inset-0 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="animate-scaleIn flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizeClasses[size]} rounded-2xl bg-white shadow-2xl dark:bg-navy-800`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-xl font-bold text-navy-700 dark:text-white">
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <MdClose className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
