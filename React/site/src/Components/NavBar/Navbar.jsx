import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Corrigido para 'react-router-dom'
import "./Navbar.css";
import NavItem from "./NavItem";

const Navbar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const items = [
    { id: 1, url: '/', label: 'Home' },
    { id: 2, url: '/Sobre', label: 'Sobre' },
    { id: 3, url: '/Contato', label: 'Contato' },
    { id: 4, url: '/Empresa', label: 'Empresa' }
  ];

  return (
    <div className="main-menu">
      <header>
        <div className="logo">
          <Link to="/">
            <img src="caminho/da/imagem.png" alt="Logo" />
          </Link>
        </div>
        <nav>
          <ul className={`nav-items ${openMenu ? 'open' : ''}`}>
            {items.map((item) => (
              <NavItem key={item.id} url={item.url} label={item.label}
                IsActive={location.pathname === item.url} />
            ))}
          </ul>
        </nav>
        <div className="buttons">          
          <Link to="/Login"><button>Login</button></Link>
          <Link to="/Cadastro"><button>Cadastre-se</button></Link>
        </div>
        <button className="btn-mob" onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
        </button>
      </header>
    </div>
  );
};

export default Navbar;
