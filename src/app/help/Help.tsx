'use client';

import { Mail, MessageSquareMore } from 'lucide-react';

export default function Help() {
  const helpLinks = [
    'How do I declare or modify investment declarations and proofs?',
    'I have received an email that XPayroll has changed/removed by tax declaration. Why is that?',
    'How do I check my payslips and apply for reimbursements via WhatsApp?',
    'How can track my leaves and attendance?',
    'Employees – Get Started',
    'How can I change my tax regime?',
    'How can I reduce my tax liability?',
    'What other benefits can I avail on the Payroll Dashboard?',
    'Employee FAQs',
    'Explore Video Tutorials',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto p-4 text-white">

      <div className="lg:col-span-2 bg-[#151e2f] p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Get Help</h2>
        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {helpLinks.map((text, i) => (
            <div key={i} className="flex items-start gap-2">
              <MessageSquareMore size={18} className="mt-1 text-gray-400" />
              <p className="text-sm text-gray-200">{text}</p>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="inline-block mt-4 text-blue-400 hover:text-blue-500 font-medium text-sm"
        >
          Search more help articles on the documentation →
        </a>
      </div>
      <div className="bg-[#151e2f] p-6 rounded-xl shadow-md h-fit">
        <h3 className="text-xl font-bold mb-4">Get in touch</h3>
        <div className=" border border-blue-500 rounded-lg p-4 relative">
          <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
            ?
          </span>
          <h4 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Mail size={18} /> Mail Support
          </h4>
          <p className="text-sm text-gray-300">
            Please email us at <br />
            <a href="mailto:xpayroll@razorpay.com" className="text-blue-400 hover:underline">
              xpayroll@razorpay.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
