"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";
import Button from "@mui/material/Button";
import Calender from "@/app/attendence/Calender";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import CustomButton from "@/app/components/CustomButton";
import CloseButton from "@/app/components/CloseButton";

interface Attendance {
  id: number;
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  remarks?: string | null;
}

interface LeaveBalance {
  leaveTypeId: number;
  allocated: number;
  taken: number;
  remaining: number;
}

interface Employee {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  details?: {
    details: string;
    experience: number;
    lastCompany: string;
    joiningDate: string;
    department: number;
  };
  attendance: Attendance[];
  leaveBalances: LeaveBalance[];
}

interface requestList {
  pending: requestList[];
  requester: { name: string };
  leaveType: { name: string };
  fromDate: string;
  toDate: string;
  inTime?: string;
  outTime?: string;
  checkOut?: string;
  checkIn?: string;
  remarks?: string;
  attendance?: any;
}

type GroupedLeaves = {
  [key: string]: string[];
};

export interface LeaveItem {
  id: number;
  userId: number;
  managerId: number;
  leaveTypeName: string;
  takenAt: string;
  name: string;
  leaveTypeId: string;
  quantity: number;
  fromDate: string;
  toDate: string;
  date: string | null;
  checkIn: string | null;
  checkOut: string | null;
  remarks: string | null;
  status: "approved" | "rejected" | "pending" | string;
  approvedBy: number | null;
  clientInfo: string;
  createdAt: string;
  updatedAt: string;
}

const EmployeeDetail = () => {
  const { id } = useParams();
  const cookies = useCookies();
  const token = cookies.get("token");
  const [view, setView] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [requestList, setRequestList] = useState<requestList | null>(null);
  const [allrequestList, setAllRequestList] = useState<requestList | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [leaveHistory, setLeaveHistory] = useState<LeaveItem[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveItem[]>([]);
  const [delAnimation, setDelAnimation] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [deleteReq, setDeleteReq] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [editData, setEditData] = useState({
    userId: id,
    id: id,
    checkIn: "",
    checkOut: "",
    remarks: "",
    leaveTypeName: "",
    date: "",
  });

  const [deletePayload, setDeletePayload] = useState<{
    userId: number | null;
    date: string | null;
  }>({
    userId: null,
    date: null,
  });

  const [editFormErrors, setEditFormErrors] = useState({
    leaveTypeName: "",
    remarks: "",
    checkIn: "",
    checkOut: "",
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const [formErrors, setFormErrors] = useState({
    leaveTypeName: "",
    fromDate: "",
    toDate: "",
    remarks: "",
  });

  const [formData, setFormData] = useState({
    userId: id,
    leaveTypeName: "",
    fromDate: "",
    toDate: "",
    remarks: "",
  });

  const fetchData = async () => {
    if (!id || !token) return;

    try {
      const res = await axios.request({
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/listEmployeeForManager`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          userId: id,
        },
      });

      const listRequests = await axios.request({
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAttendanceDetails`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          id: id,
        },
      });
      const listAllRequests = await axios.request({
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/listRequests`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          id: id,
        },
      });

      const requestData = listRequests?.data;
      setRequestList(requestData || null);
      const requestAllLeaveData = listAllRequests?.data;
      setAllRequestList(requestAllLeaveData || null);

      const empList: Employee[] = res.data.employees || [];
      const found = empList.find((e) => e.user.id === Number(id));
      setEmployee(found || null);
    } catch (error) {
      console.error("Employee detail fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handelApprove = async () => {
    try {
      const requestApprove = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reviewLeave`,
        {
          requestId: selectedIds,
          approve: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = await axios.request(requestApprove);

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err: any) {
      console.error(
        "Error approving request:",
        err.requestApprove?.data || err.message
      );
    }
  };

  const handelReject = async () => {
    try {
      const requestApprove = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/reviewLeave`,
        {
          requestId: selectedIds,
          approve: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = await axios.request(requestApprove);

      if (response.status === 200) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err: any) {
      console.error(
        "Error approving request:",
        err.requestApprove?.data || err.message
      );
    }
  };

  const handelCanceledApprove = async () => {
    try {
      const payload = {
        userId: id,
        date: deletePayload.date,
      };

      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/deleteAttendance`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      };

      await axios.request(updateRequest);
      handleRefresh();
      setDeleteReq(false);
    } catch (error: any) {
      console.error("There is something wrong", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchLeaveData = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getApproveLeave`,
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
          const allHistoryes: LeaveItem[] = response.data.data;
          setLeaveHistory(allHistoryes);
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
          const allHistoryes: LeaveItem[] = allLeavesType.data.leaveResponse;
          setLeaveTypes(allHistoryes);
        } else {
          console.error("API error:", allLeavesType.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };
    fetchLeaveData();
    fetchAllLeaveType();
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [id, token]);

  useEffect(() => {
    if (!token) return;

    const fetchLeaveData = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserLeave`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            userId: id,
          },
        };
        const response = await axios.request(config);
        const attendence = response.data.attendance;
        const allHistoryes = Object.values(attendence).flatMap(
          (item: any) => item.history
        );
        setLeaveHistory(allHistoryes);
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };
    fetchLeaveData();
  }, [token]);

  const groupedLeaves: GroupedLeaves = leaveHistory?.reduce((acc, leave) => {
    const type = leave.leaveTypeName;
    const formattedDate = new Date(leave.takenAt).toLocaleDateString("en-GB");

    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(formattedDate);
    return acc;
  }, {} as GroupedLeaves);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!employee) return <p className="text-white">Employee not found.</p>;

  const generateAllDatesOfMonth = (date: any) => {
    const year = date.year();
    const month = date.month();
    const daysInMonth = date.daysInMonth();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(dayjs(new Date(year, month, day)).format("YYYY-MM-DD"));
    }
    return dates;
  };

  const allDates = generateAllDatesOfMonth(selectedMonth);

  const handleData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));

    if (editFormErrors[name as keyof typeof editFormErrors]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (name === "leaveTypeName") {
      setEditFormErrors({
        leaveTypeName: "",
        checkIn: "",
        checkOut: "",
        remarks: "",
      });
    }
  };

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const validateEditForm = () => {
    let valid = true;
    const newError = {
      leaveTypeName: "",
      remarks: "",
      checkIn: "",
      checkOut: "",
    };
    if (!editData.leaveTypeName || editData.leaveTypeName == "status") {
      newError.leaveTypeName = "Status is required";
      valid = false;
    }
    if (editData.leaveTypeName == "present") {
      if (!editData.checkIn) {
        newError.checkIn = "Check In is required";
        valid = false;
      }
      if (!editData.checkOut) {
        newError.checkOut = "Check Out is required";
        valid = false;
      }
    } else {
      if (!editData.remarks) {
        newError.remarks = "Remarks is required";
        valid = false;
      }
    }
    setEditFormErrors(newError);
    return valid;
  };

  const EditAttendance = async () => {
    if (!validateEditForm()) {
      return;
    }

    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/applyLeaveByManager`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: editData,
      };
      const response = await axios.request(config);
      console.log(response.data);
      setOpen(false);
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const toInputFormat = (displayDate: string) => {
    if (!displayDate) return "";
    const [day, month, year] = displayDate.split("-");
    return `${year}-${month}-${day}`;
  };

  const toDisplayFormat = (isoDate: string) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "fromDate" || name === "toDate") {
      formattedValue = toDisplayFormat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const applyLeave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!token) return console.error("Token not found");
    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/applyLeave`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };

      await axios.request(config);
      toast.success("Leave is applyed successfully !");
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      leaveTypeName: "",
      fromDate: "",
      toDate: "",
      remarks: "",
    };

    if (!formData.leaveTypeName) {
      newErrors.leaveTypeName = "Leave type is required";
      valid = false;
    }

    if (!formData.fromDate) {
      newErrors.fromDate = "From date is required";
      valid = false;
    }

    if (!formData.toDate) {
      newErrors.toDate = "To date is required";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allIds = requestList?.pending?.map((item: any) => item.id) || [];
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckbox = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedIds, id];
      setSelectedIds(newSelected);
      if (newSelected.length === requestList?.pending.length) {
        setSelectAll(true);
      }
    }
  };

  const getLeaveTypeName = (id: string) => {
    const leave = leaveTypes.find((l) => l.id === Number(id));
    return leave ? leave.name : id;
  };

  return (
    <div className="lg:px-6 md:px-6 sm:px-2 px-2 text-white">
      <h1 className="text-md font-bold text-[#3c5cd7] mb-4">
        People / {employee.user.name} /
        <span className="text-white ml-1">Leave and attendance</span>
      </h1>
      <section className="flex justify-between flex-wrap gap-2">
        <div className="lg:w-[75%] md:w-full sm:w-full w-full">
          <div className="w-full overflow-x-auto mb-8">
            <Calender onMonthChange={(date) => setSelectedMonth(date)} />
            <button
              className="btn btn-primary bg-blue-600 mt-4"
              onClick={() => {
                setVisible((prev) => !prev);
                setFormErrors({
                  leaveTypeName: "",
                  fromDate: "",
                  toDate: "",
                  remarks: "",
                });
              }}
            >
              Apply leave
            </button>
          </div>
          <section className="mb-6 bg-gray-800 border border-gray-700 p-4 rounded">
            <h2 className="text-lg font-semibold mb-1">All Request</h2>
            <div className="overflow-x-auto">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                <label>Select All</label>
              </div>

              {allrequestList?.pending?.length === 0 ? (
                <p>No attendance record found.</p>
              ) : (
                allrequestList?.pending?.map((data: any) => (
                  <div
                    key={data.id}
                    className="flex  gap-2 items-start w-full my-2 border-b border-gray-600 pb-3"
                  >
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(data.id)}
                        onChange={() => handleCheckbox(data.id)}
                      />
                    </div>
                    <div className="lg:w-full md:w-full sm:w-full w-full">
                      {data.leaveType ? (
                        <>
                          <span className="mx-1 capitalize">
                            {data.requester.name}
                          </span>
                          - has requested for -
                          <span className="mx-1 capitalize">
                            {data.leaveType.name}
                          </span>
                          leave of -
                          <span className="mx-1">{data.quantity}</span> days,
                          from {dayjs(data.fromDate).format("DD/MM/YYYY")}
                          <span className="mx-2">to</span>
                          {dayjs(data.toDate).format("DD/MM/YYYY")} and reason
                          is -
                          <span className="mx-1 capitalize">
                            {data.remarks}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="mx-1 capitalize">
                            {data.requester.name}
                          </span>
                          - has requested attendance on {data.date} and time is
                          <span className="mx-1 capitalize">
                            {data.checkIn}
                          </span>
                          -<span className="mx-1">{data.checkOut}</span> due to
                          - {data.remarks}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          <div className="flex gap-3 lg:w-[38%] mb-5 md:w-full sm:w-full">
            <Button
              onClick={() => handelApprove()}
              color="primary"
              variant="contained"
              className="hover:bg-blue-700"
            >
              Approve
            </Button>
            <Button
              onClick={() => handelReject()}
              variant="outlined"
              color="warning"
              className="hover:bg-[#ED6C02] hover:text-white"
            >
              Reject
            </Button>
          </div>

          <section className="mb-6 overflow-auto">
            <h2 className="text-lg font-semibold">Attendance</h2>
            <p className="text-md text-gray-300">
              To update your attendance data, please click on the edit button
              next to each date.
            </p>

            <div className="my-5 w-full min-w-[900px] overflow-x-auto">
              <table className="text-sm flex flex-col w-full border border-gray-700 rounded">
                <thead>
                  <tr className="bg-gray-800 flex justify-between">
                    <th className="p-4 text-start w-40">Date</th>
                    <th className="p-4 text-center w-28">Status</th>
                    <th className="p-4 text-center w-28">Check In</th>
                    <th className="p-4 text-center w-28">Check Out</th>
                    <th className="p-4 text-center w-28">Duration</th>
                    <th className="p-4 text-center flex-1">Remarks</th>
                    <th className="p-4 text-center flex-1">Client Info</th>
                    <th className="p-4 text-center w-12">Edit</th>
                  </tr>
                </thead>

                <tbody className="w-full flex flex-col">
                  {allDates.map((date) => {
                    const record = requestList?.attendance?.find(
                      (a: any) =>
                        new Date(a.date).toISOString().split("T")[0] === date
                    );

                    const today = new Date().toISOString().split("T")[0];
                    const isPastDate = date < today;

                    const rawStatus = String(record?.status ?? "")
                      .trim()
                      .toLowerCase();
                    const normalizedStatus =
                      rawStatus === "casul" ? "casual" : rawStatus;

                    const leaveStatuses = ["earned", "casual", "medical"];
                    const isLeaveStatus =
                      leaveStatuses.includes(normalizedStatus);

                    const finalStatus = record?.status
                      ? normalizedStatus
                      : isPastDate
                      ? "absent"
                      : "--";

                    const badgeClasses: Record<string, string> = {
                      earned: "bg-[#d087002e] text-[#c1830c] p-1 rounded-full",
                      casual: "bg-[#d92d202e] text-[#f96c62] p-1 rounded-full",
                      medical: "bg-[#d087002e] text-[#c1830c] p-1 rounded-full",
                      absent: "bg-[#ff00002e] text-[#ff5b5b] p-1 rounded-full",
                      default: "bg-[#d087002e] text-[#c1830c] p-1 rounded-full",
                    };

                    const badgeClass =
                      badgeClasses[finalStatus] ?? badgeClasses.default;

                    return (
                      <tr
                        key={date}
                        className="border-b border-gray-600 w-full flex items-center justify-between"
                      >
                        <td className="p-4 items-center w-40">
                          {new Date(date).toLocaleDateString("en-GB")}
                        </td>

                        {isLeaveStatus || finalStatus === "absent" ? (
                          <>
                            <td className="p-4 flex-1 flex items-start justify-start">
                              <div
                                className={`flex w-20 items-center justify-center font-semibold ${badgeClass}`}
                                title={
                                  finalStatus.charAt(0).toUpperCase() +
                                  finalStatus.slice(1)
                                }
                              >
                                <span className="text-[12px]">
                                  {finalStatus.charAt(0).toUpperCase() +
                                    finalStatus.slice(1)}
                                </span>
                              </div>
                            </td>

                            <td
                              className="p-4 items-center flex justify-center w-12 cursor-pointer"
                              onClick={() => {
                                setDelAnimation(true);
                                setOpen(true);
                                setEditData({
                                  userId: id,
                                  id: record?.id || "",
                                  checkIn: record?.checkIn || "",
                                  checkOut: record?.checkOut || "",
                                  remarks: record?.remarks || "",
                                  leaveTypeName: record?.status || finalStatus,
                                  date: dayjs(date).format("DD-MM-YYYY"),
                                });
                                setEditFormErrors({
                                  leaveTypeName: "",
                                  checkIn: "",
                                  checkOut: "",
                                  remarks: "",
                                });
                              }}
                            >
                              <PiPencilSimpleLineFill className="text-blue-700" />
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 text-center w-28">
                              <div
                                className={
                                  record?.status?.trim()
                                    ? "text-center bg-[#00a3522e] text-[#49d08c] p-1 rounded-full"
                                    : "text-center text-gray-400 p-1"
                                }
                              >
                                {record?.status?.trim()
                                  ? record.status.charAt(0).toUpperCase() +
                                    record.status.slice(1)
                                  : "--"}
                              </div>
                            </td>

                            <td className="p-4 text-center w-28">
                              {record?.checkIn || "--"}
                            </td>

                            <td className="p-4 text-center w-28">
                              {record?.checkOut || "--"}
                            </td>

                            <td className="p-4 text-center w-28">
                              {record?.duration || "--"}
                            </td>

                            <td className="p-4 text-center flex-1">
                              {record?.remarks || "--"}
                            </td>

                            <td className="p-4 text-center flex-1">
                              {record?.clientInfo
                                ? JSON.parse(record.clientInfo).ip || "--"
                                : "--"}
                            </td>

                            <td
                              className="p-4 text-center flex justify-center w-12 cursor-pointer"
                              onClick={() => {
                                setDelAnimation(true);
                                setOpen(true);
                                setEditData({
                                  userId: id,
                                  id: record?.id || "",
                                  checkIn: record?.checkIn || "",
                                  checkOut: record?.checkOut || "",
                                  remarks: record?.remarks || "",
                                  leaveTypeName: record?.status || "",
                                  date: dayjs(date).format("DD-MM-YYYY"),
                                });
                                setEditFormErrors({
                                  leaveTypeName: "",
                                  checkIn: "",
                                  checkOut: "",
                                  remarks: "",
                                });
                              }}
                            >
                              <PiPencilSimpleLineFill className="text-blue-700" />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[200px] overflow-auto"
            >
              <div className="flex justify-between items-center border-b-2 border-gray-600 pb-3 pt-2 mb-3">
                <h2 className="text-xl font-semibold">Edit Attendance</h2>

                <CloseButton onClose={() => setOpen(false)} />
              </div>
              <div className="flex flex-col gap-1 relative">
                <label>Status</label>
                <select
                  className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white appearance-none pr-8"
                  name="leaveTypeName"
                  value={editData.leaveTypeName}
                  onChange={handleData}
                >
                  <option value="status">Status</option>
                  <option value="present">Present</option>
                  <option value="earned">Earned Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="medical">Medical Leave</option>
                </select>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-2 top-[58%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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

                {editFormErrors.leaveTypeName && (
                  <p className="text-red-500 text-xs">
                    {editFormErrors.leaveTypeName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label>Check In</label>
                <input
                  type="text"
                  name="checkIn"
                  value={editData.checkIn?.slice(0, 5)}
                  className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white"
                  placeholder="hh:mm"
                  onChange={handleData}
                />
                {editFormErrors.checkIn && (
                  <p className="text-red-500 text-xs">
                    {editFormErrors.checkIn}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium mb-1">
                  Check Out
                </label>
                <input
                  type="text"
                  name="checkOut"
                  value={editData.checkOut?.slice(0, 5)}
                  className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white"
                  placeholder="hh:mm"
                  onChange={handleData}
                />
                {editFormErrors.checkOut && (
                  <p className="text-red-500 text-xs">
                    {editFormErrors.checkOut}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="block text-sm font-medium mb-1">
                  Remarks
                </label>
                <input
                  type="text"
                  className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white"
                  placeholder="Go to home"
                  name="remarks"
                  value={editData.remarks}
                  onChange={handleData}
                />
                {editFormErrors.remarks && (
                  <p className="text-red-500 text-xs ">
                    {editFormErrors.remarks}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => {
                    setDeletePayload({
                      userId: Number(id),
                      date: editData.date,
                    });
                    setDeleteReq(true);
                    setOpen(false);
                  }}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeout(() => {
                      setOpen(false);
                    }, 300);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => {
                    EditAttendance();
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteReq && (
          <div
            onClick={() => setDeleteReq(false)}
            className="fixed inset-0 bg-black/80  flex items-center justify-center z-50 md:m-[10px] cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`bg-[#1e293b] text-white w-full max-w-md rounded-xl shadow-lg  m-[10px]  ${
                delAnimation ? "scale-up-center" : "scale-down-center"
              }`}
            >
              <div className="flex justify-between items-center mb-2 border-b-1 border-gray-500 p-4">
                <h2 className="text-xl font-semibold">
                  Delete Attendance Records
                </h2>
                <button
                  className="cursor-pointer p-2"
                  onClick={() => {
                    setDelAnimation((prev) => !prev);
                    setTimeout(() => {
                      setDeleteReq(false);
                      setDelAnimation(true);
                    }, 300);
                  }}
                >
                  <RxCross2 />
                </button>
              </div>

              <div className="text-[18px] font-semibold my-3 border-b-1 border-gray-500 p-4">
                Are you sure you want to delete this attendance record?
              </div>

              <div className="flex gap-3 justify-end p-4">
                <button
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => {
                    setDelAnimation((prev) => !prev);
                    setTimeout(() => {
                      setDeleteReq(false);
                      setDelAnimation(true);
                    }, 300);
                  }}
                >
                  No
                </button>
                <button
                  onClick={() => {
                    handelCanceledApprove();
                  }}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {visible && (
          <div
            onClick={() => setVisible(false)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-4 mx-4 animate-scale-up-center min-h-[200px] overflow-auto"
            >
              <div className="flex justify-between items-center border-b-2 border-gray-600 mb-3">
                <h2 className="text-xl font-semibold mb-6">Apply for Leave</h2>
                <CloseButton onClose={() => setVisible(false)} />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1 relative">
                  <label>Status</label>
                  <select
                    name="leaveTypeName"
                    value={formData.leaveTypeName}
                    onChange={handleChange}
                    className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white appearance-none pr-8"
                  >
                    <option value="">Select status</option>
                    <option value="casual">Casual Leave</option>
                    <option value="medical">Medical Leave</option>
                    <option value="earned">Earned Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-3 top-[58%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
                  {formErrors.leaveTypeName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.leaveTypeName}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1 flex flex-col gap-1">
                    <label>From</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={toInputFormat(formData.fromDate)}
                      onChange={handleChange}
                      className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white"
                    />
                    {formErrors.fromDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fromDate}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label>To</label>
                    <input
                      type="date"
                      name="toDate"
                      value={toInputFormat(formData.toDate)}
                      onChange={handleChange}
                      className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white"
                    />
                    {formErrors.toDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.toDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label>
                    Remarks <span className="text-gray-400">(optional)</span>
                  </label>

                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white resize-none"
                    rows={3}
                    placeholder="Add any comments..."
                  />
                  {formErrors.remarks && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.remarks}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => setVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => {
                      if (validateForm()) {
                        applyLeave();
                      }
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="bg-gray-800 p-4 rounded shadow h-fit lg:w-[22%] md:w-full sm:w-full w-full">
          <h3 className="text-lg font-semibold mb-4">Your Leave Balance</h3>
          <ul className="space-y-2 text-sm">
            {employee.leaveBalances.length === 0
              ? ["earned", "medical", "casual"].map((type, idx) => (
                  <li key={idx} className="text-gray-300 text-lg italic">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    <span className="block text-gray-400 text-sm -mt-0.5 not-italic">
                      0 / 0
                    </span>
                  </li>
                ))
              : employee.leaveBalances.map((l) => {
                  const name = getLeaveTypeName(String(l.leaveTypeId));
                  const remaining = l.remaining ?? 0;
                  const allocated = l.allocated ?? 0;

                  return (
                    <li
                      key={l.leaveTypeId}
                      className="text-gray-300 text-lg italic"
                    >
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                      <span className="block text-gray-400 text-sm -mt-0.5 not-italic">
                        {`${remaining} / ${allocated}`}
                      </span>
                    </li>
                  );
                })}
          </ul>
          <CustomButton
            text="View Leaves Taken"
            onClick={() => {
              setView(true);
            }}
            color="bg-blue-600 w-full mt-3"
          />
        </section>
      </section>

      {view && (
        <div
          onClick={() => setView(false)}
          className="fixed inset-0 bg-opacity-80 bg-[#212020ad] flex items-center justify-center z-50 "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-gray-800 rounded px-4 pb-4 w-[500px] min-h-[300px] max-h-[550px] overflow-auto transition-all`}
          >
            <div className="flex justify-between border-b-2 border-gray-500 py-4 items-center">
              <h2 className="text-2xl font-semibold text-gray-200">
                Leaves taken
              </h2>
              <CloseButton onClose={() => setView(false)} />
            </div>

            <ul>
              {groupedLeaves &&
                Object.entries(groupedLeaves).map(([type, dates], index) => (
                  <li
                    key={index}
                    className={`py-3 text-sm ${
                      index !== Object.keys(groupedLeaves).length - 1
                        ? "border-b-2 border-gray-500"
                        : ""
                    }`}
                  >
                    <div className="text-md font-semibold pb-1">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                    {dates.map((date, idx) => (
                      <div key={idx}>{date}</div>
                    ))}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
