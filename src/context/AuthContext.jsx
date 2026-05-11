import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER ON START
  ========================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGOUT FUNCTION
  ========================= */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  /* =========================
     GLOBAL LOGOUT EVENT LISTENER
  ========================= */
  useEffect(() => {
    const handler = (e) => {
      logout(); // clears state + storage
      console.log("Auth logout reason:", e.detail?.reason);
    };

    window.addEventListener("auth:logout", handler);

    return () => window.removeEventListener("auth:logout", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};