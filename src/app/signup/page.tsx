"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface Data {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  employess: string;
}

const Page = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<Data>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    employess: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleSettings = () => {
    toast.dismiss();
    handleLoading();
    window.location.href = "/login";
  };

  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  useEffect(() => {
    if (data.confirmPassword === "") {
      setPasswordMatch(null);
    } else {
      setPasswordMatch(data.password === data.confirmPassword);
    }
  }, [data.password, data.confirmPassword]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.confirmPassword ||
      !data.employess
    ) {
      toast.dismiss();
      toast.error("Please fill out all required fields");
      setLoading(false);
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: data.employess,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Registration successful!");
      setData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        employess: "",
      });

      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.dismiss();
        toast.error(
          "Password should at list 8 character or server is not respond"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:p-6 sm:p-6 cursor-pointer background_img flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex items-center rounded-xl justify-center flex-col text-[#fff] bg-[#1C2431] p-3 md:w-[65%] lg:w-[70%] xl:w-1/3 lg:m-auto w-[90%]"
      >
        <div className="text-2xl font-semibold mb-8 mt-2">
          Set up your account
        </div>

        <div className="w-full mt-2 mb-[1rem]">
          <label className="block text-[14px] mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border-1 p-[10px] py-[5px] rounded-[5px]"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>

        <div className="w-full mb-[1rem]">
          <label className="block text-[14px] mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full border-1 p-[10px] py-[5px] rounded-[5px]"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
        </div>

        <div className="w-full mb-[1rem]">
          <label className="block text-[14px] mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border-1 p-[10px] py-[5px] rounded-[5px]"
              name="password"
              value={data.password}
              onChange={handleChange}
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
        </div>

        <div className="w-full mb-[1rem] relative">
          <label className=" text-[14px] ">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          {passwordMatch === false && (
            <span className="text-red-400 text-sm mt-1 mx-3">
              Passwords do not match
            </span>
          )}
          {passwordMatch === true && (
            <span className="text-green-400 text-sm mt-1 mx-3">
              Passwords matched
            </span>
          )}
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full border-1 p-[10px] py-[5px] rounded-[5px] mt-1"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showPassword)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 mt-3"
          >
            {showPassword ? (
              <VisibilityIcon fontSize="small" />
            ) : (
              <VisibilityOffIcon fontSize="small" />
            )}
          </button>
        </div>

        <div className="w-full mb-[1rem]">
          <label className="block text-[14px] mb-1">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="employess"
            className="w-full outline-0 border-1 py-[5px] rounded-[5px]"
            value={data.employess}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="admin" className="bg-[#1C2431]">
              Admin
            </option>
            <option value="manager" className="bg-[#1C2431]">
              Manager
            </option>
            <option value="employees" className="bg-[#1C2431]">
              Employees
            </option>
          </select>
        </div>

        <div className="w-full mb-[1rem]">
          <div className="w-[100%]">
            <input type="checkbox" />
            <label className="text-[1rem]">
              &nbsp; I agree to the privacy policy and terms of use
            </label>
          </div>
          <div className="w-full">
            <input type="checkbox" />
            <label className="text-[1rem]">
              &nbsp; Connect with me on WhatsApp for onboarding
            </label>
          </div>
        </div>

        <div className="button w-full">
          <button
            type="submit"
            className="w-full border-none cursor-pointer py-2 bg-[#2E5BFF] rounded-[5px]"
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </div>

        <div className="text-center text-[14px]">
          <div className="content w-full my-5">
            This site is protected by reCAPTCHA and the Google
            <Link href="" className="text-[#2E5BFF] mx-1">
              Privacy Policy
            </Link>
            and{" "}
            <Link href="" className="text-[#2E5BFF] mx-0.5">
              Terms of Service
            </Link>{" "}
            apply.
          </div>
          <div className="content w-full">
            Already have an account with us?
            <button
              onClick={handleSettings}
              className="text-[#2E5BFF] mx-1 cursor-pointer"
            >
              Login
            </button>
          </div>
          <div className="content w-full">
            Are you a CA partner?
            <span className="text-[#2E5BFF] mx-1">Sign Up</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
