"use client";
import React, { useEffect, useState } from "react";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import Calender from "./Calender";
import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";
import { RxCross2 } from "react-icons/rx";

const LeaveAttendance = () => {
  const [visible, setVisible] = useState(false);
  const [checkInbutton, setcheckInbutton] = useState(false);
  const [checkOutbutton, setcheckOutbutton] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest[]>([]);
  const [leave, setLeave] = useState<LeaveData | null>(null);
  const [animation, setAnimation] = useState<boolean>(true);
  const [applyAnimation, setApplyAnimation] = useState<boolean>(true);
  // const [checkedMap, setCheckedMap] = useState<{ [key: number]: boolean }>({});
  const [deleteReq, setDeleteReq] = useState(false);
  const [delAnimation, setDelAnimation] = useState<boolean>(true);

  const [checkedMap, setCheckedMap] = useState<{ [key: string]: boolean }>({});
  const [formErrors, setFormErrors] = useState({
    leaveTypeName: "",
    fromDate: "",
    toDate: "",
    remarks: "",
  });
  const [editFormErrors, setEditFormErrors] = useState({
    leaveTypeName: "",
    remarks: "",
    checkIn: "",
    checkOut: "",
  });

  const allSelected =
    leaveRequest.length > 0 &&
    leaveRequest.every((item) => checkedMap[item.id]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    const newMap: Record<number, boolean> = {};
    leaveRequest.forEach((item) => {
      newMap[item.id] = newChecked;
    });
    setCheckedMap(newMap);
  };

  useEffect(() => {
    const initMap: Record<number, boolean> = {};
    leaveRequest.forEach((item) => {
      initMap[item.id] = false;
    });
    setCheckedMap(initMap);
  }, [leaveRequest]);

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

  const [formData, setFormData] = useState({
    leaveTypeName: "",
    fromDate: "",
    toDate: "",
    remarks: "",
  });

  const [editData, setEditData] = useState({
    checkIn: "",
    checkOut: "",
    remarks: "",
    leaveTypeName: "",
    date: "",
  });
  const cookies = useCookies();

  type LeaveRequest = {
    date: string;
    remarks: string;
    leaveType: {
      name: string;
    };
    fromDate: string;
    toDate: string;
    id: number;
  };
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  useEffect(() => {
    const handleGetcookies = async () => {
      const storeCookies = cookies.get("token");
      setToken(storeCookies ?? null);
    };
    handleGetcookies();
  }, []);

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleButton = () => {
    const today = formatDate(new Date());
    attendanceRecords.forEach((item) => {
      if (item.date === today) {
        if (item.checkIn) {
          setcheckInbutton(true);
          setcheckOutbutton(false);
        }

        if (item.checkOut) {
          setcheckOutbutton(true);
        }
      }
    });
  };

  useEffect(() => {
    if (token && attendanceRecords.length > 0) {
      handleButton();
    }
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 45, 0, 0);
    const timeUntilSix = (sixPM as any) - (now as any);
    if (timeUntilSix > 0) {
      const timeout = setTimeout(() => {
        // setDisable(false);
      }, timeUntilSix);
      return () => clearTimeout(timeout);
    } else {
      // setDisable(false);
    }
  }, [token, attendanceRecords]);

  // const handleData = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setEditData((prev) => ({ ...prev, [name]: value }));
  // };

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
    window.location.reload();
  };

  //handlechecKIn Api
  const handleCheckInApi = async () => {
    if (!token) return console.error("Token not found");

    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/checkIn`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };

      const response = await axios.request(config);
      const newEntry = response.data.attendance;
      console.log(newEntry);
      setcheckInbutton(true);
      handleRefresh();
      setcheckOutbutton(false);
    } catch (error) {
      console.error("Check In API error:", error);
    }
  };

  //CheckOut API
  const handleCheckOutApi = async () => {
    if (!token) return console.error("Token not found");
    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/checkOut`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };

      await axios.request(config);
      setcheckOutbutton(true);
      handleRefresh();
    } catch (error) {
      console.error("Check Out API error:", error);
    }
  };

  //Handle Attendence record
  useEffect(() => {
    const handleAttendance = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAttendanceDetails`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const response = await axios.request(config);
        setAttendanceRecords(response.data.attendance);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };
    if (token) {
      handleAttendance();
      handleButton();
    }
  }, [token]);

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
      setVisible(false);
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
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
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userLeave = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserLeave`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };

        const response = await axios.request(config);
        setLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      userLeave();
    }
  }, [token]);

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

  useEffect(() => {
    const getLeaveRequest = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getMyRequest`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };
        const response = await axios.request(config);
        setLeaveRequest(response.data.requests);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      getLeaveRequest();
    }
  }, [token]);

  const arr: any = [];
  useEffect(() => {
    if (token && leaveRequest) {
      try {
        leaveRequest.forEach((item) => {
          if (checkedMap[item.id]) {
            arr.push(item.id);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [token, leaveRequest, checkedMap]);

  const cancelRequest = async () => {
    const selectedIds = Object.keys(checkedMap).filter((id) => checkedMap[id]);
    if (selectedIds.length === 0) {
      alert("No leave request selected.");
      return;
    }
    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/cancelRequest`,
        method: "POST",
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          requestId: arr,
        },
      };
      await axios.request(config);
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="text-[28px] font-bold text-white px-3 pb-1">
        Leave & Attendance
      </div>

      <div className="flex flex-col xl:flex-row w-full gap-6 bg-[#0f172a] relative text-white p-2 min-h-[88vh] overflow-y-auto">
        <div className="flex-1 space-y-6">
          <div className="">
            <div className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded shadow flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Mark attendance for today (15 May, 2025)
                </h2>
                <p className="text-gray-400">
                  You can mark your attendance for today. For any other day,
                  please use the edit option below.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
                {!checkInbutton && !checkOutbutton ? (
                  <button
                    className={`bg-blue-600 px-3 py-1.5 rounded cursor-pointer whitespace-nowrap
                 ${checkInbutton ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleCheckInApi}
                    disabled={checkInbutton}
                  >
                    Check In
                  </button>
                ) : (
                  <button
                    className={`bg-blue-600 px-3 py-1.5 rounded cursor-pointer whitespace-nowrap
                  ${checkOutbutton ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleCheckOutApi}
                    disabled={checkOutbutton}
                  >
                    Check Out
                  </button>
                )}
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <Calender />
            </div>
          </div>

          <button
            className="btn btn-primary bg-blue-600"
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

          {leaveRequest.length > 0 && (
            <div className="bg-gray-800 p-4 rounded shadow ">
              <h3 className="text-lg font-semibold mb-2">Open Requests</h3>
              {leaveRequest.length > 0 && (
                <div className="p-3 ">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    disabled={leaveRequest.length === 0}
                  />
                  <label htmlFor="" className="ms-3">
                    Select All
                  </label>
                </div>
              )}

              {leaveRequest.map((item, index) => {
                return (
                  <div
                    className="bg-gray-700 p-3 rounded text-sm flex justify-between items-center mb-2"
                    key={index}
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!checkedMap[item.id]}
                        onChange={(e) =>
                          setCheckedMap((prev) => ({
                            ...prev,
                            [item.id]: e.target.checked,
                          }))
                        }
                      />
                      You have requested {item.leaveType?.name}{" "}
                      <span>from</span>
                      {item?.fromDate} to {item?.toDate} Leave on {item.date}.
                    </label>
                    <span>{item.remarks}</span>
                  </div>
                );
              })}
              <button
                className={`mt-2 bg-red-500 px-3 py-1 h-[36px] rounded text-sm cursor-pointer ${
                  leaveRequest.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={cancelRequest}
                disabled={leaveRequest.length === 0}
              >
                Delete Requests
              </button>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded shadow overflow-x-auto ">
            <h3 className="text-lg font-semibold mb-2">Attendance</h3>
            <p className="mb-3 text-gray-400 text-base">
              To apply for leaves, or to update your attendance data, please
              click on the edit button next to a date. To apply for many leaves
              together
            </p>

            <div className="w-full overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm text-left border-separate border-spacing-y-2">
                <thead className="text-gray-400 bg-[#313A46] border-b border-gray-600">
                  <tr>
                    <th className="py-4 px-2">Date</th>
                    <th>Status</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Duration</th>
                    <th>Remarks</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {allDates.map((date, index) => {
                    const record = attendanceRecords.find(
                      (r) => r.date === date
                    );
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-700 hover:bg-gray-700 font-semibold"
                      >
                        <td className="py-2 px-2">{date}</td>
                        <td className="capitalize">{record?.status || "--"}</td>
                        <td>{record?.checkIn.slice(0,5) || "--"}</td>
                        <td>{record?.checkOut.slice(0,5) || "--"}</td>
                        <td>{record?.duration.slice(0,5) || "--"}</td>
                        <td>{record?.remarks || "--"}</td>
                        <td>
                          <button
                            className="text-blue-400 font-bold hover:underline p-2 cursor-pointer"
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
                            <PiPencilSimpleLineFill />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full md:w-64 bg-gray-800 p-4 rounded shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">Your leave balance</h3>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-300 text-lg italic">
              Casual Leave
              <span className="block text-gray-400 text-sm -mt-0.5 not-italic">
                {leave
                  ? `${leave?.attendance?.casual?.remaining?.remaining} / ${leave?.attendance?.casual?.remaining?.allocated}`
                  : "--"}
              </span>
            </li>
            <li className="text-gray-300 text-lg italic">
              Medical Leave
              <span className="block text-gray-400 text-sm -mt-0.5 not-italic">
                {leave
                  ? `${leave?.attendance?.medical?.remaining?.remaining}/${leave?.attendance?.medical?.remaining?.allocated}`
                  : "--"}
              </span>
            </li>
            <li className="text-gray-300 text-lg italic">
              Earned Leave
              <span className="block text-gray-400 text-sm -mt-0.5 not-italic">
                {leave
                  ? `${leave?.attendance?.earned?.remaining?.remaining}/${leave?.attendance?.earned?.remaining?.allocated}`
                  : "--"}
              </span>
            </li>
          </ul>
          <button className="mt-4 w-full bg-blue-600 py-2 rounded text-sm cursor-pointer">
            View Leaves Taken
          </button>
        </div>

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
                    className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 px-2 py-2 focus:outline-none focus:ring focus:border-blue-500"
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
                      value={formData.fromDate}
                      onChange={handleChange}
                      className="w-full px-2 bg-gray-800 text-white rounded-lg border border-gray-600 py-2 focus:outline-none focus:ring focus:border-blue-500"
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
                      value={formData.toDate}
                      onChange={handleChange}
                      className="w-full px-2 bg-gray-800 text-white rounded-lg border border-gray-600 py-2 focus:outline-none focus:ring focus:border-blue-500"
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
                value={editData.checkIn.slice(0, 5)}
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
                value={editData.checkOut.slice(0, 5)}
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
      </div>
    </>
  );
};

export default LeaveAttendance;
