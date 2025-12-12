import React from "react";
// import { useToast } from "../hooks/useToast";
import Toast from "./Toast";
import { useToast } from "hooks/useToast";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={5000}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
