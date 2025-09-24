"use client";
import axios, { AxiosRequestConfig } from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [token, setToken] = useState<string | null>(null);
  const [data, setUserProfileData] = useState<ProfileData>({});
  // const [leave, setLeave] = useState<LeaveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState(true);
  const [editDetail, setEditDetail] = useState<editUserDetail>({
    details: "",
    experience: "",
    lastCompany: "",
    managerId: "",
    joiningDate: "",
    department: "",
  });
  const [show, setShow] = useState(false);

  type editUserDetail = {
    details: string;
    experience: string;
    lastCompany: string;
    managerId: string;
    joiningDate: string;
    department: string;
  };

  const cookies = useCookies();

  useEffect(() => {
    const handleGetcookies = async () => {
      const storeCookies = cookies.get("token");
      setToken(storeCookies ?? null);
    };
    handleGetcookies();
  }, []);

   interface ProfileData {
    profile?: {
      id?: number;
      name?: string;
      role?: string;
      DOB?:number;
      email?: string;
      department?: string;
      joiningDate?: string;
      aadhaarNumber?:string;
      accountNumber?:string;
      phoneNumber?:string;
      maritalStatus?:string;
      gender?: string;
      IFSCcode?:string;
      highestEducationalQualification?:string;
      manager?: {
        name?: string;
      };
      serviceDuration?: {
        years?: number;
        months?: number;
        days?: number;
      };
      leaveSummary?:{
        allocated?: number;
        remaining?: number;
        leaveTypeName?: string;
        leaveTypeId?: string;
      }[];
      pan?:string;
      AnnualSalary?:string;
      NumberOfBonus?:string;
      currentAdvanceSalary?:string;
      shiftTiming?:string;
      PFStatus?:number;
      PFUAN?:string;
      professionalTax?:string;
      LWFStatus?:string;
      ESICStatus?:string;
      ESICIPNumber?:string;
      location?:string
    };
  }

  const paymentInfo = [
    { label: "PAN", value: `${data.profile?.pan}` },
    { label: "IFSC Code", value: `${data.profile?.IFSCcode}` },
    { label: "Account Number", value: `${data.profile?.accountNumber}` },
    { label: "Beneficiary Name", value:  `${data.profile?.name}` },
  ];

  const pfDetails = [
    { label: "PF Status", value: `${data.profile?.PFStatus}` },
    { label: "PF UAN", value: `${data.profile?.PFUAN}` },
    { label: "Professional Tax", value: `${data.profile?.professionalTax}`},
    { label: "LWF Status", value: `${data.profile?.LWFStatus}` },
    { label: "ESIC Status", value: `${data.profile?.ESICStatus}` },
    { label: "ESIC IP Number", value: `${data.profile?.ESICIPNumber}` },
  ];

  const otherDetails = [
    { label: "Phone Number", value: `${data.profile?.phoneNumber}` },
    { label: "Gender", value: `${data.profile?.gender}` },
    { label: "Date of Birth", value: `${String(data.profile?.DOB)?.slice(0,10)}` },
    { label: "Highest Educational Qualification", value: `${data.profile?.highestEducationalQualification}` },
    { label: "Aadhaar Number", value: `${data.profile?.aadhaarNumber}` },
    { label: "Marital Status", value: `${data.profile?.maritalStatus}` },
  ];

  const handleUpdateUserDetail = async () => {
    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/updateUserDetail`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: editDetail,
      };
      await axios.request(config);
      console.log(editDetail);
      toast.success("data updated successfully");
      setAnimation(false);
      setTimeout(() => {
        setShow(false);
      }, 300);
    } catch (error) {
      toast.dismiss();
      toast.error("Department or managerId is incorrect");
      console.error("There is some issue", error);
    }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserProfileData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const userRoles = [{ label: "Role", value: `${data.profile?.role}` }];
  const renderTable = (data: any) => (
    <div className="border border-gray-700 rounded overflow-hidden">
      <table className="w-full">
        <tbody className="divide-y divide-gray-700">
          {data.map((item: any, index: any) => (
            <tr key={index} className="h-12">
              <td className="px-4 text-gray-400 w-1/2">{item.label}</td>
              <td className="px-4">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
        <Image
          src="/loading.gif"
          alt="Loading"
          width={80}
          height={80}
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C1927] text-white px-4 py-6 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mb-4">
        <h2 className="text-sm text-gray-400">
          People |{" "}
          <span className="text-white">
            {data?.profile?.name
              ? data?.profile?.name?.charAt(0).toUpperCase() +
                data?.profile.name.slice(1)
              : "--"}
          </span>
        </h2>
      </div>

      <main className="flex gap-5 flex-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 gap-6 lg:w-[75%] md:w-full w-full">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <button
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => setShow((prev) => !prev)}
              >
                Edit
              </button>
            </div>
            <div className="lg:col-span-2 bg-[#0C1927] border border-gray-700 rounded p-6 mb-6">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-700">
                  {[
                    ["Type", `${data.profile?.role || "--"}`],
                    ["Name", `${data?.profile?.name || "--"}`],
                    ["Email", `${data?.profile?.email || "--"}`],
                    [
                      "Date of Hiring",
                      `${
                        data.profile?.joiningDate
                          ?.toLocaleString()
                          .split("T")[0] || "--"
                      }`,
                    ],
                    ["Title", `${data?.profile?.department || "--"}`],
                    ["Employee ID", `ENS30${data.profile?.id || "--"}`],
                    ["Department", "Research and Development"],
                    ["Manager", `${data?.profile?.manager?.name || "--"}`],
                    ["Location", `${data.profile?.location}`],
                  ].map(([label, value], index) => (
                    <tr key={index} className="h-12">
                      <td className="text-gray-400 w-1/3">{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Compensation & Perquisites
              </h2>
              <div className="border border-gray-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700">
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400 w-1/2">
                        Annual Salary
                      </td>
                      <td className="px-4 py-2 font-semibold">{data.profile?.AnnualSalary}</td>
                    </tr>
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Number of Bonuses
                      </td>
                      <td className="px-4 py-2 flex justify-between items-center">
                        <span className="font-semibold">{data.profile?.NumberOfBonus}</span>
                        <button className="text-blue-400 hover:underline">
                          View Bonus
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Advance Salary</h2>
              <div className="border border-gray-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700">
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400 w-1/2">
                       Current Advance salary
                      </td>
                      <td className="px-4 py-2 font-semibold">{data.profile?.AnnualSalary}</td>
                    </tr>
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Advance Salary EMI
                      </td>
                      <td className="px-4 py-2 font-semibold">₹0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Leaves & Attendance
              </h2>

              <div className="border border-gray-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700">
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400 w-1/2">
                        Shift Timing
                      </td>

                      <td className="px-4 py-2 font-semibold">{data.profile?.shiftTiming}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Casual Leave (balance / total)
                      </td>

                      <td className="px-4 py-2 font-semibold">
                        {Number(
                          data.profile?.leaveSummary?.[0]?.leaveTypeId
                        ) === 3
                          ?`${data.profile?.leaveSummary?.[0].remaining}/${ data.profile?.leaveSummary?.[0]?.allocated}`
                          : "---"}
                      </td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Medical Leave (balance / total)
                      </td>

                      <td className="px-4 py-2 font-semibold">
                         {Number(
                          data.profile?.leaveSummary?.[1]?.leaveTypeId
                        ) === 2
                          ? `${data.profile?.leaveSummary?.[1].remaining}/${data.profile?.leaveSummary?.[1]?.allocated}`
                          : "---"}
                      </td>
                    </tr>


                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Earned Leave (balance / total)
                      </td>

                      <td className="px-4 py-2 font-semibold">
                           {Number(
                          data.profile?.leaveSummary?.[2]?.leaveTypeId
                        ) === 1
                          ? `${data.profile?.leaveSummary?.[2].remaining}/${data.profile?.leaveSummary?.[2]?.allocated}`
                          : "---"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Payment Information</h2>

                <button className="text-blue-400 hover:underline text-sm cursor-pointer">
                  Edit
                </button>
              </div>

              <div className="border border-gray-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700">
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400 w-1/2">PAN</td>
                      <td className="px-4 py-2 text-gray-400">{data.profile?.pan}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">IFSC Code</td>
                      <td className="px-4 py-2 text-gray-400">{data.profile?.IFSCcode}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Account Number
                      </td>
                      <td className="px-4 py-2 text-gray-400">{data.profile?.accountNumber}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Beneficiary Name
                      </td>

                      <td className="px-4 py-2 font-semibold">
                       {data.profile?.name}
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Provident Fund, Professional Tax, ESI & LWF
              </h2>

              <div className="border border-gray-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-700">
                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400 w-1/2">
                        PF Status
                      </td>

                      <td className="px-4 py-2 text-white">
                       {data.profile?.PFStatus}
                      </td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">PF UAN</td>
                      <td className="px-4 py-2 text-gray-400">{data.profile?.PFUAN}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        Professional Tax
                      </td>

                      <td className="px-4 py-2 text-white">{data.profile?.professionalTax}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">LWF Status</td>

                      <td className="px-4 py-2 text-white">{data.profile?.LWFStatus}</td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">ESIC Status</td>

                      <td className="px-4 py-2 text-white">
                        {data.profile?.ESICStatus}
                      </td>
                    </tr>

                    <tr className="h-12">
                      <td className="px-4 py-2 text-gray-400">
                        ESIC IP Number
                      </td>
                      <td className="px-4 py-2 text-gray-400">{data.profile?.ESICIPNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Payment Information</h2>

                <button className="text-blue-400 hover:underline text-sm cursor-pointer">
                  Edit
                </button>
              </div>
              {renderTable(paymentInfo)}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Provident Fund, Professional Tax, ESI & LWF
              </h2>
              {renderTable(pfDetails)}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Other Information</h2>

                <button className="text-blue-400 hover:underline text-sm cursor-pointer">
                  Edit
                </button>
              </div>
              {renderTable(otherDetails)}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                User Roles & Permissions
              </h2>
              {renderTable(userRoles)}
            </div>

            <div className="w-1/2 text-center py-2 rounded-[5px] flex justify-start">
              <button className="btn btn-outline btn-error">
                Submit Resignation
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0C1927] border border-gray-700 rounded p-6 h-fit lg:w-[22%] md:w-full lg:mt-[2.7rem] md:mt-1">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold">Upload Photo</h2>
            <button className="text-blue-400 text-lg font-bold">–</button>
          </div>
          <p className="text-sm text-gray-400">
            Upload a photo for {data.profile?.name}
          </p>
        </div>

        {show && (
          <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50 md:m-[10px] cursor-pointer">
            <div
              className={`bg-[#1e293b] text-white w-full max-w-md rounded-xl shadow-lg p-6 m-[10px] ${
                animation ? "scale-up-center" : "scale-down-center"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit User Detail</h2>
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setAnimation(false);
                    setTimeout(() => {
                      setShow((prev) => !prev);
                      setAnimation(true);
                    }, 300);
                  }}
                >
                  {" "}
                  <RxCross2 />
                </button>
              </div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <input
                type="text"
                className="w-full mb-4 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="Software Engineer"
                name="details"
                value={editDetail.details}
                onChange={(e) => {
                  setEditDetail((prev) => ({
                    ...prev,
                    details: e.target.value,
                  }));
                }}
              />
              <label className="block text-sm font-medium mb-1">
                Experience
              </label>
              <input
                type="text"
                className="w-full mb-4 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="2"
                name="experience"
                value={editDetail.experience}
                onChange={(e) =>
                  setEditDetail((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
              />

              <label className="block text-sm font-medium mb-1">
                Last Company
              </label>
              <input
                type="text"
                className="w-full mb-4 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="Microsoft"
                name="lastCompany"
                value={editDetail.lastCompany}
                onChange={(e) =>
                  setEditDetail((prev) => ({
                    ...prev,
                    lastCompany: e.target.value,
                  }))
                }
              />

              <label className="block text-sm font-medium mb-1">
                ManagerId
              </label>
              <input
                type="text"
                className="w-full mb-2 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="1,2,3"
                name="managerId"
                value={editDetail.managerId}
                onChange={(e) =>
                  setEditDetail((prev) => ({
                    ...prev,
                    managerId: e.target.value,
                  }))
                }
              />

              <label className="block text-sm font-medium mb-1">
                Joining Date
              </label>
              <input
                type="text"
                className="w-full mb-2 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="2025-04-12"
                name="joiningDate"
                value={editDetail.joiningDate}
                onChange={(e) =>
                  setEditDetail((prev) => ({
                    ...prev,
                    joiningDate: e.target.value,
                  }))
                }
              />

              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                type="text"
                className="w-full mb-2 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="1,2,3"
                name="department"
                value={editDetail.department}
                onChange={(e) =>
                  setEditDetail((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              />

              <div className="flex gap-3 justify-end">
                <button
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => {
                    setAnimation(false);
                    setTimeout(() => {
                      setShow((prev) => !prev);
                      setAnimation(true);
                    }, 300);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => handleUpdateUserDetail()}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Profile;
