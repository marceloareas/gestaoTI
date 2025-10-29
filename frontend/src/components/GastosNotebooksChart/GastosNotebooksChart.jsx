import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export default function GastosNotebookChart({ data }) {
  // Filtra apenas notebooks
  const notebooks = data.filter(eq => eq.categoria?.toLowerCase() === "notebook");

  // Agrupa os valores por ano de compra
  const gastosPorAno = notebooks.reduce((acc, eq) => {
    const ano = new Date(eq.data_compra || eq.dataCompra).getFullYear();
    acc[ano] = (acc[ano] || 0) + (eq.preco_compra || eq.precoCompra || 0);
    return acc;
  }, {});

  // Converte para array compatível com o Recharts
  const chartData = Object.entries(gastosPorAno)
    .map(([ano, total]) => ({
      ano,
      total
    }))
    .sort((a, b) => a.ano - b.ano); // ordena os anos

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>Gasto com Notebooks por Ano</h2>

      <BarChart
        width={450}
        height={300}
        data={chartData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ano" />
        <YAxis
          tickFormatter={(value) =>
            `R$ ${(value / 1000).toFixed(1)}k` // Mostra valores em mil reais
          }
          allowDecimals={false}
        />
        <Tooltip
          formatter={(value) =>
            `R$ ${value.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          }
          labelFormatter={(label) => `Ano: ${label}`}
        />
        <Legend />
        <Bar dataKey="total" fill="#3b82f6" barSize={40} />
      </BarChart>
    </div>
  );
}
