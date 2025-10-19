import React from "react"

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./components/Dashboard";
import Inventario from "./pages/Inventario";
import Descartados from "./pages/ItensDescartados";
import Funcionarios from "./pages/Funcionarios";
import Garantia from "./pages/Garantia";

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/inventario" element={<Inventario/>} />
				<Route path="/itensDescartados" element={<Descartados/>} />
				<Route path="/garantias" element={<Garantia/>} />
				<Route path="/funcionarios" element={<Funcionarios/>} />
			</Routes>
		</BrowserRouter>
	)
}
