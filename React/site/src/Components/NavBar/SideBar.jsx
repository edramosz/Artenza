import React from 'react'
import { Link } from 'react-router-dom';
import '../PaineisAdmin/AdminPainel.css';

const SideBar = () => {
    return (
            <aside className="sidebar">
                <h2 className="title">Painel Admin</h2>
                <ul className="pages">
                    <li>
                        <Link to='/Admin'>
                            <button ><i class="fa-solid fa-gear"></i>Administração</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/AdminUsuario'>
                            <button ><i className="fa-solid fa-users"></i>Usuários</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/'>
                            <button ><i class="fa-solid fa-location-dot"></i>Endereços</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/AdminProduto'>
                            <button ><i class="fa-solid fa-cart-shopping"></i>Produtos</button>
                        </Link>
                    </li>
                </ul>
            </aside>
    );
};

export default SideBar