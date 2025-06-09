"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isAuthRoute && (
        <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      )}
      <div className={!isAuthRoute ? "flex h-[87vh]" : ""}>
        {!isAuthRoute && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-auto p-4 w-full" suppressHydrationWarning>
          {children}
        </main>
      </div>
    </>
  );
}
