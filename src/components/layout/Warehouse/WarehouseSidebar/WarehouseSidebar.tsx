"use client";

import React from "react";
import {
  LayoutDashboard,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  BarChart2,
  User,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { warehouseNavigation } from "@/config/warehouse.config";
import SidebarItem from "@/components/common/SidebarItem";
import Image from "next/image";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  layoutDashboard: LayoutDashboard,
  boxes: Boxes,
  arrowDownLeft: ArrowDownLeft,
  arrowUpRight: ArrowUpRight,
  wallet: Wallet,
  barChart2: BarChart2,
  user: User,
  settings: Settings,
};

export const WarehouseSidebar: React.FC = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white text-white min-h-screen fixed left-0 top-0 overflow-auto p-6">
      <div className="mb-2 pb-2 px-10">
        <Image
          src="/images/logo.svg"
          alt="frovo logo"
          width={140}
          height={140}
          priority
        />
      </div>

      <nav className="space-y-4">
        {/* Group 1 */}
        <div className="bg-[#FFEAE4] rounded-2xl py-4">
          {warehouseNavigation.slice(0, 3).map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;
            return (
              <SidebarItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={Icon}
                isActive={isActive}
              />
            );
          })}
        </div>
        {/* Group 2 */}
        <div className="space-y-1 bg-[#FFEAE4] rounded-2xl py-4">
          {warehouseNavigation.slice(3, 6).map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;
            return (
              <SidebarItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={Icon}
                isActive={isActive}
              />
            );
          })}
        </div>
        {/* Group 3 */}
        <div className="space-y-1 bg-[#FFEAE4] rounded-2xl py-4">
          {warehouseNavigation.slice(6).map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href;
            return (
              <SidebarItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={Icon}
                isActive={isActive}
              />
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default WarehouseSidebar;
