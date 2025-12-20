import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export default function TotalNotebooksAnoChart({ data }) {
  // Filtra apenas notebooks
  const notebooks = data.filter(eq => eq.categoria?.toLowerCase() === "notebook");

  // Conta a quantidade de notebooks por ano
  const quantidadePorAno = notebooks.reduce((acc, eq) => {
    const ano = new Date(eq.data_compra || eq.dataCompra).getFullYear();
    acc[ano] = (acc[ano] || 0) + 1; // soma 1 por notebook
    return acc;
  }, {});

  // Converte para array compatível com Recharts e ordena por ano
  const chartData = Object.entries(quantidadePorAno)
    .map(([ano, total]) => ({ ano, total }))
    .sort((a, b) => a.ano - b.ano);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>
        Total de Notebooks Comprados por Ano
      </h2>

      <BarChart
        width={450}
        height={300}
        data={chartData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ano" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#3b82f6" barSize={40} />
      </BarChart>
    </div>
  );
}
