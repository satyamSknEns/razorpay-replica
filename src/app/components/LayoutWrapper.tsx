"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgotPassword" ||
    pathname === "/resetpassword";

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (pathname === "/layout/attendance") {
        setIsOpen(width >= 1000);
      } else {
        setIsOpen(width >= 768);
      }
    };
    handleResize();
    document.addEventListener("resize", handleResize);
    return document.removeEventListener("resize", handleResize);
  }, [pathname]);

  return (
    <>
      {!isAuthRoute && (
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      )}
      <div className={`${!isAuthRoute ? "flex h-[87vh]" : ""} `}>
        <div className={`${isOpen ? "flex" : "hidden"}`}>
          {!isAuthRoute && (
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}
        </div>
        <main
          className="flex-1 overflow-auto lg:px-4 md:px-4 sm:px-1 px-1 lg:pb-4 md:pb-4 sm:pb-1 pb-1 w-full"
          suppressHydrationWarning
        >
          {children}
        </main>
      </div>
    </>
  );
}
