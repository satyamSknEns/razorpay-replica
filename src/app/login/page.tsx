"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const cookies = useCookies();
  const router = useRouter();

  const handleSetCookies = (name: string, value: string, minutes: number) => {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + minutes);
    cookies.set(name, value, { path: "/", expires });
  };

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleSettings = () => {
    handleLoading();
    window.location.href = "/signup";
  };

  const handleForgetpassword = () => {
    handleLoading();
    window.location.href = "/forgotPassword";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.token) {
        handleSetCookies("token", response.data.token, 60 * 24 * 7);
        router.push("/layout/dashboard");
      } else {
        toast.error("Login failed: Invalid response");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.dismiss();
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Image
            src="/loading.gif"
            alt="Loading"
            width={80}
            height={80}
            className="animate-pulse"
          />
        </div>
      )}

      <div className="w-full md:p-6 sm:p-6 background_img flex items-center justify-center min-h-screen relative">
        <form
          onSubmit={handleSubmit}
          className="flex items-center rounded-xl justify-center flex-col text-white bg-[#1C2431] p-3 md:w-[65%] lg:w-[65%] xl:w-1/3 lg:m-auto w-[90%]"
        >
          <div className="lg:text-xl text-base text-center mb-10 mt-2">
            Smart payroll for smarter businesses
          </div>

          <label className="block w-full mb-1">Email Address</label>
          <input
            type="email"
            placeholder="Enter email address"
            className="border border-gray-500 rounded p-2 w-full mb-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="w-full flex justify-between">
            <label className="block mb-1">Password</label>
            <label
              onClick={handleForgetpassword}
              className="block text-blue-400 cursor-pointer mb-1"
            >
              Forgot Password
            </label>
          </div>

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              className="border border-gray-500 rounded p-2 w-full outline-none"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </button>
          </div>

          <div className="w-full my-6">
            <button
              type="submit"
              className="w-full py-2 bg-[#2E5BFF] text-white rounded-[5px] cursor-pointer"
              disabled={loading}
            >
              Login
            </button>
          </div>

          <div className="text-center text-[14px]">
            <div className="mb-4">
              Not a customer yet?
              <button
                type="button"
                onClick={handleSettings}
                className="text-[#2E5BFF] ml-1 cursor-pointer"
              >
                Sign Up!
              </button>
            </div>
            <div>
              This site is protected by reCAPTCHA and the Google
              <Link href="" className="text-[#2E5BFF] mx-1">
                Privacy Policy
              </Link>
              and
              <Link href="" className="text-[#2E5BFF] mx-1">
                Terms of Service
              </Link>
              apply.
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
