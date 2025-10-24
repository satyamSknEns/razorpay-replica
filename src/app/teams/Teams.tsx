"use client";
import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";

interface Employee {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  details?: {
    experience: number;
    lastCompany: string;
    joiningDate: string;
    department: number;
  };
}

export default function Teams() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const cookies = useCookies();
  const token = cookies.get("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const fetchEmployees = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/listEmployees`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {}, 
        };

        const res = await axios.request(config);
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Employees fetch error:", err);
      }
    };

    fetchEmployees();
  }, [token]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">My Team</h1>
      {employees.length === 0 && <p>No team members found.</p>}
      {employees.map((emp) => (
        <div
          key={emp.user.id}
          className="cursor-pointer hover:underline mb-2"
          onClick={() => router.push(`/teams/${emp.user.id}`)}
        >
          {emp.user.name} ({emp.user.email}) – {emp.user.role}
        </div>
      ))}
    </div>
  );
}
