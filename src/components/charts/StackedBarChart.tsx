"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StackedBarChartProps {
  data: Array<{
    name: string;
    pending: number;
    refill: number;
  }>;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-xs font-semibold text-gray-900 mb-4">
        PENDING VS REFILL
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barSize={30}>
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis dataKey="name" fontSize={12} tick={{ fill: "#949494" }} />
          <YAxis
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
            ticks={[0, 20, 40, 60, 80, 100]}
            domain={[0, 100]}
            tick={{ fill: "#949494" }}
          />
          <Tooltip labelClassName="text-black" />
          <Legend layout="horizontal" iconType="rect" />
          <Bar
            dataKey="pending"
            stackId="a"
            fill="#FF00E5"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="refill"
            stackId="a"
            fill="#7B61FF"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
