import React from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header/Header"
import Tabela from "../../components/TabelaHistorico"
import { StyledHome } from "./styles"
import "./index.css"

export default function Inventario() {
    return (
        <StyledHome>
            <Header />
            <div className = 'tabela'>			
                <Tabela></Tabela>
            </div>

            <Footer />
        </StyledHome>
    )
}
