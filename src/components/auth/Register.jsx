import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

import bgSignIn from "../../assets/bgSignIn.jpg";
import bgSignInTwo from "../../assets/bgSignInTwo.jpg";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "PROJECTMANAGER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      showToast("All fields are required", "error", { persistent: true });
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      showToast("User registered successfully", "success");

      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed";

      showToast(message, "error", { persistent: true });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-360 max-h-screen">

      {/* LEFT SIDE (SAME AS LOGIN) */}
      <div className="w-238 h-screen relative">
        <img
          src={bgSignIn}
          alt="bg"
          className="w-full h-full object-cover absolute"
        />

        <div className="bg-linear-to-bl from-[#1B3C4A] to-[#1A5C78] w-full h-full opacity-80 text-white flex flex-col justify-center px-25">
          <h1 className="text-[48px] font-semibold mb-3.5">
            Fasyl User Registration
          </h1>
          <p className="text-[20px]">
            Create users and assign roles within the PMO system
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
            Register User
          </h3>

          <p className="text-[16px] text-[#141414]">
            Create a new user account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* FULL NAME */}
            <div className="flex flex-col">
              <label className="text-[14px] font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={handleChange}
                className="w-90 h-11 rounded-lg border border-[#D0D5DD] px-3.5"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col">
              <label className="text-[14px] font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-90 h-11 rounded-lg border border-[#D0D5DD] px-3.5"
                required
              />
            </div>

            {/* ROLE */}
            <div className="flex flex-col">
              <label className="text-[14px] font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-90 h-11 rounded-lg border border-[#D0D5DD] px-3.5"
              >
                <option value="PROJECTMANAGER">Project Manager</option>
                <option value="HEADOFOPS">Head of Operations</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-90 h-11 bg-[#1B3C4A] text-white rounded-lg mt-2 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create User"}
            </button>

            {/* BACK TO LOGIN */}
            <p
              onClick={() => navigate("/")}
              className="text-sm text-[#1B3C4A] font-medium cursor-pointer mt-2"
            >
              Back to Login
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;