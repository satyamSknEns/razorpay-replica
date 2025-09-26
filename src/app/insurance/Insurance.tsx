'use client';

import { useState } from 'react';

export default function InsuranceForm() {
  const [gender, setGender] = useState('');

  return (
    <div className="max-w-3xl  px-3 pb-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-[28px] font-bold text-white mb-2 pb-1">Details for Insurance</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Final coverage inclusion will depend on the policy your organization selects.
      </p>

      <div className="mb-2">
        <h3 className="text-lg font-semibold text-red-600 mb-1">
          You <span className="text-sm text-red-400">(Please fill all details)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Full name</label>
            <input
              type="text"
              defaultValue="Kshiteej Dubey"
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Date of birth</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Gender</label>
            <div className="flex gap-4 mt-1">
              {['Male', 'Female'].map((g) => (
                <label key={g} className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            className="w-[32%] px-4 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Family</h3>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-outline btn-primary  px-4 py-2 rounded-md hover:bg-blue-700 transition">Add Spouse</button>
          <button className="btn btn-outline btn-primary px-4 py-2 rounded-md hover:bg-blue-700 transition">Add Child (Up to 4)</button>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-semibold  text-white mb-2">Dependents</h3>
        <div className="flex flex-wrap gap-4">
          {['Add Father', 'Add Mother', 'Add Father in Law', 'Add Mother in Law'].map((label) => (
            <button
              key={label}
              className="btn btn-outline btn-primary px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox text-blue-600" />
          <span className="ml-2 text-gray-700 dark:text-gray-300">
            I hereby declare that all information provided by me is correct according to govt. records.
          </span>
        </label>
      </div>


      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2 btn btn-outline btn-primary rounded-md hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
  );
}
