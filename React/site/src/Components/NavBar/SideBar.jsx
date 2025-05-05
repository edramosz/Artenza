import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../PaineisAdmin/AdminPainel.css';

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <h2 className="title">Painel Admin</h2>
      <ul className="pages">
        <li>
          <Link to='/Admin'>
            <button className={isActive('/Admin') ? 'active' : ''}>
              <i className="fa-solid fa-gear"></i> Administração
            </button>
          </Link>
        </li>
        <li>
          <Link to='/AdminUsuario'>
            <button className={isActive('/AdminUsuario') ? 'active' : ''}>
              <i className="fa-solid fa-users"></i> Usuários
            </button>
          </Link>
        </li>
        <li>
          <Link to='/AdminEndereco'>
            <button className={isActive('/AdminEndereco') ? 'active' : ''}>
              <i className="fa-solid fa-location-dot"></i> Endereços
            </button>
          </Link>
        </li>
        <li>
          <Link to='/AdminProduto'>
            <button className={isActive('/AdminProduto') ? 'active' : ''}>
              <i className="fa-solid fa-cart-shopping"></i> Produtos
            </button>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
