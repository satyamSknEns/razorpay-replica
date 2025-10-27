"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";
import CloseButton from "../components/CloseButton";
import CustomButton from "../components/CustomButton";

interface Employee {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const Managers = () => {
  const cookies = useCookies();
  const token = cookies.get("token");
  const [managers, setManagers] = useState<any[]>([]);
  const [managerDetails, setManagerDetails] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentManagerId, setCurrentManagerId] = useState<number>();
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchAllManagers = async () => {
    try {
      const configManagers: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAllManagers`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };
      const res = await axios.request(configManagers);
      if (res.status === 200) {
        setManagers(res.data.managers);
      } else {
        console.error("API error:", res.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch managers:", error);
    }
  };

  useEffect(() => {
    fetchAllManagers();
  }, []);

  const handelManagerTeam = async (id: number) => {
    setCurrentManagerId(id);
    try {
      setManagerDetails(true);
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/listEmployees`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { managerId: id },
      };

      const res = await axios.request(config);
      setEmployees(res.data.employees || []);
    } catch (error) {
      console.error("There was some problem to show team member", error);
    } finally {
    }
  };

  const showAllEmployee = async () => {
    try {
      setShowPopup(true);
      setLoading(true);

      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/getAllEmployees`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {},
      };

      const res = await axios.request(config);
      if (res.status === 200) {
        setAllEmployees(res?.data?.leaveResponse || []);
      } else {
        console.error("Error fetching employees:", res.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmployeeSelection = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const handleAddToTeam = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee.");
      return;
    }

    try {
      const config: AxiosRequestConfig = {
        url: `${process.env.NEXT_PUBLIC_API_URL}/users/assignManager`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: currentManagerId,
          managerId: selectedEmployees[0],
        },
      };

      const res = await axios.request(config);
      if (res.status === 200) {
        setShowPopup(false);
        setSelectedEmployees([]);
      } else {
        alert("Failed to add employees: " + res.data.message);
      }
    } catch (err) {
      console.error("Error assigning employees:", err);
    } finally {
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Managers</h2>

      <div className="overflow-x-auto rounded">
        <table className="bg-gray-700 text-left min-w-[650px] w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 border border-gray-500">ID</th>
              <th className="px-4 py-2 border border-gray-500">Name</th>
              <th className="px-4 py-2 border border-gray-500">Email</th>
              <th className="px-4 py-2 border border-gray-500 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {managers.length > 0 ? (
              managers.map((manager, index) => (
                <tr
                  key={manager.id}
                  className="border border-gray-500 hover:bg-gray-600"
                >
                  <td className="px-4 py-2 border border-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-500">
                    {manager.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-500">
                    {manager.email}
                  </td>
                  <td className="px-4 py-2 border border-gray-500 text-center">
                    <CustomButton
                      text="Members"
                      onClick={() => {
                        handelManagerTeam(manager.id);
                      }}
                      color="bg-blue-600"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No managers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {managerDetails && (
        <div
          onClick={() => setManagerDetails(false)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1C2431] text-white w-full max-w-lg rounded-xl p-3 mx-4 animate-scale-up-center min-h-[220px] overflow-auto"
          >
            <div className="flex justify-between w-full items-center pb-5 border-b-2 border-gray-600 my-2">
              <h3 className="text-2xl font-semibold">Manager Detalis</h3>
              <CloseButton onClose={() => setManagerDetails(false)} />
            </div>
            <div className="overflow-x-auto mt-4 rounded">
              <table className="min-w-full border border-gray-600 text-left text-sm">
                <thead className="bg-gray-800 text-gray-200">
                  <tr>
                    <th className="px-4 py-2 border border-gray-600">ID</th>
                    <th className="px-4 py-2 border border-gray-600">Name</th>
                    <th className="px-4 py-2 border border-gray-600">Email</th>
                    <th className="px-4 py-2 border border-gray-600">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <tr
                        key={emp.user.id}
                        className="hover:bg-gray-600 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-2 border border-gray-600">
                          {emp.user.id}
                        </td>
                        <td className="px-4 py-2 border border-gray-600">
                          {emp.user.name}
                        </td>
                        <td className="px-4 py-2 border border-gray-600">
                          {emp.user.email}
                        </td>
                        <td className="px-4 py-2 border border-gray-600">
                          {emp.user.role}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-4 text-gray-400 border border-gray-600"
                      >
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-end mt-4">
              <CustomButton
                text="Add Employee"
                onClick={() => showAllEmployee()}
                color="bg-blue-600"
              />
            </div>

            {showPopup && (
              <div
                onClick={() => setShowPopup(false)}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#1C2431] text-white w-full max-w-2xl rounded-xl p-4 mx-4 overflow-auto max-h-[80vh]"
                >
                  <div className="flex justify-between items-center border-b border-gray-600 pb-3">
                    <h3 className="text-xl font-semibold">Select Employees</h3>
                    <CloseButton onClose={() => setShowPopup(false)} />
                  </div>

                  {loading ? (
                    <p className="mt-4 text-gray-400 text-center">Loading...</p>
                  ) : (
                    <>
                      <div className="overflow-x-auto mt-4">
                        <table className="min-w-full border border-gray-700 text-sm text-left">
                          <thead className="bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 border border-gray-600">
                                Select
                              </th>
                              <th className="px-4 py-2 border border-gray-600">
                                ID
                              </th>
                              <th className="px-4 py-2 border border-gray-600">
                                Name
                              </th>
                              <th className="px-4 py-2 border border-gray-600">
                                Email
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {allEmployees.length > 0 ? (
                              allEmployees.map((emp) => (
                                <tr
                                  key={emp.id}
                                  className="hover:bg-gray-700 transition"
                                >
                                  <td className="px-4 py-2 border border-gray-600 text-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedEmployees.includes(
                                        emp.id
                                      )}
                                      onChange={() =>
                                        toggleEmployeeSelection(emp.id)
                                      }
                                    />
                                  </td>
                                  <td className="px-4 py-2 border border-gray-600">
                                    {emp.id}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-600">
                                    {emp.name}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-600">
                                    {emp.email}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center py-4 text-gray-400"
                                >
                                  No employees found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="text-end mt-4">
                        <CustomButton
                          text=" Add to Team"
                          onClick={handleAddToTeam}
                          color="bg-blue-600"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Managers;
