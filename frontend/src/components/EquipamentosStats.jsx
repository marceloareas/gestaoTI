import React from "react";

export default function EquipamentosStats({ total, garantiaExpirada }) {
  return (
    <div className="flex gap-6">
      <div className="p-4 bg-blue-100 rounded-lg flex-1 text-center">
        <h2 className="text-lg font-semibold">Total de Equipamentos</h2>
        <p className="text-3xl font-bold">{total}</p>
      </div>

      <div className="p-4 bg-red-100 rounded-lg flex-1 text-center">
        <h2 className="text-lg font-semibold">Garantia Expirada</h2>
        <p className="text-3xl font-bold">{garantiaExpirada}</p>
      </div>
    </div>
  );
}