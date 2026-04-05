/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLoginMutation } from "@/src/redux/services/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = async () => {
    try {
      const res: any = await login(form);

      if (res?.data) {
        localStorage.setItem("token", res.data.data.token);
        router.push("/feed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white">
      
      <div className="w-[360px] bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-8 border">
        
        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-800">
          Sign in with email
        </h2>

        {/* Email */}
        <div className="mt-5">
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

        {/* Forgot */}
        <div className="text-right text-xs text-gray-500 mt-2 cursor-pointer hover:underline">
          Forgot password?
        </div>

        {/* Button */}
        <button
          onClick={submit}
          disabled={isLoading}
          className="w-full mt-5 bg-gray-900 text-white py-2 rounded-lg hover:opacity-90"
        >
          {isLoading ? "Signing in..." : "Get Started"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-5">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-gray-800 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}