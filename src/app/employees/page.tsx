"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosRequestConfig } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "next-client-cookies";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import DeleteIcon from "@mui/icons-material/Delete";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseButton from "../components/CloseButton";
import CustomButton from "../components/CustomButton";

interface Data {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  employess: string;
}

interface LeaveResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface EmployeeData {
  leaveResponse?: LeaveResponse[];
}

const Employees = () => {
  const cookies = useCookies();
  const token = cookies.get("token");
  const router = useRouter();
  const [openRegesterPopup, setOpenRegesterPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    employess: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [allEmployee, setAllEmployee] = useState<EmployeeData | null>(null);
  const [details, setDetals] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userUpdate, setUserUpdate] = useState(false);
  const [additionalDetals, setAdditionalDetals] = useState(false);
  const [assignManager, setAssignManager] = useState(false);
  const [assignLeave, setAssignLeave] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmDeletepopup, setConfirmDeletepopup] = useState(false);
  const [departmentType, setDepartmentType] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [leavesTypeList, setLeavesTypeList] = useState("");
  const [quantity, setQuantity] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [currentManagerName, setCurrentManagerName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [additionalDetails, setAdditionalDetails] = useState({
    details: "",
    experience: "",
    lastCompany: "",
    joiningDate: "",
    department: "",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || "",
        email: selectedEmployee.email || "",
        role: selectedEmployee.role || "",
      });
    }
  }, [selectedEmployee]);

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

  useEffect(() => {
    if (!token) return;

    const fetchAllEmployee = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAllEmployees`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const response = await axios.request(config);
        if (response.data.success) {
          const allHistoryes = response.data;
          setAllEmployee(allHistoryes);
        } else {
          console.error("API error:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };

    const fetchAllLeaveType = async () => {
      try {
        const leaveConfig: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAllDepartments`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const allLeavesType = await axios.request(leaveConfig);
        if (allLeavesType.data.success) {
          const allHistoryes = allLeavesType.data.departments;
          setDepartmentType(allHistoryes);
        } else {
          console.error("API error:", allLeavesType.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };

    const fetchAllManager = async () => {
      try {
        const allManagerConfig: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAllManagers`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const managers = await axios.request(allManagerConfig);
        if (managers.status === 200) {
          const allHistoryes = managers.data.managers;
          setManagers(allHistoryes);
        } else {
          console.error("API error:", managers.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };

    const fetchLeavesType = async () => {
      try {
        const leaveConfig: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/allLeaveType`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const allLeavesType = await axios.request(leaveConfig);
        if (allLeavesType.data.success) {
          const allHistoryes = allLeavesType.data.leaveResponse;
          setLeaveTypes(allHistoryes);
        } else {
          console.error("API error:", allLeavesType.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };

    fetchAllEmployee();
    fetchAllLeaveType();
    fetchAllManager();
    fetchLeavesType();
  }, [token]);

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
      setOpenRegesterPopup(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
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

  const handelDeleteEmployee = async (id: number) => {
    try {
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/deleteEmployee`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      };
      await axios.request(updateRequest);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("There is some error to delete the employee", error);
    }
  };

  const fetchEmployeeDetails = async (id: number) => {
    try {
      setLoadingDetails(true);
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      };
      const employeeData = await axios.request(updateRequest);
      setSelectedEmployee(employeeData.data.profile);
      setDetals(true);
    } catch (error) {
      console.error("There is some error to delete the employee", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handelUpdateDetails = async () => {
    try {
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/updateEmployee`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id: selectedEmployee.id, ...formData },
      };
      await axios.request(updateRequest);
      setUserUpdate(false);
      toast.success("Detail is updated successfully !!");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error("Failed to update details");
      console.error(error);
    }
  };

  const fetchAdditionalDetails = async (employeeId: number) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/getDetails`,
        { userId: employeeId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (!response.data?.details) {
        setAdditionalDetails({
          details: "",
          experience: "",
          lastCompany: "",
          joiningDate: "",
          department: "",
        });
        return;
      }

      const profile = response.data.details;

      setAdditionalDetails({
        details: profile.details || "",
        experience: profile.experience || "",
        lastCompany: profile.lastCompany || "",
        joiningDate: profile.joiningDate
          ? new Date(profile.joiningDate).toISOString().split("T")[0]
          : "",
        department: profile.department || "",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setAdditionalDetails({
          details: "",
          experience: "",
          lastCompany: "",
          joiningDate: "",
          department: "",
        });
      } else {
        console.error("Unexpected error fetching details:", error);
        toast.error("Something went wrong while fetching details.");
      }
    } finally {
      setAdditionalDetals(true);
    }
  };

  const handelUpdateAdditionalDetails = async (id: number) => {
    try {
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/addDetails`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { userId: id, ...additionalDetails },
      };
      await axios.request(updateRequest);
      toast.success("Details updated !!");
      setAdditionalDetals(false);
    } catch (error) {
      toast.error("Failed to update additional details");
      console.error(error);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const manageManagerDetails = async (id: number) => {
    try {
      setAssignManager(true);
      setSelectedEmployee(id);
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      };
      const employeeData = await axios.request(updateRequest);

      if (employeeData.status === 200) {
        const currentDetails = employeeData?.data?.profile;
        const details = currentDetails.department;

        if (!details) {
          toast.error("Add details before assigning");
          setAssignManager(false);
          return;
        }

        const currentManager = currentDetails?.manager;
        setSelectedManager(currentManager ? currentManager.id : "");
        setCurrentManagerName(currentManager ? currentManager.name : null);
      } else {
        console.error("There is some error is getting the details !");
      }
    } catch (error) {
      toast.error("Failed to update additional details");
      console.error(error);
    } finally {
    }
  };

  const handleAssignManager = async (id: number) => {
    try {
      if (!id || !selectedManager) {
        toast.error("Please select manager before assigning !!");
        return;
      }

      // if(!)
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/assignManager`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { userId: id, managerId: Number(selectedManager) },
      };
      const assignedManager = await axios.request(updateRequest);
      if (assignedManager.status === 200) {
        setAssignManager(false);
        toast.success("Manager assigned successfully !!");
      } else {
        console.error("There is some error in assigning the manager");
      }
    } catch (error) {
      toast.error("Failed to update additional details");
      console.error(error);
    } finally {
    }
  };

  const handleAssignLeave = async (id: number) => {
    if (!leavesTypeList || !quantity) {
      toast.error("Please select a leave type and enter quantity");
      return;
    }
    try {
      const assignLeaveRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/assignLeave`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: id,
          leaveTypeId: leavesTypeList,
          quantity: Number(quantity),
        },
      };
      const assignedLeave = await axios.request(assignLeaveRequest);
      if (assignedLeave.status === 200) {
        setAssignLeave(false);
      }
      // else {
      //   console.error("There is some error in assigning the leave !");
      // }

      toast.success("Leave assigned successfully !");
      setAssignLeave(false);
    } catch (error) {
      toast.error("Failed to update additional details");
      console.error(error);
    } finally {
      setAssignLeave(false);
      setQuantity("");
      setLeavesTypeList("");
    }
  };

  const [employeeLeaves, setEmployeeLeaves] = useState([]);

  const handleOpenAssignLeave = async (id: number) => {
    setAssignLeave(true);
    setSelectedEmployee({ id });

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setEmployeeLeaves(response?.data?.profile?.leaveSummary || []);
      } else {
        toast.error("Failed to fetch leave details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching leave data");
    }
  };

  const handleOpenEmployeeDetails = async (id: number) => {
    try {
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      };
      const employeeData = await axios.request(updateRequest);

      if (employeeData.status === 200) {
        const currentDetails = employeeData?.data?.profile;
        const details = currentDetails.department;

        if (!details) {
          toast.error("Add details before open the Attendence Details");
          return;
        }
      }
      router.push(`/teams/${id}`);
    } catch (error) {
      console.error("There was some problem to show the details", error);
    }
  };

  return (
    <div className="lg:px-4 md:px-4 sm:px-2 px-2 text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">All Employee Details</h1>

      <div className="flex justify-between pb-3">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          className="border border-gray-500 rounded-md p-2 focus:outline-none text-white"
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <CustomButton
          text="Add to Team"
          onClick={() => setOpenRegesterPopup(true)}
          color="bg-blue-500"
        />
      </div>

      <div className="overflow-x-auto mt-4 rounded">
        <table className="border border-gray-800 text-left min-w-[1500px]">
          <thead className="bg-gray-700 uppercase">
            <tr>
              <th className="p-2 border border-gray-500">ID</th>
              <th className="p-2 border border-gray-500">Name</th>
              <th className="p-2 border border-gray-500">Employee Code</th>
              <th className="p-2 border border-gray-500">Email</th>
              <th className="p-2 border border-gray-500">Role</th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                All Details
              </th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                Emp. Delete
              </th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                Emp. Update
              </th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                Add Details
              </th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                Add Manager
              </th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                Assign Leaves
              </th>
              <th className="p-2 border border-gray-500 text-center whitespace-nowrap">
                Attendence
              </th>
            </tr>
          </thead>
          <tbody>
            {allEmployee?.leaveResponse &&
            allEmployee.leaveResponse.length > 0 ? (
              allEmployee?.leaveResponse
                ?.filter((emp) =>
                  [emp.name, emp.email, emp.role].some((field) =>
                    field.toLowerCase().includes(search.toLowerCase())
                  )
                )
                .map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-gray-600 py-4">
                    <td className="p-2 border border-gray-700">{index + 1}</td>
                    <td className="p-2 border border-gray-700 capitalize">
                      {emp.name}
                    </td>
                    <td className="p-2 border border-gray-700 capitalize">
                      ENS-{emp.id}
                    </td>
                    <td className="p-2 border border-gray-700">{emp.email}</td>
                    <td className="p-2 border border-gray-700 capitalize">
                      {emp.role}
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <span
                        className="bg-blue-600 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                        onClick={() => fetchEmployeeDetails(emp.id)}
                      >
                        <ManageHistoryIcon />
                      </span>
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <span
                        className="bg-red-500 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                        onClick={() => {
                          setConfirmDelete(emp.id);
                          setConfirmDeletepopup(true);
                        }}
                      >
                        <DeleteIcon />
                      </span>
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <span
                        className="bg-blue-500 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setUserUpdate(true);
                        }}
                      >
                        <BrowserUpdatedIcon />
                      </span>
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <span
                        className="bg-blue-500 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          fetchAdditionalDetails(emp.id);
                        }}
                      >
                        <AddToDriveIcon />
                      </span>
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      {emp.role !== "admin" ? (
                        <span
                          className="bg-blue-500 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                          onClick={() => {
                            manageManagerDetails(emp.id);
                          }}
                        >
                          <AssignmentIndIcon />
                        </span>
                      ) : (
                        <p className="text-green-500 border border-gray-500 rounded">
                          Not Applicable
                        </p>
                      )}
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <span
                        className="bg-blue-500 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                        onClick={() => handleOpenAssignLeave(emp.id)}
                      >
                        <CalendarMonthIcon />
                      </span>
                    </td>
                    <td className="p-2 border border-gray-700 text-center">
                      <span
                        className="bg-blue-600 pb-2.5 pt-1 px-2 rounded cursor-pointer"
                        onClick={() => handleOpenEmployeeDetails(emp.id)}
                      >
                        <RecentActorsIcon />
                      </span>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openRegesterPopup && (
        <div
          onClick={() => setOpenRegesterPopup(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[400px] overflow-auto"
          >
            <form
              method="POST"
              onSubmit={handleSubmit}
              className="flex items-center rounded-xl justify-center flex-col"
            >
              <div className="flex justify-between w-full items-center pb-5 border-b-3 border-gray-600 mt-2">
                <h3 className="text-2xl font-semibold">Add Employee</h3>
                <CloseButton onClose={() => setOpenRegesterPopup(false)} />
              </div>

              <div className="w-full mt-3 mb-[1rem]">
                <label className="block text-[14px] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border-1 p-[10px] py-[5px] rounded-[5px]"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
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
                  required
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
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 mt-3"
                >
                  {showConfirmPassword ? (
                    <VisibilityIcon fontSize="small" />
                  ) : (
                    <VisibilityOffIcon fontSize="small" />
                  )}
                </button>
              </div>

              <div className="w-full mb-[1rem] relative">
                <label className="block text-[14px] mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="employess"
                  className="w-full outline-0 border-1 py-[5px] rounded-[5px] appearance-none px-2"
                  value={data.employess}
                  onChange={handleChange}
                  required
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-2 top-[69%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="button w-full">
                <button
                  type="submit"
                  className="w-full border-none cursor-pointer py-2 bg-[#2E5BFF] rounded-[5px]"
                >
                  {loading ? "Submitting..." : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {details && (
        <div
          onClick={() => setDetals(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[350px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 my-2">
              <h3 className="text-2xl font-semibold">Detalis</h3>
              <CloseButton onClose={() => setDetals(false)} />
            </div>

            {loadingDetails ? (
              <p>Loading...</p>
            ) : selectedEmployee ? (
              <div className="text-md">
                <p className="py-1 flex gap-2">
                  <strong>Name : </strong>
                  <span className="capitalize">
                    {selectedEmployee.name || "--"}
                  </span>
                </p>
                <p className="py-1 flex gap-2">
                  <strong>Email : </strong> {selectedEmployee.email || "--"}
                </p>
                <p className="py-1 flex gap-2">
                  <strong>Role : </strong>{" "}
                  <span className="capitalize">
                    {selectedEmployee.role || "--"}
                  </span>
                </p>
                <p className="py-1 flex gap-2">
                  <strong>Prior Experience : </strong>{" "}
                  <span className="capitalize">
                    {selectedEmployee.priorExperience || "--"}
                  </span>
                </p>
                <p className="py-1 flex gap-2">
                  <strong>Total Experience : </strong>{" "}
                  <span className="capitalize">
                    {selectedEmployee.totalExperience || "--"}
                  </span>
                </p>
                <p className="py-1 flex gap-2">
                  <strong>Joining Date : </strong>{" "}
                  <span className="capitalize">
                    {new Date(
                      selectedEmployee.joiningDate
                    ).toLocaleDateString() || "--"}
                  </span>
                </p>
                <p className="py-1 flex gap-2">
                  <strong>Department : </strong>{" "}
                  <span className="capitalize">
                    {selectedEmployee.department || "--"}
                  </span>
                </p>
                {!(selectedEmployee.role === "admin") && (
                  <p className="py-1 flex gap-2">
                    <strong>Manager : </strong>
                    <span className="capitalize">
                      {selectedEmployee?.manager?.name || "--"}
                    </span>
                  </p>
                )}
                <p className="py-1 flex gap-2">
                  <strong>Service Duration :</strong>{" "}
                  <span className="capitalize">
                    {selectedEmployee?.serviceDuration ? (
                      `${selectedEmployee?.serviceDuration.years} year${
                        selectedEmployee.serviceDuration.years !== 1 ? "s" : ""
                      }, 
         ${selectedEmployee.serviceDuration.months} month${
                        selectedEmployee.serviceDuration.months !== 1 ? "s" : ""
                      }, 
         ${selectedEmployee.serviceDuration.days} day${
                        selectedEmployee.serviceDuration.days !== 1 ? "s" : ""
                      }`
                    ) : (
                      <span className="capitalize text-red-300">
                        No Any Duration
                      </span>
                    )}
                  </span>
                </p>

                <h4 className="mt-4 text-lg font-semibold mb-2">
                  Leave Summary :
                </h4>
                {selectedEmployee.leaveSummary &&
                selectedEmployee.leaveSummary.length > 0 ? (
                  <table className="w-full text-left border border-gray-600 rounded">
                    <thead className="bg-gray-700 text-white">
                      <tr>
                        <th className="p-2 border border-gray-600">
                          Leave Type
                        </th>
                        <th className="p-2 border border-gray-600">
                          Allocated
                        </th>
                        <th className="p-2 border border-gray-600">Taken</th>
                        <th className="p-2 border border-gray-600">
                          Remaining
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEmployee.leaveSummary.map((leave: any) => (
                        <tr
                          key={leave.leaveTypeId}
                          className="bg-gray-00 text-white"
                        >
                          <td className="p-2 border border-gray-600 capitalize">
                            {leave.leaveTypeName}
                          </td>
                          <td className="p-2 border border-gray-600">
                            {leave.allocated}
                          </td>
                          <td className="p-2 border border-gray-600">
                            {leave.taken}
                          </td>
                          <td className="p-2 border border-gray-600">
                            {leave.remaining}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mt-2 border border-gray-500 p-1.5 rounded text-red-300">
                    No leave data available
                  </p>
                )}
              </div>
            ) : (
              <p className="bg-red-600 p-2 text-white">No details found</p>
            )}
          </div>
        </div>
      )}

      {userUpdate && (
        <div
          onClick={() => setUserUpdate(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[350px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Update Details</h3>
              <CloseButton onClose={() => setUserUpdate(false)} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handelUpdateDetails();
              }}
              className="py-2"
            >
              <div className="mb-3 px-1">
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full text-white border border-gray-500 p-2 rounded"
                  required
                />
              </div>

              <div className="mb-3 px-1">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full text-white border border-gray-500 p-2 rounded"
                  required
                />
              </div>

              <div className="mb-3 px-1 pb-5 border-b-2 border-gray-600 relative">
                <label className="block mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  required
                  className="w-full text-white border border-gray-500 p-2 rounded bg-gray-600 appearance-none pr-8"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employees">Employee</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-2 top-[55%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white mt-2"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {additionalDetals && (
        <div
          onClick={() => setAdditionalDetals(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[350px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Add Additional Details</h3>
              <CloseButton onClose={() => setAdditionalDetals(false)} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handelUpdateAdditionalDetails(selectedEmployee.id);
              }}
              className="py-2"
            >
              <div className="mb-3 px-1">
                <label className="block mb-1">Details</label>
                <input
                  type="text"
                  value={additionalDetails?.details}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      details: e.target.value,
                    })
                  }
                  required
                  className="w-full text-white border border-gray-500 p-2 rounded"
                />
              </div>

              <div className="mb-3 px-1">
                <label className="block mb-1">Experience</label>
                <input
                  type="number"
                  value={additionalDetails?.experience}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      experience: e.target.value,
                    })
                  }
                  className="w-full text-white border border-gray-500 p-2 rounded"
                  required
                />
              </div>

              <div className="mb-3 px-1">
                <label className="block mb-1">Last Company</label>
                <input
                  type="text"
                  value={additionalDetails?.lastCompany}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      lastCompany: e.target.value,
                    })
                  }
                  className="w-full text-white border border-gray-500 p-2 rounded"
                  required
                />
              </div>

              <div className="mb-3 px-1">
                <label className="block mb-1">Joining Date</label>
                <input
                  type="date"
                  value={additionalDetails.joiningDate || ""}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      joiningDate: e.target.value,
                    })
                  }
                  className="w-full text-white border border-gray-500 p-2 rounded"
                  required
                />
              </div>

              <div className="mb-3 px-1 relative">
                <label className="block mb-1">Department</label>
                <select
                  value={additionalDetails?.department}
                  onChange={(e) =>
                    setAdditionalDetails({
                      ...additionalDetails,
                      department: e.target.value,
                    })
                  }
                  required
                  className="w-full text-white border border-gray-500 p-2 rounded bg-gray-700 appearance-none pr-8"
                >
                  <option value="">Select Department</option>
                  {departmentType?.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-[68%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white mt-2"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignManager && (
        <div
          onClick={() => setAssignManager(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[150px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Assign Manager</h3>
              <CloseButton onClose={() => setAssignManager(false)} />
            </div>
            <div className="my-5 px-1 relative">
              {currentManagerName ? (
                <div className="my-3 px-1 text-gray-300">
                  <p>
                    Current Manager:{" "}
                    <span className="font-semibold text-white">
                      {currentManagerName}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="font-semibold text-[#91d0ff] my-3">
                  Please fill in the details before assigning a manager.
                </p>
              )}

              <label className="block mb-1.5">Managers</label>
              <select
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="w-full text-white border border-gray-500 p-2 rounded bg-gray-700 appearance-none pr-8"
                required
              >
                <option value="">Select Manager</option>
                {managers?.map((dept: any) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 bottom-[5%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="flex justify-end">
              <CustomButton
                text="Update"
                onClick={() => handleAssignManager(selectedEmployee)}
                color="bg-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {assignLeave && (
        <div
          onClick={() => setAssignLeave(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[150px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Assign Leave</h3>
              <CloseButton onClose={() => setAssignLeave(false)} />
            </div>

            <div className="my-4">
              <h4 className="text-lg font-semibold mb-2">Existing Leaves</h4>
              {employeeLeaves.length > 0 ? (
                <table className="w-full border border-gray-700 text-sm rounded">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-2 border border-gray-700 text-left">
                        Leave Type
                      </th>
                      <th className="p-2 border border-gray-700 text-center">
                        Allocated
                      </th>
                      <th className="p-2 border border-gray-700 text-center">
                        Taken
                      </th>
                      <th className="p-2 border border-gray-700 text-center">
                        Remaining
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeLeaves?.map((leave: any, index: number) => (
                      <tr key={leave.id || index} className="hover:bg-gray-700">
                        <td className="p-2 border border-gray-700">
                          {leave.leaveTypeName}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {leave.allocated}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {leave.taken}
                        </td>
                        <td className="p-2 border border-gray-700 text-center">
                          {leave.remaining}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 text-sm">No leave records found.</p>
              )}
            </div>

            <div className="my-5 px-1 relative">
              <label className="block mb-1">Leave Type</label>
              <select
                value={leavesTypeList}
                onChange={(e) => setLeavesTypeList(e.target.value)}
                className="w-full text-white border border-gray-500 p-2 rounded bg-gray-700 appearance-none pr-8"
                required
              >
                <option value="">Select Leave Type</option>
                {leaveTypes?.map((dept: any) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 top-[70%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="mb-3 px-1">
              <label className="block mb-1">Quantity</label>
              <input
                type="number"
                value={quantity}
                placeholder="ex.4"
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 rounded border border-gray-500 text-white"
                required
              />
            </div>
            <div className="flex justify-end">
              <CustomButton
                text="Add"
                onClick={() => handleAssignLeave(selectedEmployee.id)}
                color="bg-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {confirmDeletepopup && (
        <div
          onClick={() => setConfirmDeletepopup(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[150px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 mt-2">
              <h3 className="text-2xl font-semibold">Delete Employee</h3>
              <CloseButton onClose={() => setConfirmDeletepopup(false)} />
            </div>

            <div>
              <h4 className="text-md border-b border-gray-500 py-5">
                Are you sure you want to delete this employee? This action
                cannot be undone.
              </h4>
              <div className="flex gap-3 my-3 justify-end">
                <CustomButton
                  text="Yes"
                  onClick={() =>
                    confirmDelete !== null &&
                    handelDeleteEmployee(confirmDelete)
                  }
                  color="bg-red-500"
                />
                <CustomButton
                  text="No"
                  onClick={() => setConfirmDeletepopup(false)}
                  color="bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
