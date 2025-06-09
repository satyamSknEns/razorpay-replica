
import React from "react";
import { FaPaperPlane } from "react-icons/fa";

const Reimbursement = () => {
  return (
     <div className="flex gap-2 md:flex-col sm:flex-col lg:flex-row flex-col">
    <div className=" bg-[#171F2B] text-white p-6 w-full">
      <h1 className="text-xl font-semibold mb-6">Claim a Reimbursement</h1>

      <form className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Type of reimbursement <span className="text-red-500">*</span>
          </label>
          <select className="w-full bg-[#171F2B] border border-gray-600 px-3 py-2 rounded text-white">
            <option>Please pick a type</option>
            <option>Travel</option>
            <option>Food</option>
            <option>Internet</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Expense Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            defaultValue="2025-05-15"
            className="w-full bg-[#171F2B] border border-gray-600 px-3 py-2 rounded text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Description</label>
          <textarea
            className="w-full bg-[#171F2B] border border-gray-600 px-3 py-2 rounded text-white"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            className="w-full bg-[#171F2B] border border-gray-600 px-3 py-2 rounded text-white"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-xs">
            Supporting images or documents (maximum 5 MB each)
          </label>
          <input
            type="file"
            multiple
            className="bg-[#171F2B] text-sm p-2 rounded border border-gray-600 w-full"
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
      <h2 className="text-white font-semibold text-lg">View Past Requests</h2>
      <p className="text-sm text-gray-300 mt-2 leading-tight">
        See the status of all your past reimbursement requests
      </p>
    </div>

    </div>
  );

};

export default Reimbursement;
