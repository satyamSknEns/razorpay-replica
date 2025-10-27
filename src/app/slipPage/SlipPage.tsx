import { FaPaperPlane } from "react-icons/fa";

export default function MyPayPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col md:flex-row">
      <main className="flex-1 px-3 pb-6 space-y-8">
        <h1 className="text-[28px] font-bold text-white">Pay Slips</h1>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0 md:space-x-4 -mt-3">
          <div className="flex-1 flex flex-col gap-1.5 relative">
            <label>Select financial year</label>
            <select className="border border-gray-500 rounded px-1 py-1 w-full outline-none bg-gray-800 text-white appearance-none pr-8">
              <option>2025 - 2026</option>
              <option>2024 - 2025</option>
              <option>2023 - 2024</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-2 bottom-0 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
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

          <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            <span>Download Payslips</span>
          </button>
        </div>

        <p className="text-gray-300">
          Oops, looks like we have not processed a payroll for you.
        </p>

        <button className="mt-4 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition">
          Return to dashboard
        </button>
      </main>

      <aside className="hidden lg:block w-72 p-6 space-y-4 border-l border-gray-700 bg-[#0f172a]">
        <div className="border border-gray-600 p-4 rounded relative">
          <span className="block text-lg font-semibold">Form 16</span>
          <p className="text-sm text-gray-400">View / download your Form 16</p>
          <div className="absolute top-2 right-2 text-blue-500">
            <FaPaperPlane className="text-blue-500 text-sm" />
          </div>
        </div>
        <div className="border border-gray-600 p-4 rounded relative">
          <span className="block text-lg font-semibold">Salary Advance</span>
          <p className="text-sm text-gray-400">
            View or request an salary advance
          </p>
          <div className="absolute top-2 right-2 text-blue-500">
            <FaPaperPlane className="text-blue-500 text-sm" />
          </div>
        </div>
      </aside>
    </div>
  );
}
