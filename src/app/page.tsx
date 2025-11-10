"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../store/hooks";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    router.push("/admin/roles-permissions");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-black bg-gray-50">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
