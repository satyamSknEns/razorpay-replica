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
import CloseIcon from "@mui/icons-material/Close";

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
}

export interface LeaveItem {
  id: number;
  userId: number;
  managerId: number;
  leaveTypeName: string;
  takenAt: string;
  leaveTypeId: number;
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
  const [loading, setLoading] = useState(true);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [remark, setRemark] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [attendenceType, setAttendenceType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveItem[]>([]);
  const [delAnimation, setDelAnimation] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [animation, setAnimation] = useState<boolean>(true);
  const [deleteReq, setDeleteReq] = useState(false);
  const [visible, setVisible] = useState(false);
  const [applyAnimation, setApplyAnimation] = useState<boolean>(true);
  const [editData, setEditData] = useState({
    checkIn: "",
    checkOut: "",
    remarks: "",
    leaveTypeName: "",
    date: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({
    leaveTypeName: "",
    remarks: "",
    checkIn: "",
    checkOut: "",
  });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelectedId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  console.log("selectedId", selectedId);

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
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/listEmployees`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          managerId: 5,
          from: "2025-08-13",
          to: "2025-09-11",
        },
      });
      const listRequests = await axios.request({
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/listRequests`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const requestData = listRequests?.data;
      console.log("---", requestData.pending);
      setRequestList(requestData || null);

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
      console.log("Approved:", requestApprove.data);
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
      console.log("Approved:", requestApprove.data);
    } catch (err: any) {
      console.error(
        "Error approving request:",
        err.requestApprove?.data || err.message
      );
    }
  };

  const handleUpdateLeave = async () => {
    try {
      const updateRequest = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/updateRequest`,
        {
          requestId: selectedLeave,
          employeeName,
          leaveTypeName: leaveType,
          fromDate,
          toDate,
          checkIn: inTime,
          checkOut: outTime,
          remark: remark,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Approved:", updateRequest.data);

      setUpdatePopup(false);
    } catch (error: any) {
      throw error("There is something wrong");
    }
  };

  const handelCanceledApprove = async (
    responseId: number,
    status: "approved" | "rejected"
  ) => {
    try {
      const updateRequest: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/updateResponse`,
        method: "POST", // ✅ aapki API PUT hai
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          responseId,
          status,
        },
      };

      await axios.request(updateRequest);
      // if (response.status === 200) {
      //   console.log("Updated:", response.data);
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 500);
      // }
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
          console.log("leave history", allHistoryes);
        } else {
          console.error("API error:", response.data.message);
        }
      } catch (error) {
        console.error("Failed to fetch the data", error);
      }
    };
    fetchLeaveData();
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [id, token]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!employee) return <p className="text-white">Employee not found.</p>;

  function generateAllDatesOfMonth() {
    const dates = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 2; day <= daysInMonth + 1; day++) {
      const date = new Date(year, month, day);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  }
  const allDates = generateAllDatesOfMonth();

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
  // const handleRefresh = () => {
  //   window.location.reload();
  // };
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
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/upsertAttendance`,
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
      // handleRefresh();
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
      formattedValue = toDisplayFormat(value); // store in DD-MM-YYYY
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    console.log("2222222", formData);
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
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/applyLeaveByManager`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      };

      await axios.request(config);
      setVisible(false);
      // handleRefresh();
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
      // select all IDs
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
      if (newSelected.length === requestList.pending.length) {
        setSelectAll(true); 
      }
    }
  };

  console.log("✅ Selected IDs: ", selectedIds);

  // console.log("leaveHistorywq", leaveHistory);
  return (
    <div className="p-6 text-white">
      <h1 className="text-md font-bold text-[#3c5cd7] mb-4">
        People / {employee.user.name} /
        <span className="text-white ml-1">Leave and attendance</span>
      </h1>
      <section className="flex justify-between flex-wrap gap-2">
        <div className="lg:w-[70%] md:w-full sm:w-full w-full">
          <div className="w-full overflow-x-auto mb-8">
            <Calender />
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

              {requestList?.pending?.length === 0 ? (
                <p>No attendance record found.</p>
              ) : (
                requestList.pending.map((data: any, index: number) => (
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
                          from {data.fromDate} to {data.toDate} and reason is -
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

          <section className="p-4 border border-gray-600 bg-gray-800 mb-6 rounded">
            <h2 className="text-lg font-bold mb-3">Leave Requests</h2>

            {leaveHistory.length === 0 ? (
              <p className="text-gray-500">No leave requests found.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center mb-3 ">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedId(
                          e.target.checked ? leaveHistory.map((l) => l.id) : []
                        )
                      }
                      checked={
                        selectedId.length === leaveHistory.length &&
                        leaveHistory.length > 0
                      }
                    />
                    Select All
                  </label>
                </div>

                {leaveHistory.map((leave) => (
                  <div key={leave.id} className="border-b border-gray-600 pb-3">
                    <div className="flex items-center gap-2 ">
                      <input
                        type="checkbox"
                        checked={selectedId.includes(leave.id)}
                        onChange={() => handleSelect(leave.id)}
                      />
                      <span>
                        {employee.user.name} requested
                        {leave.leaveTypeId === 1
                          ? "Casual"
                          : leave.leaveTypeId === 2
                          ? "Medical"
                          : "Earned"}
                        leave from
                        {new Date(leave.fromDate).toLocaleDateString()} to
                        {new Date(leave.toDate).toLocaleDateString()} due to
                        {leave.remarks || "--"} ({leave.status})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex gap-2 items-center mt-5 mb-5">
            <Button
              onClick={() =>
                selectedId.forEach((id) =>
                  handelCanceledApprove(id, "approved")
                )
              }
              color="primary"
              variant="contained"
              className="hover:bg-blue-700"
            >
              Approve
            </Button>
            <Button
              onClick={() =>
                selectedId.forEach((id) =>
                  handelCanceledApprove(id, "rejected")
                )
              }
              variant="outlined"
              color="warning"
              className="hover:bg-[#ED6C02] hover:text-white"
            >
              Reject
            </Button>
          </div>

          <section className="mb-6">
            <h2 className="text-lg font-semibold">Attendance</h2>
            <p className="text-md text-gray-300">
              To update your attendance data, please click on the edit button
              next to each date.
            </p>
            <div className="my-5 w-full">
              {employee.attendance.length === 0 ? (
                <p>No attendance record found.</p>
              ) : (
                <table className="text-sm flex flex-col w-full border border-gray-700 rounded">
                  <thead>
                    <tr className="bg-gray-800 flex justify-between">
                      <th className="p-4 items-center">Date</th>
                      <th className="p-4 items-center">Status</th>
                      <th className="p-4 items-center">Check In</th>
                      <th className="p-4 items-center">Check Out</th>
                      <th className="p-4 items-center">Duration</th>
                      <th className="p-4 items-center">Remarks</th>
                      <th className="p-4 items-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="w-full flex flex-col">
                    {allDates.map((date) => {
                      const record = employee.attendance.find(
                        (a) =>
                          new Date(a.date).toISOString().split("T")[0] === date
                      );

                      return (
                        <tr
                          key={date}
                          className="border-b border-gray-600 w-full flex justify-between"
                        >
                          <td className="p-4 items-center">
                            {new Date(date).toLocaleDateString()}
                          </td>
                          <td className="p-4 items-center">
                            {record?.status || "--"}
                          </td>
                          <td className="p-4 items-center">
                            {record?.checkIn || "--"}
                          </td>
                          <td className="p-4 items-center">
                            {record?.checkOut || "--"}
                          </td>
                          <td className="p-4 items-center">
                            {record?.duration || "--"}
                          </td>
                          <td className="p-4 items-center">
                            {record?.remarks || "--"}
                          </td>
                          <td
                            className="p-4 items-center flex justify-center"
                            onClick={() => {
                              setDelAnimation(true);
                              setOpen(true);
                              setEditData({
                                checkIn: record?.checkIn || "",
                                checkOut: record?.checkOut || "",
                                remarks: record?.remarks || "",
                                leaveTypeName: record?.status || "",
                                date: date,
                              });

                              setEditFormErrors({
                                leaveTypeName: "",
                                checkIn: "",
                                checkOut: "",
                                remarks: "",
                              });
                            }}
                          >
                            <PiPencilSimpleLineFill  className="text-blue-700" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50 md:m-[10px] cursor-pointer">
            <div
              className={`bg-[#1e293b] text-white w-full max-w-md rounded-xl shadow-lg p-6 m-[10px] ${
                animation ? "scale-up-center" : "scale-down-center"
              } `}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Attendance</h2>
                <span className="text-sm text-gray-400">for 1st May 2025</span>
              </div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full mb-2 p-2 bg-gray-700 rounded-md focus:outline-none"
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

              {editFormErrors.leaveTypeName && (
                <p className="text-red-500 text-xs">
                  {editFormErrors.leaveTypeName}
                </p>
              )}

              <label className="block text-sm font-medium mb-1">Check In</label>
              <input
                type="text"
                name="checkIn"
                value={editData.checkIn?.slice(0, 5)}
                className="w-full mb-4 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="hh:mm"
                onChange={handleData}
              />
              {editFormErrors.checkIn && (
                <p className="text-red-500 text-xs">{editFormErrors.checkIn}</p>
              )}

              <label className="block text-sm font-medium mb-1">
                Check Out
              </label>
              <input
                type="text"
                name="checkOut"
                value={editData.checkOut?.slice(0, 5)}
                className="w-full mb-4 p-2 bg-gray-700 rounded-md focus:outline-none"
                placeholder="hh:mm"
                onChange={handleData}
              />
              {editFormErrors.checkOut && (
                <p className="text-red-500 text-xs">
                  {editFormErrors.checkOut}
                </p>
              )}

              <label className="block text-sm font-medium mb-1">Remarks</label>
              <input
                type="text"
                className="w-full mb-2 p-2 bg-gray-700 rounded-md focus:outline-none"
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

              <div className="flex gap-3 justify-end">
                <button
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => setDeleteReq(true)}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAnimation((prev) => !prev);
                    setTimeout(() => {
                      setOpen(false);
                      setAnimation((prev) => !prev);
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
          <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50 md:m-[10px] cursor-pointer">
            <div
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
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer">
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {visible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div
              className={`bg-gray-900 text-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative border border-gray-700 ${
                applyAnimation ? "scale-up-center" : "scale-down-center"
              }`}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer"
                onClick={() => {
                  setApplyAnimation(false);
                  setTimeout(() => {
                    setVisible(false);
                    setApplyAnimation(true);
                  }, 300);
                }}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-6">Apply for Leave</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select
                    name="leaveTypeName"
                    value={formData.leaveTypeName}
                    onChange={handleChange}
                    className=" cursor-pointer w-full bg-gray-800 text-white rounded-lg border border-gray-600 px-2 py-2 focus:outline-none focus:ring focus:border-blue-500"
                  >
                    <option value="">Select status</option>
                    <option value="casual">Casual Leave</option>
                    <option value="medical">Medical Leave</option>
                    <option value="earned">Earned Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                  {formErrors.leaveTypeName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.leaveTypeName}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">From</label>
                    <input
                      type="date"
                      name="fromDate"
                      value={toInputFormat(formData.fromDate)}
                      onChange={handleChange}
                      className="w-full px-2 bg-gray-800 text-white rounded-lg border border-gray-600 py-2 focus:outline-none focus:ring focus:border-blue-500 cursor-pointer"
                    />
                    {formErrors.fromDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.fromDate}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">To</label>
                    <input
                      type="date"
                      name="toDate"
                      value={toInputFormat(formData.toDate)}
                      onChange={handleChange}
                      className="w-full px-2 bg-gray-800 text-white rounded-lg border border-gray-600 py-2 focus:outline-none focus:ring focus:border-blue-500 cursor-pointer"
                    />
                    {formErrors.toDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.toDate}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Remarks <span className="text-gray-400">(optional)</span>
                  </label>

                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 px-2 py-2 resize-none focus:outline-none focus:ring focus:border-blue-500"
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
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                    onClick={() => {
                      setApplyAnimation(false);
                      setTimeout(() => {
                        setVisible(false);
                        setApplyAnimation(true);
                      }, 300);
                    }}
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

        <section className="bg-gray-800 p-4 rounded shadow h-fit lg:w-[27%] md:w-full sm:w-full w-full">
          <h3 className="text-lg font-semibold mb-4">Your Leave Balance</h3>
          {employee.leaveBalances.length === 0 ? (
            <p className="text-gray-400 text-sm">No leave balance data.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {employee.leaveBalances.map((l) => {
                const type =
                  l.leaveTypeId === 1
                    ? "Casual Leave"
                    : l.leaveTypeId === 2
                    ? "Medical Leave"
                    : "Earned Leave";

                return (
                  <li
                    key={l.leaveTypeId}
                    className="text-gray-300 text-lg italic"
                  >
                    {type}
                    <span className="block text-gray-400 text-sm -mt-0.5 not-italic">
                      {`${l.remaining} / ${l.allocated}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            onClick={() => {
              // setLeaveAnimation(true);
              setView(true);
            }}
            className="mt-4 w-full bg-blue-600 py-2 rounded text-sm cursor-pointer"
          >
            View Leaves Taken
          </button>
        </section>
      </section>

      {/* <section className="p-4 border border-gray-600 bg-gray-800 mb-6 rounded">
      <h2 className="text-lg font-bold mb-3">Leave Requests</h2>

      {leaveHistory.length === 0 ? (
        <p className="text-gray-500">No leave requests found.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <label>
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelectedId(
                    e.target.checked ? leaveHistory.map((l) => l.id) : []
                  )
                }
                checked={selectedId.length === leaveHistory.length}
              />
              Select All
            </label>
          </div>

          {leaveHistory.map((leave) => (
            <div
              key={leave.id}
              className="flex items-start gap-2 justify-center"
            >
              <div>
                <input
                  type="checkbox"
                  checked={selectedId.includes(leave.id)}
                  onChange={() => handleSelect(leave.id)}
                />
              </div>
              <div>
                <span className="mx-1 capitalize">{employee.user.name}</span>
                has been requested for the
                <span className="capitalize mx-2">
                  {leave.leaveTypeId === 1
                    ? "Casual"
                    : leave.leaveTypeId === 2
                    ? "Medical"
                    : "Earned"}
                </span>
                leave from
                <span className="ml-2">
                  {new Date(leave.fromDate).toLocaleDateString()}
                </span>
                <span className="capitalize mx-2"> to </span>
                <span className="mr-2">
                  {new Date(leave.toDate).toLocaleDateString()}
                </span>
                due to
                <span>{leave.remarks || "--"}</span> and request is -
                <span
                  className={
                    leave.status === "approved"
                      ? "text-green-500"
                      : leave.status === "rejected"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {leave.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 items-center m-2">
        <button
          className="text-[#6F282A] bg-[#3E262E] px-4 py-1.5 font-semibold rounded cursor-pointer w-[100px] hover:bg-[#ED6C02] hover:text-white"
          onClick={() =>
            selectedId.forEach((id) => handelCanceledApprove(id, "rejected"))
          }
        >
          Reject
        </button>

        <button
          className="text-[#2748BE] bg-[#203162] px-4 py-1.5 font-semibold rounded cursor-pointer w-[100px] hover:bg-[#0B4DD8] hover:text-white"
          onClick={() =>
            selectedId.forEach((id) => handelCanceledApprove(id, "approved"))
          }
        >
          Approve
        </button>
      </div>
    </section> */}

      {view && (
        <div className="fixed inset-0 bg-opacity-80 bg-[#212020ad] flex items-center justify-center z-50 ">
          <div
            className={`bg-gray-800 rounded px-4 pb-4 w-[500px] transition-all`}
          >
            <div className="flex justify-end">
              <button
                className="mt-3 bg-red-600 text-white px-3 py-.75 cursor-pointer rounded text-right"
                onClick={() => {
                  setTimeout(() => {
                    setView(false);
                  }, 300);
                }}
              >
                <CloseIcon fontSize="small" className="-mt-1" />
              </button>
            </div>
            <h2 className="text-2xl font-semibold text-gray-200 border-b border-gray-600 pb-1 mb-3">
              Leaves taken
            </h2>
            {/* <ul>
                {groupedLeaves &&
                  Object.entries(groupedLeaves).map(([type, dates], index) => (
                    <li
                      key={index}
                      className={`py-3 text-sm ${
                        index !== Object.keys(groupedLeaves).length - 1
                          ? "border-b border-[#464545]"
                          : ""
                      }`}
                    >
                      <div>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                      {dates.map((date, idx) => (
                        <div key={idx}>{date}</div>
                      ))}
                    </li>
                  ))}
              </ul> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
