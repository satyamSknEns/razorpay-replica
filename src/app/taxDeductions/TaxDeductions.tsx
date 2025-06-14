"use client";

import Link from "next/link";

export default function TaxHeader() {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-6 bg-[#0C1927] text-white px-4 pb-6">
      <div className="flex-1 space-y-4">
        <h1 className="text-[28px] font-bold text-white pb-1">Tax Deductions FY 2025-2026</h1>

        <div className="bg-[#3e1717] text-sm rounded p-3 border-l-5 border-red-500">
          Please update your{" "}
          <span className="underline text-blue-300 cursor-pointer">PAN</span>.
          Without the PAN, TDS will be deducted @20% (if applicable).
        </div>

        <div className="bg-[#232e52] border-l-5 border-blue-500 text-sm rounded p-3">
          Declaration and proof window are open. Please declare your investments
          and upload the proofs to get maximum tax benefits.
        </div>

        <div className="bg-[#131F2E] border border-gray-700 text-sm rounded p-4">
          You have the option of either using a new tax regime (with no tax
          deductions), or using the same regime as FY 2019-20. To help you make
          an informed decision, we are displaying your tax liability in both
          these regimes, and you can choose the option that you prefer. For us
          to accurately calculate your tax liabilities, please ensure you fill
          in all the information requested below, irrespective of the regime
          that you pick.
        </div>

        <div className="flex-1">
          <div className="overflow-x-auto border border-gray-700 rounded">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#1D2B3A] text-gray-300">
                <tr>
                  <th className="px-4 py-3"></th>
                  <th className="px-4 py-3">New tax regime</th>
                  <th className="px-4 py-3">Old tax regime</th>
                </tr>
              </thead>
              <tbody className="text-white divide-y divide-gray-700">
                {[
                  { label: "Earnings", new: "0", old: "0" },
                  { label: "Exemptions", new: "0", old: "0" },
                  { label: "Standard Deduction", new: "75,000", old: "50,000" },
                  { label: "Deductions", new: "0", old: "0" },
                  { label: "Taxable Income", new: "0", old: "0" },
                  {
                    label: "Total Tax Liability",
                    new: "0",
                    old: "0",
                    isBold: true,
                  },
                ].map((row, index) => (
                  <tr key={index} className={row.isBold ? "font-semibold" : ""}>
                    <td className="px-4 py-3 text-[#8D9BB0] text-[14px] font-semibold">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-[#8D9BB0] text-[14px] font-semibold">
                      {row.new}
                    </td>
                    <td className="px-4 py-3 text-[#8D9BB0] text-[14px] font-semibold">
                      {row.old}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm">
            Your current chosen regime is <strong>New tax regime</strong>.
          </p>

          <div className="mt-3 bg-[#1e422b] text-green-100 rounded p-3 text-sm border-l-5 border-green-500">
            You should continue with your current selection.{" "}
            <strong>Please confirm your selection</strong> so that we can use it
            in future payroll calculations.
          </div>

          <div className="mt-4 flex gap-4">
            <button className="px-4 py-2 bg-[#0F1F3A] hover:bg-[#1a2b4d] text-blue-500 border border-blue-600 rounded">
              Switch Regime
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded">
              Confirm Selection
            </button>
          </div>
        </div>

        <div className="border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3 bg-[#1D2B3A] text-sm font-semibold border-b border-gray-600">
            <span>Current home rent (as on 01/05/2025)</span>
            <button className="text-blue-400 hover:underline text-sm">
              Edit
            </button>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: "Current Monthly Rent", value: "₹0" },
                { label: "Name of landlord", value: "-NA-" },
                { label: "PAN of landlord", value: "-NA-" },
                { label: "Address of landlord", value: "-NA-" },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 text-[#8D9BB0] text-[14px] font-semibold"
                >
                  <td className="px-4 py-3 w-1/2">{item.label}</td>
                  <td className="px-4 py-3">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3 bg-[#1D2B3A] text-sm font-semibold border-b border-gray-600">
            <span>
              Section 80 deductions (investments, education loans, medical
              insurance etc.)
            </span>
            <button className="text-blue-400 hover:underline text-sm">
              Edit
            </button>
          </div>
          <table className="w-full text-sm text-[#8D9BB0] text-[14px] font-semibold">
            <tbody>
              {[
                "Section 80C",
                "Section 80CCD (1B)",
                "Section 80D",
                "Section 80DD",
                "Section 80E",
                "Section 80EEB",
                "Section 80G",
                "Section 80U",
                "Section 80DDB",
                "Section 80TTA",
                "Section 80TTB",
              ].map((label, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-3 w-1/2">{label}</td>
                  <td className="px-4 py-3">₹0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3 bg-[#1D2B3A] text-sm font-semibold border-b border-gray-600">
            <span>Interest on home loan</span>
            <button className="text-blue-400 hover:underline text-sm">
              Edit
            </button>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: "Annual interest payable / paid", value: "₹0" },
                { label: "Additional benefit under Section 80EE", value: "₹0" },
                { label: "Name of lender", value: "-NA-" },
                { label: "PAN of lender", value: "-NA-" },
                { label: "Address of lender", value: "-NA-" },
                { label: "Section 80EEA", value: "₹0" },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 text-[#8D9BB0] text-[14px] font-semibold"
                >
                  <td className="px-4 py-3 w-1/2">{item.label}</td>
                  <td className="px-4 py-3">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center px-4 py-3 bg-[#1D2B3A] text-sm font-semibold border-b border-gray-600">
            <span>Leave Travel Allowance</span>
            <button className="text-blue-400 hover:underline text-sm">
              Edit
            </button>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: "Amount", value: "₹0" },
                { label: "Origin", value: "-NA-" },
                { label: "Destination", value: "-NA-" },
              ].map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-700 text-[#8D9BB0] text-[14px] font-semibold"
                >
                  <td className="px-4 py-3 w-1/2">{item.label}</td>
                  <td className="px-4 py-3">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="min-w-[250px]">
        <div className="text-lg font-semibold mb-4">
          May 2025 Salary Preview
        </div>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex flex-col">
            <div className="text-[#8D9BB0] text-[14px] font-semibold">
              EARNINGS
            </div>
            <div>₹0</div>
          </div>
          <div className="flex flex-col">
            <div className="text-[#8D9BB0] text-[14px] font-semibold">TDS</div>
            <div>₹0</div>
          </div>
          <div className="flex flex-col">
            <div className="text-[#8D9BB0] text-[14px] font-semibold">
              TOTAL DEDUCTIONS
            </div>
            <div>₹0</div>
          </div>
          <div className="flex flex-col font-medium text-white">
            <div className="text-[#8D9BB0] text-[14px] font-semibold">
              NET PAY
            </div>
            <div>₹0</div>
          </div>
        </div>

        <Link href={'/razorpayslip'}>
          <button className="mt-4 text-sm text-blue-500 font-semibold text-[16px] cursor-pointer">
            View Payslip
          </button>
        </Link>

        <div className="w-full lg:w-[250px] space-y-4 mt-4">
          {[
            {
              title: "Form 12BB",
              desc: "Download, sign and upload your investments on form 12BB",
            },
            {
              title: "Flexible Benefits Declarations",
              desc: "View or add flexible benefit plan declarations",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-[#131F2E] rounded p-4 border border-gray-700 relative"
            >
              <div className="text-lg font-semibold mb-2">{card.title}</div>
              <div className="text-sm text-gray-300">{card.desc}</div>
              <div className="absolute top-3 right-3">
                <div className="bg-blue-500 w-5 h-5 rounded-sm flex items-center justify-center text-xs">
                  ✈️
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
