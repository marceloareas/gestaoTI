import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import Tabela from "../../components/Tabela"
import Dashboard from "../../components/Dashboard/Dashboard"
import { StyledHome } from "./styles"
import "./index.css"

export default function Home() {
	return (
		<StyledHome>
			<Header />
			<div className = 'tabela'>			
				<Dashboard></Dashboard>
			</div>

			<Footer />
		</StyledHome>
	)
}
