'use client';

import React, { useState } from 'react';

export default function DocumentUpload() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  console.log(type,description,file)

  return (
    <div className="max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Documents</h2>

      <form className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload new documents <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Please pick a type</option>
            <option value="invoice">Invoice</option>
            <option value="receipt">Receipt</option>
            <option value="report">Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the document"
            className="w-full px-4 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Images or documents (maximum 5 MB each) <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm border rounded-md p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
