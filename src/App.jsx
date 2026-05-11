import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";

import MainBody from "./components/layout/MainBody";
import DashboardShell from "./components/dashboard/DashboardShell";

import RequireRole from "./components/auth/RequireRole";

import { ToastProvider } from "./context/ToastContext";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     AUTH HYDRATION
  ========================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  /* =========================
     LOADING STATE
  ========================== */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <ToastProvider>
      <Routes>

        {/* =========================
            AUTH ROUTES
        ========================== */}
        <Route
          path="/"
          element={<SignIn setUser={setUser} />}
        />

        {/* =========================
            MAIN APP SHELL
        ========================== */}
        <Route
          path="/app/*"
          element={
            user ? (
              <MainBody user={user} setUser={setUser} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            DASHBOARD (NEW CLEAN SHELL)
        ========================== */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardShell user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* =========================
            REGISTER (HEADOFOPS ONLY)
        ========================== */}
        <Route
          path="/register"
          element={
            <RequireRole user={user} allowedRoles={["HEADOFOPS"]}>
              <Register />
            </RequireRole>
          }
        />

      </Routes>
    </ToastProvider>
  );
}

export default App;