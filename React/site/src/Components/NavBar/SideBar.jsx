import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faUsers,
  faCartShopping,
  faLocationDot,
  faTicket
} from '@fortawesome/free-solid-svg-icons';


import '../PaineisAdmin/AdminPainel.css';

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <h2 className="title">Painel Admin</h2>
      <ul className="pages">
        <li>
          <Link to="/Admin">
            <button className={isActive('/Admin') ? 'active' : ''}>
              <FontAwesomeIcon icon={faGear} /> Administração
            </button>
          </Link>
        </li>
        <li>
          <Link to="/AdminUsuario">
            <button className={isActive('/AdminUsuario') ? 'active' : ''}>
              <FontAwesomeIcon icon={faUsers} /> Usuários
            </button>
          </Link>
        </li>
        <li>
          <Link to="/AdminEndereco">
            <button className={isActive('/AdminEndereco') ? 'active' : ''}>
              <FontAwesomeIcon icon={faLocationDot} /> Endereços
            </button>
          </Link>
        </li>
        <li>
          <Link to="/AdminProduto">
            <button className={isActive('/AdminProduto') ? 'active' : ''}>
             <FontAwesomeIcon icon={faCartShopping} />Produtos
            </button>
          </Link>
        </li>
         <li>
          <Link to="/AdminCupons">
            <button className={isActive('/AdminCupons') ? 'active' : ''}>
             <FontAwesomeIcon icon={faTicket} />Cupons
            </button>
          </Link>
        </li>

        

      </ul>
    </aside>
  );
};

export default SideBar;
