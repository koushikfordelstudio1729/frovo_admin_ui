"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Boxes,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  BarChart2,
  User,
  Settings,
  ChevronDown,
  ArrowBigUpDash,
  RefreshCcw,
  LucideListChevronsUpDown,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  warehouseNavigation,
  WarehouseMenuItem,
} from "@/config/warehouse/warehouse.config";
import Image from "next/image";

const iconMap = {
  layoutDashboard: LayoutDashboard,
  summery: LucideListChevronsUpDown,
  arrowUp: ArrowBigUpDash,
  refresh: RefreshCcw,
  boxes: Boxes,
  arrowDownLeft: ArrowDownLeft,
  arrowUpRight: ArrowUpRight,
  wallet: Wallet,
  barChart2: BarChart2,
  user: User,
  settings: Settings,
} as const;

export const WarehouseSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const getInitialOpenState = () => {
    const state: Record<string, boolean> = {};
    warehouseNavigation.forEach((item) => {
      if (
        item.children &&
        item.children.some((child) => child.href === pathname)
      ) {
        state[item.label] = true;
      }
    });
    return state;
  };
  const [open, setOpen] =
    useState<Record<string, boolean>>(getInitialOpenState);

  const handleToggle = (label: string) =>
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));

  const group1 = warehouseNavigation.slice(0, 6);
  const group2 = warehouseNavigation.slice(6, 9);
  const group3 = warehouseNavigation.slice(9);

  function TopLevelSidebar(item: WarehouseMenuItem) {
    const Icon = iconMap[item.icon as keyof typeof iconMap] || Boxes;
    const isParentOnly = !item.href && item.children;
    const isActive = item.href ? pathname === item.href : false;

    const handleItemClick = () => {
      if (item.href) {
        router.push(item.href);
      } else if (isParentOnly) {
        handleToggle(item.label);
      }
    };

    return (
      <div key={item.label} className="w-full">
        <div
          className={`flex items-center justify-between text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-200
            ${isActive ? "bg-orange-500 text-white" : "text-gray-700"}
          `}
          onClick={handleItemClick}
        >
          <span className="flex items-center gap-2">
            <Icon
              size={20}
              className={isActive ? "text-white" : "text-orange-400"}
            />
            <span className="ml-1 text-sm">{item.label}</span>
          </span>
          <div className="w-5 flex justify-center">
            {item.children ? (
              <ChevronDown
                size={20}
                className={`transition-transform duration-200 ${
                  open[item.label] ? "rotate-180" : ""
                } ${isActive ? "text-white" : "text-gray-600"}`}
              />
            ) : (
              <span className="opacity-0">
                <ChevronDown size={16} />
              </span>
            )}
          </div>
        </div>
        {item.children && open[item.label] && (
          <div className="pl-8 pr-4 mt-1 text-sm space-y-1 transition-all duration-300">
            {item.children.map((child) => {
              const isChildActive = pathname === child.href;
              return (
                <a
                  key={child.label}
                  href={child.href}
                  className={`block text-[12px] rounded-md px-3 py-1.5 font-medium transition
                    ${
                      isChildActive
                        ? "text-white bg-orange-500"
                        : "text-gray-600"
                    }
                  `}
                >
                  {child.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="w-64 bg-white min-h-screen fixed left-0 top-0 overflow-y-auto p-6">
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logo.svg"
          alt="frovo logo"
          width={130}
          height={50}
          priority
        />
      </div>
      <nav className="space-y-5">
        <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
          {group1.map(TopLevelSidebar)}
        </div>
        <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
          {group2.map(TopLevelSidebar)}
        </div>
        <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
          {group3.map(TopLevelSidebar)}
        </div>
      </nav>
    </aside>
  );
};

export default WarehouseSidebar;
