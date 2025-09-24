"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "next-client-cookies";

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

const EmployeeDetail = () => {
  const { id } = useParams();
  const cookies = useCookies();
  const token = cookies.get("token");

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

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
          managerId: 5, // <- replace with dynamic managerId if needed
          from: "2025-08-13",
          to: "2025-09-11",
        },
      });

      const empList: Employee[] = res.data.employees || [];
      const found = empList.find((e) => e.user.id === Number(id));
      setEmployee(found || null);
    } catch (error) {
      console.error("Employee detail fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, token]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!employee) return <p className="text-white">Employee not found.</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Employee #{employee.user.id}: {employee.user.name}
      </h1>

      {/* Employee Details */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Employee Info</h2>
        {employee.details ? (
          <ul className="list-disc ml-6" key={employee.user.id}>
            <li>Email: {employee.user.email}</li>
            <li>Role: {employee.user.role}</li>
            <li>Experience: {employee.details.experience} years</li>
            <li>Last Company: {employee.details.lastCompany}</li>
            <li>
              Joining Date:{" "}
              {new Date(employee.details.joiningDate).toLocaleDateString()}
            </li>
            <li>Department: {employee.details.department}</li>
          </ul>
        ) : (
          <p>No details available.</p>
        )}
      </section>

      {/* Attendance Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Attendance Record</h2>
        <div className="overflow-x-auto">
          {employee.attendance.length === 0 ? (
            <p>No attendance record found.</p>
          ) : (
            <table className="w-full border border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 border border-gray-600">Date</th>
                  <th className="p-2 border border-gray-600">Status</th>
                  <th className="p-2 border border-gray-600">Check In</th>
                  <th className="p-2 border border-gray-600">Check Out</th>
                  <th className="p-2 border border-gray-600">Duration</th>
                  <th className="p-2 border border-gray-600">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {employee.attendance.map((a) => (
                  <tr key={a.id} className="text-center">
                    <td className="p-2 border border-gray-600">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border border-gray-600">{a.status}</td>
                    <td className="p-2 border border-gray-600">{a.checkIn}</td>
                    <td className="p-2 border border-gray-600">{a.checkOut}</td>
                    <td className="p-2 border border-gray-600">{a.duration}</td>
                    <td className="p-2 border border-gray-600">
                      {a.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Leave Balances */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Leave Balances</h2>
        {employee.leaveBalances.length === 0 ? (
          <p>No leave balance data.</p>
        ) : (
          <table className="w-full border border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border border-gray-600">Type</th>
                <th className="p-2 border border-gray-600">Allocated</th>
                <th className="p-2 border border-gray-600">Taken</th>
                <th className="p-2 border border-gray-600">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {employee.leaveBalances.map((l) => (
                <tr key={l.leaveTypeId} className="text-center">
                  <td className="p-2 border border-gray-600">
                    {l.leaveTypeId === 1
                      ? "Casual"
                      : l.leaveTypeId === 2
                      ? "Medical"
                      : "Earned"}
                  </td>
                  <td className="p-2 border border-gray-600">{l.allocated}</td>
                  <td className="p-2 border border-gray-600">{l.taken}</td>
                  <td className="p-2 border border-gray-600">{l.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default EmployeeDetail;
