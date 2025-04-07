import React from "react";

import { Link } from "react-router";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="main-menu">
      <header>
        <div className="logo">          
          <Link to="/">
            <img src="caminho/da/imagem.png" alt="Logo" />
          </Link>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sobre">Sobre</Link>
            </li>
            <li>
              <Link to="/contate-nos">Contate-nos</Link>
            </li>
            <li>
              <Link to="/empresa">Empresa</Link>
            </li>
          </ul>
        </nav>
        <div className="buttons">
          <button>Login</button>
        </div>
        <div className="icon-bars">
          <li><i class="fa-solid fa-bars"></i>
            <div className="reponsive-menu">
              <li>Home</li>
              <li>Sobre</li>
              <li>Contate-nos</li>
              <li>Empresa</li>
              <button>Login</button>
            </div></li>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
