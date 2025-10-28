"use client";

import React, { useState } from "react";

export default function DocumentUpload() {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  console.log(type, description, file);

  return (
    <div className="max-w-2xl lg:px-4 md:px-4 sm:px-2 px-2 rounded-lg bg-gray-900">
      <h2 className="text-[28px] font-bold text-white mb-2 pb-1">Documents</h2>

      <form className="space-y-6 border border-gray-700 rounded p-5">
        <div className="flex flex-col gap-1.5 relative">
          <label>
            Upload new documents <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white appearance-none pr-8"
          >
            <option value="">Please pick a type</option>
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
            <option value="report">Report</option>
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
          <label>Description</label>
          <input
            type="text"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the document"
            className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label>
            Images or documents (maximum 5 MB each)
            <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="border border-gray-500 rounded px-2 py-1 w-full outline-none bg-gray-800 text-white"
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition"
          >
            Upload Document(s)
          </button>
        </div>
      </form>
    </div>
  );
}
