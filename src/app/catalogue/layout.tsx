"use client";

import {
  CatalogueHeader,
  CatalogueSidebar,
} from "@/components/layout/Catelogue";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <CatalogueSidebar />
      <main className="ml-64 flex-1 bg-gray-50 w-0">
        <CatalogueHeader />
        <div className="pt-10 p-8 w-full">{children}</div>
      </main>
    </div>
  );
}
