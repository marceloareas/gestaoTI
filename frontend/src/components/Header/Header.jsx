import React, { useState } from "react";
import { StyledHeader, Sidebar } from "./styles";
import { Link } from 'react-router-dom';
import Logo from "../../assets/imagens/logo.png";
import { Menu, Home, Package, Clock, Users, BadgeCheck, Recycle } from "lucide-react";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <StyledHeader>
        <div className="headerContent">
          <button
            className="menuButton"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menu"
          >
            <Menu size={28} color="#000" />
          </button>

         <div className="logo">
			<Link to="/" className="nav-link">
				<img src={Logo} alt="Logo" />
			</Link>
		</div>

          <nav className="links">
            <a href="/login">Login</a>
          </nav>
        </div>
      </StyledHeader>

      <Sidebar data-open={isOpen}>
        <a href="/dashboard"><Home size={18}/> Dashboard</a>
        <a href="/inventario"><Package size={18}/> Inventário</a>
        <a href="/historico"><Clock size={18}/> Histórico</a>
        <a href="/funcionarios"><Users size={18}/> Funcionários</a>
        <a href="/garantias"><BadgeCheck size={18}/> Garantias</a>
        <a href="/foraGarantia"><BadgeCheck size={18}/> Fora de Garantia</a>
        <a href="/itensDescartados"> <Recycle size={18} /> Descartados </a>
      </Sidebar>
    </>
  );
}
