import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import TabelaDescartados from "../../components/TabelaDescartados"
import { StyledHome } from "./styles"
import "./index.css"

export default function Descartados() {
    return (
        <StyledHome>
            <Header />
            <div className = 'tabela'>		
                <h1 className = "title">Equipamentos Descartados</h1>	
                <TabelaDescartados></TabelaDescartados>
            </div>

            <Footer />
        </StyledHome>
    )
}
