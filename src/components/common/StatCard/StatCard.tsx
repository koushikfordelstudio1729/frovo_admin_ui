"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<{ size?: number }>;
  variant?: "default" | "orange" | "blue" | "green";
}

export const StatCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow:md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-[18px] mb-2">{title}</p>
          <p className="text-[40px] font-semibold text-gray-900">{count}</p>
        </div>
        <div
          className={`flex items-center justify-center mt-8 w-12 h-12 rounded-lg text-orange-500 bg-[#FFE3DA]`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
