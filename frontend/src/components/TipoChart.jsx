import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function TipoChart({ data }) {
  const chartData = Object.entries(data).map(([tipo, qtd]) => ({
    name: tipo,
    value: qtd
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Equipamentos por Tipo</h2>
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={["#0088FE", "#FF8042", "#00C49F"][index % 3]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}