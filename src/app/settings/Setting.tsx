import React, { useState } from "react";

type PreferenceKey =
  | "reimbursementRequests"
  | "reimbursementApproved"
  | "reimbursementRejected"
  | "leaveRequests"
  | "salaryPaid"
  | "missingPayrollReminder"
  | "loanDisbursal"
  | "loanEditActions";

type Preferences = Record<PreferenceKey, boolean>;

const Setting = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    reimbursementRequests: true,
    reimbursementApproved: true,
    reimbursementRejected: true,
    leaveRequests: true,
    salaryPaid: true,
    missingPayrollReminder: true,
    loanDisbursal: true,
    loanEditActions: true,
  });

  const handleChange = (key: PreferenceKey) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-3xl m-2 text-white">
      <h2 className="font-bold text-2xl mb-5">User Preferences</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Password</label>
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-md border border-gray-700">
          <span className="text-gray-400">Password</span>
          <span className="text-white font-medium ms-4">********</span>
          <button className="text-blue-400 hover:underline text-sm font-medium ml-auto">
            Reset
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-3">Email Preferences</h2>
        <div className="divide-y divide-gray-700 border border-gray-700 rounded-md bg-gray-800">
          {Object.entries(preferences).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center px-4 py-3 text-gray-400"
            >
              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-4 w-4"
                checked={value}
                onChange={() => handleChange(key as PreferenceKey)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-left">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Setting;
