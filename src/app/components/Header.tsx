"use client";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import Image from "next/image";
import { useCookies } from "next-client-cookies";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [visible, setVisible] = useState(false);
  const [onNotification, setNotification] = useState(false);
  const dropdownref = useRef<HTMLDivElement>(null);
  const Notificationref = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null); 
  const cookies = useCookies();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        dropdownref.current &&
        !dropdownref.current.contains(target)
      ) {
        setVisible(false);
      }

      if (
        Notificationref.current &&
        !Notificationref.current.contains(target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(target)
      ) {
        setNotification(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const removeCookies = () => {
    setLoading(true);
    cookies.remove("token");
    // setTimeout(() => {
    // }, 1000);
    handleLoading();
    window.location.href = "/login";
  };

  const handleSettings = () => {
    setLoading(true);
    handleLoading();
    window.location.href = "/layout/settings";
  };

  const handleProfile = () => {
    // setLoading(true);
    handleLoading();
    window.location.href = "/layout/profile";
  };

  const handleHelp = () => {
    setLoading(true);
    handleLoading();
    window.location.href = "/layout/help";
  };

  const handleNotification = () => setNotification((prev) => !prev);
  const handleVisible = () => setVisible((prev) => !prev);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .slide-up {
          animation: slideUp 0.3s ease-in-out forwards;
        }
      `}</style>

      {loading && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <Image
            src="/loading.gif"
            alt="Loading"
            width={80}
            height={80}
            className="animate-pulse"
          />
        </div>
      )}

      <div className="sticky flex items-center top-0 left-0 z-40">
        <div className="w-full h-15 bg-[#0C1927] flex justify-between items-center p-3 relative">
          <Image src="/logo.png" width={40} height={40} alt="Logo" />
        </div>

        <div className="flex relative items-center justify-between space-x-4 p-4 bg-gray-900 text-white rounded-lg">
          <div className="items-center space-x-1 lg:flex md:hidden sm:hidden hidden">
            <p className="text-sm font-medium">We</p>
            <svg className="h-4 w-4 text-red-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.35 3.9C13.57 2.68 15.23 2 16.95 2c1.72 0 3.38.68 4.6 1.9a6.5 6.5 0 010 9.2l-8.84 8.84a1 1 0 01-1.42 0L2.45 13.1a6.5 6.5 0 019.9-9.2z" />
            </svg>
            <p className="text-sm font-medium">ENS</p>
          </div>

          <div className="relative lg:flex md:hidden sm:hidden hidden items-center w-full max-w-xs bg-gray-800 rounded-md px-2 py-1">
            <CiSearch className="me-1" />
            <input
              type="text"
              placeholder="Search Payroll"
              className="w-full bg-transparent text-sm focus:outline-none text-white placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <button
              ref={notificationButtonRef}
              type="button"
              className="kd p-2 bg-gray-800 rounded-full hover:bg-gray-700"
              onClick={handleNotification}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a6 6 0 00-6 6v5c0 .73-.2 1.41-.54 2H18.54c-.34-.59-.54-1.27-.54-2V9a6 6 0 00-6-6zm10 13a2 2 0 01-2-2V9a8 8 0 00-16 0v5a2 2 0 01-2 2 1 1 0 000 2h20a1 1 0 000-2zm-7.5 5.5a2.5 2.5 0 11-5 0" />
              </svg>
            </button>

            {onNotification && (
              <div
                ref={Notificationref}
                className={`z-50 text-white bg-[#0C1927] px-0 border-2 border-gray-700 h-[10rem] ${
                  isMobile
                    ? "fixed bottom-0 left-0 w-full rounded-t-2xl slide-up"
                    : "absolute top-[3rem] right-[-2rem] w-64 rounded-2xl"
                }`}
              >
                <span className="border-b-2 border-gray-700 p-2 block w-full text-center">
                  No Notification
                </span>
              </div>
            )}
          </div>

          <div
            onClick={handleVisible}
            className="h-10 w-[40px] lg:w-[120px] relative cursor-pointer rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold"
          >
            <span>KD</span>
          </div>

          {visible && (
            <div className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black/50"></div>
              <div
                ref={dropdownref}
                className={`z-50 text-white bg-[#0C1927] px-4 py-4 border-2 border-gray-700 ${
                  isMobile
                    ? "fixed bottom-0 w-full rounded-t-2xl slide-up"
                    : "absolute top-[4rem] right-[2rem] w-64 rounded-2xl"
                }`}
              >
                <div className="flex justify-end cursor-pointer">
                  <button onClick={(e) => { e.stopPropagation(); setVisible(false); }}>
                    <RxCross2 />
                  </button>
                </div>

                <button onClick={() => (setVisible(false), handleProfile())} className="flex items-center space-x-3 w-full cursor-pointer">
                  <div className="w-10 h-10 mb-2 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">KD</div>
                  <div className="text-justify">
                    <p className="text-sm font-semibold">Kshiteej Dubey</p>
                    <p className="text-xs text-gray-400">Employee</p>
                  </div>
                  <svg className="ml-auto w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6l6 4-6 4V6z" clipRule="evenodd" />
                  </svg>
                </button>

                <button onClick={() => (setVisible(false), handleSettings())} className="flex w-full items-center space-x-3 hover:bg-gray-800 rounded-md px-2 py-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h5m6-4l4-4m0 0l-4-4m4 4H9" />
                  </svg>
                  <span className="text-sm text-justify">Settings</span>
                </button>

                <button onClick={() => (setVisible(false), handleHelp())} className="flex items-center space-x-3 hover:bg-gray-800 rounded-md px-2 py-2 w-full">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-justify">Help</span>
                </button>

                <button onClick={() => (setVisible(false), removeCookies())} className="flex items-center space-x-3 hover:bg-gray-800 rounded-md px-2 py-2 text-red-400 w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  <span className="text-sm font-medium text-justify w-full">Logout</span>
                </button>
              </div>
            </div>
          )}

          <div className="lg:hidden w-[40px] h-10 cursor-pointer rounded-full bg-gray-700 flex items-center justify-center" onClick={onMenuClick}>
            <MenuIcon className="text-white" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
