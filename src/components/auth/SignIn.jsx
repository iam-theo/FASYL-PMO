import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

import bgSignIn from "../../assets/bgSignIn.jpg";
import bgSignInTwo from "../../assets/bgSignInTwo.jpg";

function SignIn({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    showToast("Please enter email and password", "error", {
      persistent: true
    });
    return;
  }

  try {
    setLoading(true);

    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    const user = data.user;
    const token = data.accessToken;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    setUser(user);

    // ✅ SUCCESS (auto fade)
    showToast(
      `Hello ${user.fullName}, you have successfully logged in`,
      "success",
      { persistent: false } // optional (default already false)
    );

    setTimeout(() => {
      if (user.role === "HEADOFOPS" || user.role === "PROJECTMANAGER") {
        navigate("/app");
      } else {
        navigate("/");
      }
    }, 800);

  } catch (err) {
    const message =
      err.response?.data?.message || "Login failed. Try again.";

    // ❌ ERROR (PERSISTENT)
    showToast(message, "error", {
      persistent: true
    });

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex max-w-360 max-h-screen">

      {/* LEFT SIDE */}
      <div className="w-238 h-screen relative">
        <img
          src={bgSignIn}
          alt="bg"
          className="w-full h-full object-cover absolute"
        />

        <div className="bg-linear-to-bl from-[#1B3C4A] to-[#1A5C78] w-full h-full opacity-80 text-white flex flex-col justify-center px-25">
          <h1 className="text-[48px] font-semibold mb-3.5">
            Welcome to Fasyl Project Management
          </h1>
          <p className="text-[20px]">
            Login to manage your dashboard efficiently
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-122 h-screen relative flex flex-col justify-center">

        <img
          src={bgSignInTwo}
          alt="bg"
          className="w-full h-full object-cover opacity-30 absolute z-[-1]"
        />

        <div className="px-16 flex flex-col gap-4">

          <h3 className="text-[24px] font-semibold text-[#101828]">
            Log in
          </h3>

          <p className="text-[16px] text-[#141414]">
            Welcome back! Please enter your details
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* EMAIL */}
            <div className="flex flex-col">
              <label className="text-[14px] font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-90 h-11 rounded-lg border border-[#D0D5DD] px-3.5"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col">
              <label className="text-[14px] font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-90 h-11 rounded-lg border border-[#D0D5DD] px-3.5"
                required
              />
            </div>

            <div className="text-sm text-[#1B3C4A] font-medium cursor-pointer">
              Forgot password?
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-90 h-11 bg-[#1B3C4A] text-white rounded-lg mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;