import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "@/lib/constants";

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

interface ChartComponentProps {
  data: ChartData[];
  title: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, title }) => {
  return (
    <div className="p-4">
      <h2 className="text-center font-bold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
