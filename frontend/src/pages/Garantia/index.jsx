import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import { StyledHome } from "./styles"
import TabelaPertoFimGarantia from "../../components/TabelaPertoFimGarantia"
import "./index.css"

export default function Garantia() {
	return (
		<StyledHome>
			<Header />
			<div className = 'tabela'>	
				<h1 className = "title">Garantias</h1>
				<TabelaPertoFimGarantia></TabelaPertoFimGarantia>
			</div>
			<Footer />
		</StyledHome>
	)
}
