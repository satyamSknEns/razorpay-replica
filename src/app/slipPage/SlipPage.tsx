import PayslipPage from "../razorpayslip/page";
import { useState } from "react";

export default function MyPayPage() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const handleMonthlyLeave = (selectedMonth: number, selectedYear: number) => {
    console.log("Fetch salary slip for:", selectedMonth, selectedYear);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value);
    setMonth(newMonth);
    handleMonthlyLeave(newMonth, year);
  };

  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = Number(e.target.value);
    setYear(newYear);
    if (!isNaN(newYear)) handleMonthlyLeave(month, newYear);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white w-full">
      <h1 className="text-[28px] font-bold text-white">Pay Slips</h1>
      <div className="flex gap-3 items-center flex-wrap">
        <h2 className="text-lg font-semibold">Select Month and Year -</h2>
        <div className="flex gap-3">
          <div className="w-full relative">
            <select
              value={month}
              onChange={handleMonthChange}
              className="w-full text-white border border-gray-500 p-2 rounded bg-gray-800 appearance-none pr-8"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-2 top-[50%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
          <div className="w-full relative">
            <input
              type="number"
              value={year}
              onChange={handleYearInputChange}
              className="w-full text-white border border-gray-500 p-2 rounded bg-gray-800 appearance-none pr-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-2 top-[50%] -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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
        </div>
      </div>
      <PayslipPage month={month} year={year} />
    </div>
  );
}
