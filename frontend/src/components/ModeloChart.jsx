import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function ModeloChart({ data }) {
  const chartData = Object.entries(data).map(([modelo, qtd]) => ({
    name: modelo,
    quantidade: qtd
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Equipamentos por Modelo</h2>
      <BarChart width={400} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantidade" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}