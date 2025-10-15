import React, { useEffect, useState } from "react";
import equipamentosData from "../data/data.json";
import EquipamentosStats from "./EquipamentosStats";
import TipoChart from "./TipoChart";
import ModeloChart from "./ModeloChart";
//import GarantiaChart from "./GarantiaChart";
import Header from "../components/Header/Header"
import Footer from "../components/Footer/index"

export default function Dashboard() {
  const [equipamentos, setEquipamentos] = useState([]);

  useEffect(() => {
    setEquipamentos(equipamentosData);
    console.log("to aqui")
  }, []);

  // Estatísticas principais
  const totalEquipamentos = equipamentos.length;

  const equipamentosPorTipo = equipamentos.reduce((acc, eq) => {
    acc[eq.tipo_equipamento] = (acc[eq.tipo_equipamento] || 0) + 1;
    return acc;
  }, {});

  const equipamentosPorModelo = equipamentos.reduce((acc, eq) => {
    acc[eq.modelo] = (acc[eq.modelo] || 0) + 1;
    return acc;
  }, {});

  const equipamentosGarantiaExpirada = equipamentos.filter(eq => {
    const hoje = new Date();
    return new Date(eq.data_fim_garantia) < hoje;
  }).length;

  return (
    <>
    <Header />
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TipoChart data={equipamentosPorTipo} />
        <ModeloChart data={equipamentosPorModelo} />

      </div>

    </div>
    <Footer />
    </>
  );
}