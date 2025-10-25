import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import Tabela from "../../components/Tabela"
import { StyledHome } from "./styles"
import TabelaForaGarantia from "../../components/TabelaForaGarantia"
import "./index.css"

export default function ForaGarantia() {
    return (
        <StyledHome>
            <Header />
            <div className = 'tabela'>	
                <TabelaForaGarantia></TabelaForaGarantia>
            </div>
            <Footer />
        </StyledHome>
    )
}
