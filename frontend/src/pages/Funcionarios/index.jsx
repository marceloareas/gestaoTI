import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import TabelaFunc from "../../components/TabelaFunc"
import { StyledHome } from "./styles"
import "./index.css"

export default function Funcionarios() {
	return (
		<StyledHome>
			<Header />
			<div className = 'tabela'>			
				<TabelaFunc></TabelaFunc>
			</div>

			<Footer />
		</StyledHome>
	)
}
