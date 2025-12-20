import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function MarcaChart({ data }) {
  const chartData = Object.entries(data).map(([marca, qtd]) => ({
    name: marca,
    quantidade: qtd
  }));

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>Equipamentos por Marca</h2>
      <BarChart
        width={500}
        height={300}
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* Eixo X mostrando apenas inteiros */}
        <XAxis
          type="number"
          tickFormatter={(value) => Number.isInteger(value) ? value : ""}
          domain={[0, 'dataMax + 1']} // garante espaço até o próximo número inteiro
          allowDecimals={false} // 🔹 desativa decimais
        />
        
        <YAxis type="category" dataKey="name" />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantidade" fill="#82ca9d" barSize={20} />
      </BarChart>
    </div>
  );
}