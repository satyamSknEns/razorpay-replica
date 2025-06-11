
import axios, { AxiosRequestConfig } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

const Dashboard = () => {
  const [data, setData] = useState<UserData>({});
  const [token, setToken] = useState<string | null>(null);
  const cookies = useCookies();
  
  interface UserData {
  user?: {
    name?: string;
  };
  manager?: {
    name?: string;
  };
  details?: {
    details?: string;
  };
}

     useEffect(() => {
        const handleGetcookies = async () => {
          const storeCookies = cookies.get("token");
          setToken(storeCookies ?? null);
        };
        handleGetcookies();
      }, []);
      
   useEffect(() => {
    if (!token) return;
     const handleApi = async () => {
      
      try {
        console.log(token)
        const config: AxiosRequestConfig = {
          url: `${process.env.NEXT_PUBLIC_API_URL}/users/getDetails`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          data: {}
        }
        
        const res = await axios.request(config);
        setData(res.data)
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    handleApi();
  }, [token]);

  return (
    <>
      <div className="flex items-start bg-gray-900 text-white overflow-y-auto">
        <div className="flex flex-wrap">
          <main className="flex-1 px-2 pb-6 space-y-4">
              <div className="bg-[#3e1717] text-sm rounded p-3 border-l-5 border-red-500">
         Your organization is currently marked as inactive on XPayroll. Please see our  <span className="underline text-blue-300 cursor-pointer">FAQ</span> to know why.
        </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold border-b-1 border-[#555050] pb-2">
                  Reminders
                </h2>
                <ul className="text-sm text-gray-400 min-h-[8rem]">
                  <li className="border-b-1 border-[#363232] py-3">
                    Please complete your
                    <Link href={'/layout/profile'} className="text-blue-400 mx-1">profile</Link>
                    immediately.
                  </li>
                  <li className="border-b-1 border-[#363232] py-3">
                    IT declaration and proof window is o  pen now
                    <Link href="#" className="text-blue-400 mx-1">Save tax now.</Link>
                  </li>
                  <li className="border-b-1 border-[#363232] py-3">
                    Please upload your compulsory
                    <Link href="#" className="text-blue-400 mx-1">documents</Link>.
                  </li>
                  <li className="pt-3">
                    Please consider
                    <Link href="#" className="text-blue-400 mx-1">uploading a photo</Link>
                    of yourself.
                  </li>
                </ul>
              </section>

              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold border-b-1 border-[#545454] pb-2">
                  Quick links
                </h2>
                <ul className="text-sm text-blue-300 min-h-[8rem]">
                  <li className="border-b-1 border-[#363232] py-3">
                    <Link href="#" className="mx-1">View personal transactions</Link>
                  </li>
                  <li className="pt-3">
                    <Link href="/employeeDirectory" className="mx-1">Employee directory</Link>
                  </li>
                </ul>
              </section>
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold border-b-1 border-[#545454] pb-2">
                  Birthdays
                </h2>
                <ul className="text-sm text-gray-400 space-y-1 min-h-[8rem]">
                  <li className="text-gray-500 text-[10px] pt-2">15 May</li>
                  <li className="-mt-1.5">
                    Saumya Shikhar
                  </li>
                </ul>
              </section>

              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold border-b-1 border-[#545454] pb-2">
                  Work anniversaries
                </h2>
                <ul className="text-sm text-gray-400 space-y-1 min-h-[8rem]">
                  <li className="text-gray-500 text-[10px] pt-2">
                    20 MAY
                  </li>
                  <li className="-mt-1.5">Hema Jaiswal</li>
                </ul>
              </section>

              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold border-b-1 border-[#545454] pb-2">
                  On Leave
                </h2>
                <ul className="text-sm text-gray-400 space-y-1 overflow-y-auto min-h-[8rem]">
                  <li className="text-gray-500 text-[10px] pt-2">
                    14 MAY
                  </li>
                  <li className="-mt-1.5"> Anand Vishav Singh</li>

                </ul>
              </section>

              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold border-b-1 border-[#545454] pb-2">
                  Upcoming Holidays
                </h2>
                <ul className="text-sm text-gray-400 space-y-1 overflow-y-auto min-h-[8rem]">
                  <li className="text-gray-500 text-[10px] pt-2">
                    14 MAY 
                  </li>
                  <li className="-mt-1.5">
                    Anand Vishav Singh
                  </li>
                </ul>
              </section>

              <section className="bg-gray-800 p-4 rounded">
                <h2 className="text-lg font-semibold text-white mb-2">
                  Health insurance details are required
                </h2>
                <p className="text-sm text-gray-400">
                  Your company has secured you under group health insurance.
                  <br />
                  Please provide your details to finalize policy.
                </p>
                <button className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Start
                </button>
              </section>
            </div>
          </main>
          <span className="hidden min541:inline border-l border-gray-700 ml-4"></span>
          <aside className="w-64 bg-gray-900 p-6 space-y-2">
            <div>
              <h2 className="text-xl font-bold">Welcome,</h2>
              <h3 className="text-2xl font-bold">{data?.user?.name}</h3>
              <p className="text-gray-400 mt-2">(ENS303)</p>
              <p className="text-sm text-gray-300 mt-4">
                {data?.details?.details}
              </p>
            </div>
            <div className="mt-8">
              <p className="text-gray-400">YOUR MANAGER</p>
              <p className="text-white font-medium">{data?.manager?.name}</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
