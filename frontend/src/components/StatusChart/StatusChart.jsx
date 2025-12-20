import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function StatusChart({ data }) {
  // Agrupar os equipamentos por status
  const equipamentosPorStatus = data.reduce((acc, eq) => {
    acc[eq.status] = (acc[eq.status] || 0) + 1;
    return acc;
  }, {});

  // Converter em formato compatível com o Recharts
  const chartData = Object.entries(equipamentosPorStatus).map(([status, qtd]) => ({
    name: status,
    value: qtd,
  }));

  // Paleta de cores (você pode personalizar)
  const COLORS = ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#AA46BE"];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>
        Equipamentos por Status
      </h2>
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50}
          dataKey="value"
          nameKey="name"
          label={({ value }) => `${value}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
