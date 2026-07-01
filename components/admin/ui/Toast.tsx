"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";
type Toast = { id: string; message: string; type: ToastType };

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-[16px] min-w-[280px] pointer-events-auto"
              style={{
                background:
                  toast.type === "success"
                    ? "rgba(34,197,94,0.1)"
                    : toast.type === "error"
                    ? "rgba(239,68,68,0.1)"
                    : "rgba(255,122,0,0.1)",
                border: `1px solid ${
                  toast.type === "success"
                    ? "rgba(34,197,94,0.2)"
                    : toast.type === "error"
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(255,122,0,0.2)"
                }`,
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <span className="text-lg font-bold text-white">
                {toast.type === "success" ? "✓" : toast.type === "error" ? "✗" : "ℹ"}
              </span>
              <p className="text-white text-sm font-semibold">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
