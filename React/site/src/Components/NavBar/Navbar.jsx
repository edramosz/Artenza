import React from "react";

import { Link } from "react-router";
import "./Navbar.css";
import NavItem from "./NavItem";

const Navbar = () => {

  const items =[
    {id: 1, url: '/', label:'Home'},
    {id: 2, url: '/Sobre', label:'Sobre'},
    {id: 3, url: '/Contato', label:'Contato'},
    {id: 4, url: '/Empresa', label:'Empresa'}
  ]

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
            {items.map((item) => (
              <NavItem key={item.id} url={item.url} label={item.label} />
            ))}
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
