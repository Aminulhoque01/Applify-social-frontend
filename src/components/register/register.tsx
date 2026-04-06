/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRegisterMutation } from "@/src/redux/services/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    try {
      const res: any = await register(form);

      if (res?.data) {
        localStorage.setItem("token", res.data.data.token);
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white">
      <div className="w-[360px] bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 border">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800 ">
          Create an account
        </h2>

        {/* First Name */}
        <div className="mt-5">
          <label className="text-sm text-gray-600">First Name</label>
          <input
            type="text"
            placeholder="Enter first name"
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Last Name */}
        <div className="mt-4">
          <label className="text-sm text-gray-600">Last Name</label>
          <input
            type="text"
            placeholder="Enter last name"
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Password */}
        <div className="mt-4 relative">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full mt-1 px-4 py-2 pr-10 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-gray-300"
          />

          {/* Eye Icon */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 cursor-pointer text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={isLoading}
          className="w-full mt-5 bg-gray-900 text-white py-2 rounded-lg hover:opacity-90"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-gray-800 font-medium cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}