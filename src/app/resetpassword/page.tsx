"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/resetPassword`,
        {
          newPassword: password,
          confirmPassword: confirmPassword,
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Password updated successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="w-full md:p-6 sm:p-6 background_img flex items-center justify-center min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:w-[35%] md:w-[60%] sm:w-full w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Add New Password
        </h3>
        <div className="mt-2 text-white bg-gray-800 rounded w-full pt-10 px-3">
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="border border-gray-500 rounded p-2 w-full mb-4 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-8"
            >
              {showPassword ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-1 relative">
            <label htmlFor="">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter password"
              className="border border-gray-500 rounded p-2 w-full mb-4 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-8"
            >
              {showConfirmPassword ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </button>
          </div>
          <div className="w-full my-6">
            <button
              onClick={handleResetPassword}
              className="w-full py-2 bg-[#2E5BFF] text-white rounded-[5px] cursor-pointer"
            >
              Submit
            </button>
          </div>

          <div className="text-center text-sm py-3 leading-6 px-3">
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
      </div>
    </div>
  );
};

export default ResetPassword;
