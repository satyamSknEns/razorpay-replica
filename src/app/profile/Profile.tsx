"use client";
import axios, { AxiosRequestConfig } from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useCookies } from "next-client-cookies";
import Image from "next/image";

const Profile = () => {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<ProfileData>({});
  const [leave, setLeave] = useState<LeaveData | null>(null);
  const [loading, setLoading] = useState(true); 
  const cookies = useCookies();

  useEffect(() => {
    const handleGetcookies = async () => {
      const storeCookies = cookies.get("token");
      setToken(storeCookies ?? null);
    };
    handleGetcookies();
  }, []);

  interface LeaveType {
    allocated: number;
    remaining: number;
    taken: number;
    leaveTypeId: number;
  }

  interface LeaveData {
    attendance: {
      casual: {
        remaining: LeaveType;
        history: any[];
      };
      medical: {
        remaining: LeaveType;
        history: any[];
      };
      earned: {
        remaining: LeaveType;
        history: any[];
      };
    };
  }

  interface ProfileData {
    profile?: {
      id?: number;
      name?: string;
      role?: string;
      email?: string;
      department?: string;
      joiningDate?: string;
      manager?: {
        name?: string;
      };
      serviceDuration?: {
        years?: number;
        months?: number;
        days?: number;
      };
    };
  }

  const paymentInfo = [
    { label: "PAN", value: "-/NA/-" },
    { label: "IFSC Code", value: "-/NA/-" },
    { label: "Account Number", value: "-/NA/-" },
    { label: "Beneficiary Name", value: "Kshiteej Dubey" },
  ];

  const pfDetails = [
    { label: "PF Status", value: "Disabled (not selected)" },
    { label: "PF UAN", value: "-/NA/-" },
    { label: "Professional Tax", value: "Company Disabled" },
    { label: "LWF Status", value: "Company Disabled" },
    { label: "ESIC Status", value: "Registration Not Initiated" },
    { label: "ESIC IP Number", value: "-/NA/-" },
  ];

  const otherDetails = [
    { label: "Phone Number", value: "-/NA/-" },
    { label: "Gender", value: "-/NA/-" },
    { label: "Date of Birth", value: "-/NA/-" },
    { label: "Highest Educational Qualification", value: "-/NA/-" },
    { label: "Aadhaar Number", value: "-/NA/-" },
    { label: "Marital Status", value: "-/NA/-" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const profileConfig: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const profileResponse = await axios.request(profileConfig);
        setData(profileResponse.data);

        const leaveConfig: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserLeave`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const leaveResponse = await axios.request(leaveConfig);
        setLeave(leaveResponse.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const userRoles = [{ label: "Role", value: "Employee / Contractor" }];
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
      <div className="mb-4">
        <h2 className="text-sm text-gray-400">
          People | <span className="text-white">{data?.profile?.name? data?.profile?.name?.charAt(0).toUpperCase() + data?.profile.name.slice(1):"--"}</span>
        </h2>
      </div>

      <main className="flex gap-5 flex-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-1 gap-6 lg:w-[75%] md:w-full w-full">
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <button className="text-blue-400 hover:underline">Edit</button>
            </div>
            <div className="lg:col-span-2 bg-[#0C1927] border border-gray-700 rounded p-6 mb-6">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-700">
                  {[
                    ["Type", `${(data.profile?.role || "--")}`],
                    ["Name", `${(data?.profile?.name || "--")}`],
                    ["Email", `${(data?.profile?.email || "--")}`],
                    [
                      "Date of Hiring",
                      `${
                        (data.profile?.joiningDate
                          ?.toLocaleString()
                          .split("T")[0] || "--")
                      }`,
                    ],
                    ["Title", `${(data?.profile?.department)|| "--"}`],
                    ["Employee ID", `ENS30${(data.profile?.id || "--")}`],
                    ["Department", "Research and Development"],
                    ["Manager", `${(data?.profile?.manager?.name || "--")}`],
                    ["Location", "Uttar Pradesh"],
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
                       <td className="px-4 py-2 font-semibold">₹0</td>                      
                    </tr>                    
                    <tr className="h-12">                      
                      <td className="px-4 py-2 text-gray-400">
                         Number of Bonuses 
                      </td>                      
                      <td className="px-4 py-2 flex justify-between items-center">
                         <span className="font-semibold">0</span>                        
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
                         Current Advance Salary 
                      </td>
                       <td className="px-4 py-2 font-semibold">₹0</td>                      
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
                      
                      <td className="px-4 py-2 font-semibold">09:30 - 18:30</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         Casual Leave (balance / total) 
                      </td>
                      
                      <td className="px-4 py-2 font-semibold">
                        {leave
                          ? `${leave?.attendance?.casual?.remaining?.remaining} / ${leave?.attendance?.casual?.remaining?.allocated}`
                          : "--"}
                      </td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         Medical Leave (balance / total) 
                      </td>
                      
                      <td className="px-4 py-2 font-semibold">{`${leave?.attendance?.medical?.remaining?.remaining}/${leave?.attendance?.medical?.remaining?.allocated}`}</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         Earned Leave (balance / total) 
                      </td>
                      
                      <td className="px-4 py-2 font-semibold">{`${leave?.attendance?.earned?.remaining?.remaining}/${leave?.attendance?.earned?.remaining?.allocated}`}</td>
                      
                    </tr>
                    
                  </tbody>
                  
                </table>
                
              </div>
              
            </div>
            
            <div className="mb-6">
              
              <div className="flex justify-between items-center mb-2">
                
                <h2 className="text-lg font-semibold">Payment Information</h2>
                
                <button className="text-blue-400 hover:underline text-sm">
                   Edit 
                </button>
                
              </div>
              
              <div className="border border-gray-700 rounded overflow-hidden">
                
                <table className="w-full text-sm">
                  
                  <tbody className="divide-y divide-gray-700">
                    
                    <tr className="h-12">
                       <td className="px-4 py-2 text-gray-400 w-1/2">PAN</td>
                       <td className="px-4 py-2 text-gray-400">-/NA/-</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                       <td className="px-4 py-2 text-gray-400">IFSC Code</td>
                       <td className="px-4 py-2 text-gray-400">-/NA/-</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         Account Number 
                      </td>
                       <td className="px-4 py-2 text-gray-400">-/NA/-</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         Beneficiary Name 
                      </td>
                      
                      <td className="px-4 py-2 font-semibold">
                         Kshiteej Dubey 
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
                         Disabled (not selected) 
                      </td>
                      
                    </tr>
                    
                    <tr className="h-12">
                       <td className="px-4 py-2 text-gray-400">PF UAN</td>
                       <td className="px-4 py-2 text-gray-400">-/NA/-</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         Professional Tax 
                      </td>
                      
                      <td className="px-4 py-2 text-white">Company Disabled</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                       <td className="px-4 py-2 text-gray-400">LWF Status</td>
                      
                      <td className="px-4 py-2 text-white">Company Disabled</td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">ESIC Status</td>
                      
                      <td className="px-4 py-2 text-white">
                         Registration Not Initiated 
                      </td>
                      
                    </tr>
                    
                    <tr className="h-12">
                      
                      <td className="px-4 py-2 text-gray-400">
                         ESIC IP Number 
                      </td>
                       <td className="px-4 py-2 text-gray-400">-/NA/-</td>
                      
                    </tr>
                    
                  </tbody>
                  
                </table>
                
              </div>
              
            </div>
            
            <div className="mb-6">
              
              <div className="flex justify-between items-center mb-2">
                
                <h2 className="text-lg font-semibold">Payment Information</h2>
                
                <button className="text-blue-400 hover:underline text-sm">
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
                
                <button className="text-blue-400 hover:underline text-sm">
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
            Upload a photo for Kshiteej Dubey
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
