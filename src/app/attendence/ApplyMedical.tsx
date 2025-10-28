import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";

export default function ApplyLeaveModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [remarks, setRemarks] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-900 text-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Apply for Leave</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status</option>
              <option value="Sick">Sick Leave</option>
              <option value="Casual">Casual Leave</option>
              <option value="Earned">Earned Leave</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm mb-1">From</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-2 pr-10 focus:outline-none focus:ring focus:border-blue-500"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <CalendarIcon
                  className="absolute top-2.5 right-3 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-1">To</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-gray-800 text-white rounded-lg border border-gray-600 px-4 py-2 pr-10 focus:outline-none focus:ring focus:border-blue-500"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <CalendarIcon
                  className="absolute top-2.5 right-3 text-gray-400"
                  size={18}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Remarks <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              className="border border-gray-500 rounded p-2 w-full mb-4 outline-none bg-gray-800 text-white resize-none"
              rows={3}
              placeholder="Add any comments..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
