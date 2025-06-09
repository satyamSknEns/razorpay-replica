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
import { useEffect, useRef} from "react";

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
  

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sideref.current && !sideref.current.contains(e.target as Node)) {
        onClose(); 
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);


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
  ];

  return (
    <aside
     ref={sideref}
      className={`
      fixed left-0 top-0 h-full w-60 bg-gray-800 p-4 z-50 transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 lg:static lg:block
    `}
     
    >
      <div className="flex justify-end lg:hidden mb-4">
        <CloseIcon onClick={onClose} className="text-white cursor-pointer" />
      </div>

      {menu.map((item) => (
        <div
          key={item.path}
          className={`flex items-center cursor-pointer text-center px-2 py-2 hover:bg-gray-600 ${
            pathname.endsWith(item.path) ? "bg-gray-700 text-white" : ""
          }`}
          onClick={() => {
            router.push(`/layout/${item.path}`);
            onClose();
          }}
        >
          <div className="w-8 h-8">{item.icon}</div>
          <div className="ml-2">{item.label}</div>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
