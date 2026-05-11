import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);

  const showToast = useCallback((message, type = "success", options = {}) => {
    const { persistent = false, duration = 4000 } = options;

    setToast({ message, type, persistent });
    setVisible(true);

    // AUTO DISMISS ONLY IF NOT PERSISTENT
    if (!persistent) {
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => setToast(null), 400);
      }, duration);
    }
  }, []);

  const closeToast = () => {
    setVisible(false);
    setTimeout(() => setToast(null), 300);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className={`
            fixed top-6 right-6 z-50
            px-5 py-4 rounded-2xl shadow-xl
            text-white font-medium text-sm
            transition-all duration-300
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
          `}
        >
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <span>
                {toast.type === "success" ? "✔️" : "❌"}
              </span>

              <span>{toast.message}</span>
            </div>

            {/* CLOSE BUTTON (ONLY FOR PERSISTENT TOAST) */}
            {toast.persistent && (
              <button
                onClick={closeToast}
                className="text-white/80 hover:text-white ml-3"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};