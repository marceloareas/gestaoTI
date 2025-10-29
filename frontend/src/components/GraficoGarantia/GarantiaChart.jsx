import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function GarantiaChart({ data }) {
  const hoje = new Date();

  // Contar quantos estão com garantia expirada ou válida
  const expirado = data.filter(eq => new Date(eq.dataFimGarantia) < hoje).length;
  const emGarantia = data.length - expirado;

  const chartData = [
    { name: "Em garantia", value: emGarantia },
    { name: "Expirada", value: expirado },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>Status da Garantia</h2>
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={50} // 🔹 faz virar um donut
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
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
