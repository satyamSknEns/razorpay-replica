import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const Reimbursement = () => {
  return (
    <>
      <h1 className="text-[28px] font-bold text-white lg:px-4 md:px-4 sm:px-2 px-2 mb-2">
        Claim a Reimbursement
      </h1>
      <div className="flex gap-2 md:flex-col sm:flex-col lg:flex-row flex-col space-x-4 px-2">
        <div className=" bg-[#171F2B] text-white p-6 w-full">
          <form className="space-y-4 max-w-lg">
            <div className="flex flex-col gap-1.5 relative">
              <label>
                Type of reimbursement <span className="text-red-500">*</span>
              </label>
              <select className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white appearance-none pr-8">
                <option>Please pick a type</option>
                <option>Travel</option>
                <option>Food</option>
                <option>Internet</option>
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

            <div className="flex flex-col gap-1.5">
              <label>
                Expense Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                defaultValue="2025-05-15"
                className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label>Description</label>
              <textarea
                className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white resize-none"
                rows={4}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label>
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5 pb-4">
              <label>Supporting images or documents (maximum 5 MB each)</label>
              <input
                type="file"
                multiple
                className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Request Reimbursement
            </button>
          </form>

          <div className="mt-10">
            <h2 className="text-sm font-semibold mb-2">
              FYI, here are your organizations reimbursements related documents
            </h2>
            <div className="bg-[#2a2f3a] p-4 rounded">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="py-2 px-3 font-medium">Description</th>
                    <th className="py-2 px-3 font-medium">Attachment(s)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-3 text-gray-400">—</td>
                    <td className="py-2 px-3 text-gray-400">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-[#1e222b] border h-50 border-gray-600 rounded-md p-4 lg:w-64 md:w-full relative hover:shadow-md transition-shadow">
          <div className="absolute top-2 right-2 bg-blue-500 rounded-sm p-1">
            <FaPaperPlane className="text-white text-sm" />
          </div>
          <h2 className="text-white font-semibold text-lg">
            View Past Requests
          </h2>
          <p className="text-sm text-gray-300 mt-2 leading-tight">
            See the status of all your past reimbursement requests
          </p>
        </div>
      </div>
    </>
  );
};

export default Reimbursement;
