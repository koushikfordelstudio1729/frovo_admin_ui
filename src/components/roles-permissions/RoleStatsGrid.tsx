"use client";

import React from "react";
import StatCard from "../common/StatCard";
import { RoleStats } from "@/types/roles.types";
import {
  Shield,
  Briefcase,
  Wrench,
  DollarSign,
  Headphones,
  Warehouse,
  ClipboardCheck,
  ShieldAlert,
} from "lucide-react";

interface RoleStatsGridProps {
  stats: RoleStats[];
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  shield: Shield,
  briefcase: Briefcase,
  wrench: Wrench,
  "dollar-sign": DollarSign,
  headphones: Headphones,
  warehouse: Warehouse,
  "clipboard-check": ClipboardCheck,
  "shield-alert": ShieldAlert,
};

export const RoleStatsGrid: React.FC<RoleStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-14">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || Shield;
        return (
          <StatCard
            key={stat.id}
            title={stat.name}
            count={stat.count}
            icon={Icon}
          />
        );
      })}
    </div>
  );
};

export default RoleStatsGrid;
