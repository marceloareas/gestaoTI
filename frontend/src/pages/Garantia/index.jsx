import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import Tabela from "../../components/Tabela"
import { StyledHome } from "./styles"
import TabelaPertoFimGarantia from "../../components/TabelaPertoFimGarantia"
import "./index.css"

export default function Garantia() {
	return (
		<StyledHome>
			<Header />
				<TabelaPertoFimGarantia></TabelaPertoFimGarantia>
			<Footer />
		</StyledHome>
	)
}
