import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function TipoChart({ data }) {
  const chartData = Object.entries(data).map(([tipo, qtd]) => ({
    name: tipo,
    value: qtd
  }));

  // 🎨 Paleta com mais cores (você pode personalizar à vontade)
  const COLORS = [
    "#0088FE", // azul
    "#00C49F", // verde
    "#FFBB28", // amarelo
    "#FF8042", // laranja
    "#AA46BE", // roxo
    "#FF6699", // rosa
    "#33CCCC", // ciano
    "#999999", // cinza
    "#66CC33", // verde claro
    "#CC3333"  // vermelho escuro
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>Equipamentos por Tipo</h2>
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
