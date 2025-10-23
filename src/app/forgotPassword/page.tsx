"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handelEmailSend = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/requestPasswordReset`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Check your email for the reset link!");
        setEmail("");
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Unable to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:p-6 sm:p-6 background_img flex items-center justify-center min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col lg:w-[35%] md:w-[60%] sm:w-full w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Forgot Password?
        </h3>
        <div className="mt-2 text-white bg-gray-800 p-3 rounded w-full">
          <h3 className="font-semibold p-3 mb-8 text-center text-xl">
            No problem. Enter your email address below and we will send you a
            password reset link.
          </h3>

          <div className="flex flex-col">
            <label className=" w-full mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter email address"
              className="border border-gray-500 rounded p-2 w-full mb-4 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="w-full my-6">
            <button
              onClick={handelEmailSend}
              className={`w-full py-2 rounded-[5px] cursor-pointer transition-all ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#2E5BFF] hover:bg-[#2048cc]"
              } text-white`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
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

export default Forgetpassword;
