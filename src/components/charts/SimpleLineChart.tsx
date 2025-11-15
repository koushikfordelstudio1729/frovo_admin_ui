import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Months are always constant
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// DUMMY DATA
const expenses = [
  34000, 42000, 90000, 120000, 180000, 250000, 800000, 1200000, 16000000,
  21000000, 25000000, 47000000,
];

//  Y-Axis ticks
const yAxisTicks = [
  10000, 100000, 150000, 200000, 500000, 1000000, 5000000, 20000000, 50000000,
];

// Compose the chart data
const data = months.map((name, idx) => ({
  name,
  expense: expenses[idx] ?? null,
}));

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `${value / 1000000}M`;
  if (value >= 1000) return `${value / 1000}K`;
  return value.toString();
};

export default function SimpleLineChart() {
  return (
    <div
      className="bg-white rounded-lg p-6 shadow-sm"
      style={{ outline: "none" }}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        EXPENSE TABLE
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#949494" }}
            fontSize={12}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            ticks={yAxisTicks}
            tickFormatter={formatYAxis}
            tick={{ fill: "#949494" }}
            fontSize={11}
            scale="log"
            interval={0}
            minTickGap={12}
            padding={{ bottom: 20, top: 20 }}
          />
          <Tooltip
            labelClassName="text-black"
            formatter={(value) => formatYAxis(Number(value))}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#FF00E5"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Expense"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
