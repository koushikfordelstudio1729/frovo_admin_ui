"use client";

import React from "react";

import {
  Shield,
  SquarePen,
  Building2,
  CircleUserRound,
  Key,
  Clipboard,
  History,
  UserRoundCog,
  User,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/config/admin.config";
import SidebarItem from "../../../common/SidebarItem/SidebarItem";
import Image from "next/image";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  shield: Shield,
  squarePen: SquarePen,
  building: Building2,
  users: CircleUserRound,
  key: Key,
  clipboard: Clipboard,
  history: History,
  star: UserRoundCog,
  user: User,
  settings: Settings,
};

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white text-white min-h-full fixed left-0 top-0 overflow-auto p-6">
      {/* Logo Section */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logo.svg"
          alt="frovo logo"
          width={130}
          height={50}
          priority
        />
      </div>

      {/* Navigation Items */}
      <nav className="space-y-4">
        {/* Group 1 */}
        <div className="bg-[#FFEAE4] rounded-2xl py-4">
          {adminNavigation.slice(0, 4).map((item) => {
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
          {adminNavigation.slice(4, 8).map((item) => {
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
          {adminNavigation.slice(8).map((item) => {
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

export default AdminSidebar;
