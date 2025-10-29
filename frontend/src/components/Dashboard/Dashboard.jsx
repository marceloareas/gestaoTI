import React, { useEffect, useState } from "react";
import "./Dashboard.css"
import TipoChart from "../TipoChart";
import MarcaChart from "../MarcaChart";
import GarantiaChart from "../GraficoGarantia/GarantiaChart";
import StatusChart from "../StatusChart/StatusChart";
import GastosNotebookChart from "../GastosNotebooksChart/GastosNotebooksChart";
import Header from "../Header/Header";
import Footer from "../Footer/index";
import { api } from "@/services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api
      .get("/equipamentos")
      .then((r) => setData(r.data))
      .catch((e) => console.error(e?.message || "Erro ao buscar equipamentos"))
      .finally(() => setLoading(false));
  }, []);

  console.log(data)

  // Filtragem opcional
  const equipamentosFiltrados = data.filter((eq) =>
    (eq.numeroSerie ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estatísticas principais
  const totalEquipamentos = data.length;

  const equipamentosPorTipo = data.reduce((acc, eq) => {
    acc[eq.categoria] = (acc[eq.categoria] || 0) + 1;
    return acc;
  }, {});

  const equipamentosPorMarca = data.reduce((acc, eq) => {
    acc[eq.marca] = (acc[eq.marca] || 0) + 1;
    return acc;
  }, {});

  const totalValorCompra = data.reduce((acc, eq) => acc + (eq.precoCompra || 0), 0);

  const equipamentosGarantiaExpirada = data.filter((eq) => {
    const hoje = new Date();
    return new Date(eq.dataFimGarantia) < hoje;
  }).length;

  const porcentagemGarantiaExpirada = totalEquipamentos
    ? ((equipamentosGarantiaExpirada / totalEquipamentos) * 100).toFixed(1)
    : 0;

  // Prevenção de erro de carregamento
  if (loading) return <p className="p-6 text-gray-600">Carregando dados...</p>;

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>

        {/* Cards */}
        <div className="dashboard-cards">
          <Card
            title="Total de Equipamentos"
            value={totalEquipamentos}
            color="bg-blue-500"
          />
          <Card
            title="Garantia Expirada (%)"
            value={`${porcentagemGarantiaExpirada}%`}
            color="bg-red-500"
          />
          <Card
            title="Valor Total de Compra"
            value={`R$ ${totalValorCompra.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}
            color="bg-green-500"
          />
          <Card
            title="Tipos de Equipamento"
            value={Object.keys(equipamentosPorTipo).length}
            color="bg-purple-500"
          />
        </div>

        {/* Gráficos */}
        <div className="dashboard-charts">
          <TipoChart data={equipamentosPorTipo} />
          <MarcaChart data={equipamentosPorMarca} />
          <GarantiaChart data={data} />
          <StatusChart data={data} />
          <GastosNotebookChart data={data} />
        </div>
      </div>

      <Footer />
    </>
  );
}

// 💡 Componente de Card de resumo
function Card({ title, value, color }) {
  return (
    <div className={`p-5 rounded-xl shadow-md text-white ${color}`}>
      <h3 className="text-sm uppercase font-medium opacity-80">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
