"use client";
import { usePathname, useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaymentIcon from "@mui/icons-material/Payment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HelpIcon from "@mui/icons-material/Help";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import GroupsIcon from "@mui/icons-material/Groups";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import SafetyDividerIcon from "@mui/icons-material/SafetyDivider";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "next-client-cookies";
import axios, { AxiosRequestConfig } from "axios";

interface UserData {
  user?: { id?: number; name?: string; role?: string };
  manager?: { id?: number; name?: string };
  details?: { details?: string };
  profile?: { id?: number; role?: string };
}

interface Employee {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const sideref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<UserData>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [teamsOpen, setTeamsOpen] = useState(false);
  const cookies = useCookies();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sideref.current && !sideref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  useEffect(() => {
    const storeCookies = cookies.get("token");
    setToken(storeCookies ?? null);
  }, [cookies]);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getUserProfile`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {},
        };

        const res = await axios.request(config);
        setData(res.data);

        if (res.data.profile?.role === "manager" && res.data.profile?.id) {
          fetchEmployees(res.data.profile.id);
        }
      } catch (error) {
        console.error("Profile API Error:", error);
      }
    };

    const fetchEmployees = async (managerId: number) => {
      try {
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/listEmployees`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { managerId },
        };

        const res = await axios.request(config);
        setEmployees(res.data.employees || []);
      } catch (error) {
        console.error("Employees API Error:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const menu = [
    { label: "Dashboard", path: "dashboard", icon: <DashboardIcon /> },
    { label: "My pay", path: "mypay", icon: <PaymentIcon /> },
    { label: "Attendance", path: "attendance", icon: <CalendarMonthIcon /> },
    {
      label: "Reimbursements",
      path: "reimbursements",
      icon: <CurrencyExchangeIcon />,
    },
    { label: "Tax Deduction", path: "taxdeduction", icon: <MoneyOffIcon /> },
    { label: "Document", path: "document", icon: <EditDocumentIcon /> },
    { label: "Insurance", path: "insurance", icon: <HealthAndSafetyIcon /> },
    { label: "Help", path: "help", icon: <HelpIcon /> },
    ...(data.profile?.role === "admin" || data.profile?.role === "manager"
      ? [{ label: "Teams", path: "teams", icon: <Diversity3Icon /> }]
      : []),
    ...(data.profile?.role === "admin"
      ? [{ label: "Employees", path: "employees", icon: <GroupsIcon /> }]
      : []),
    ...(data.profile?.role === "admin" || data.profile?.role === "HR"
      ? [
          {
            label: "Department",
            path: "department",
            icon: <SafetyDividerIcon />,
          },
        ]
      : []),
    ...(data.profile?.role === "admin" || data.profile?.role === "HR"
      ? [{ label: "Leave Type", path: "leavetype", icon: <TypeSpecimenIcon /> }]
      : []),
    ...(data.profile?.role === "admin" || data.profile?.role === "HR"
      ? [{ label: "Managers", path: "managers", icon: <TypeSpecimenIcon /> }]
      : []),
  ];

  return (
    <aside
      ref={sideref}
      className={`fixed left-0 top-0 h-full w-60 bg-gray-800 p-4 z-50 min-h-[600px] overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:block`}
    >
      <div className="flex justify-end md:hidden mb-4">
        <CloseIcon onClick={onClose} className="text-white cursor-pointer" />
      </div>

      {menu.map((item) => (
        <div key={item.path}>
          <div
            className={`flex items-center justify-between cursor-pointer px-2 py-2 hover:bg-gray-600 ${
              pathname.endsWith(item.path) ? "bg-gray-700 text-white" : ""
            }`}
            onClick={() => {
              if (item.label === "Teams") {
                setTeamsOpen(!teamsOpen);
              } else {
                router.push(`/layout/${item.path}`);
                onClose();
              }
            }}
          >
            <div className="flex items-center">
              <div className="w-8 h-8">{item.icon}</div>
              <div className="ml-2">{item.label}</div>
            </div>
            {item.label === "Teams" && (
              <div>{teamsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</div>
            )}
          </div>

          {item.label === "Teams" && teamsOpen && employees.length > 0 && (
            <div className="ml-6 mt-1 text-gray-300 text-sm">
              {employees.map((emp) => (
                <div
                  key={emp.user.id}
                  className="p-2 hover:text-white cursor-pointer hover:bg-gray-500  rounded"
                  onClick={() => router.push(`/teams/${emp.user.id}`)}
                >
                  {emp.user.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
