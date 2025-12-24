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
  Warehouse,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { adminNavigation } from "@/config/admin/admin.config";
import SidebarItem from "../../../common/SidebarItem/SidebarItem";
import { ModuleSwitcher } from "../../../common/ModuleSwitcher";
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
  warehouse: Warehouse,
  user: User,
  settings: Settings,
};

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const group1 = adminNavigation.slice(0, 4);
  const group2 = adminNavigation.slice(4, 8);
  const group3 = adminNavigation.slice(8);

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-4 shrink-0">
        <div className="flex justify-center">
          <Image
            src="/images/logo.svg"
            alt="frovo logo"
            width={130}
            height={50}
            priority
          />
        </div>
      </div>

      {/* Module Switcher */}
      <ModuleSwitcher currentModule="admin" />

      {/* Navigation Items */}
      <nav className="space-y-4">
        {/* Group 1 */}
        <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
          {group1.map((item) => {
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
        <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
          {group2.map((item) => {
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
        <div className="bg-[#FFEAE4] rounded-2xl py-3 space-y-1">
          {group3.map((item) => {
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
