"use client";
import { useState } from "react";

const departmentData = [
  {
    id: 1,
    name: "React",
    employees: [
      {
        id: 101,
        name: "John Doe",
        position: "Frontend Developer",
        email: "john@example.com",
        phone: "555-0101",
        joinDate: "2020-05-15",
      },
      {
        id: 102,
        name: "Jane Smith",
        position: "UI Designer",
        email: "jane@example.com",
        phone: "555-0102",
        joinDate: "2019-11-20",
      },
    ],
  },
  {
    id: 2,
    name: "Research and Development",
    employees: [
      {
        id: 201,
        name: "Alex Johnson",
        position: "Research Scientist",
        email: "alex@example.com",
        phone: "555-0201",
        joinDate: "2018-03-10",
      },
      {
        id: 202,
        name: "Sarah Williams",
        position: "Data Analyst",
        email: "sarah@example.com",
        phone: "555-0202",
        joinDate: "2021-07-22",
      },
    ],
  },
  {
    id: 3,
    name: "SEO",
    employees: [
      {
        id: 301,
        name: "Mike Brown",
        position: "SEO Specialist",
        email: "mike@example.com",
        phone: "555-0301",
        joinDate: "2019-09-05",
      },
      {
        id: 302,
        name: "Emily Davis",
        position: "Content Strategist",
        email: "emily@example.com",
        phone: "555-0302",
        joinDate: "2022-01-18",
      },
    ],
  },
];

interface Employee {
  id: number;
  name: string;
  position: string;
  email: string;
  phone?: string;
  joinDate?: string;
  gender?: string;
  dday?: string;
  mname?: string;
}

export default function EmployeeDirectory() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState<
    Employee | null | undefined
  >(null);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    setSelectedEmployee("");
    setEmployeeDetails(null);
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);

    if (empId) {
      const department = departmentData.find(
        (dept) => dept.id === parseInt(selectedDepartment)
      );
      if (department) {
        const employee = department.employees.find(
          (emp) => emp.id === parseInt(empId)
        );
        setEmployeeDetails(employee);
      }
    } else {
      setEmployeeDetails(null);
    }
  };

  const getEmployeesForDepartment = () => {
    if (!selectedDepartment) return [];
    const department = departmentData.find(
      (dept) => dept.id === parseInt(selectedDepartment)
    );
    return department ? department.employees : [];
  };

  return (
    <>
      <div className="lg:w-3/4 md:w-full sm:w-full">
        <div className="text-[28px] font-bold text-white lg:px-4 md:px-4 sm:px-2 px-2 pb-3">
          Employee Directory
        </div>

        <div className="lg:gap-6 md:gap-3 sm:gap-3 bg-[#0f172a] relative text-white lg:px-3 md:px-2 sm:px-2 min-h-[88vh] overflow-y-auto">
          <div className="flex w-full gap-4">
            <div className="flex flex-col w-1/2">
              <label htmlFor="department" className="mb-2 pl-2">
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Please select a department</option>
                {departmentData.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-1/2">
              <label htmlFor="employee" className="mb-2 pl-2">
                Employee
              </label>
              <select
                id="employee"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                disabled={!selectedDepartment}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Please select an employee</option>
                {getEmployeesForDepartment().map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            {employeeDetails ? (
              <div className="lg:p-3 md:p-0 sm:p-0 rounded-lg">
                <h2 className="text-2xl font-bold mb-6">
                  Employee Information
                </h2>
                <div className="border border-gray-700 bg-gray-800 rounded justify-center">
                  <div className="flex items-center border-b border-gray-700 py-3 gap-6">
                    <div className="text-gray-400 w-[48%] text-end">Name</div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.name}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-6">
                    <div className="text-gray-400 w-[48%] text-end">Email</div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.email}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-6">
                    <div className="text-gray-400 w-[48%] text-end">Title</div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.position || "Software Engineer"}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-x-6">
                    <div className="text-gray-400 w-[48%] text-end">
                      Phone Number
                    </div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.phone || "+91 7878654523"}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-x-6">
                    <div className="text-gray-400 w-[48%] text-end">Gender</div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.gender || "Male"}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-x-6">
                    <div className="text-gray-400 w-[48%] text-end">
                      Birthday
                    </div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.dday || "--"}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-6">
                    <div className="text-gray-400 w-[48%] text-end">
                      Department
                    </div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {
                        departmentData.find(
                          (dept) => dept.id === parseInt(selectedDepartment)
                        )?.name
                      }
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-6">
                    <div className="text-gray-400 w-[48%] text-end">
                      Join Date
                    </div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.joinDate || "--"}
                    </div>
                  </div>
                  <div className="flex items-center border-b border-gray-700 py-3 gap-6">
                    <div className="text-gray-400 w-[48%] text-end">
                      Manager Name
                    </div>
                    <div className="font-medium text-base w-[48%] text-start">
                      {employeeDetails.mname || "--"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" p-6 rounded-lg border-gray-700 flex items-center justify-center h-full"></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
