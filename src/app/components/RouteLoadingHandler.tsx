"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const excludedRoutes = [
  "/layout/settings",
  "/layout/help",
  "/layout/profile",
  "/layout/logout",
  "/login",
  "/layout/dashboard"
];

export default function RouteLoadingHandler({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true);
      
    if (excludedRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Image src="/loading.gif" alt="Loading..." width={80} height={80} />
        </div>
      )}
      {children}
    </>
  );
}
