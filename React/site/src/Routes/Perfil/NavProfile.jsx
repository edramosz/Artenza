import { Link, useLocation } from 'react-router-dom';
import './NavProfile.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBagShopping, faGear, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser, faHeart, faCreditCard } from '@fortawesome/free-regular-svg-icons';

const NavProfile = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="container-perfil">
            <aside className="sidebar">
                <div className="perfil">
                    <div className="profile">
                        <img src="././././img/fundo.png" />
                        <Link to='/Perfil'><h2>Meu Perfil</h2></Link>
                    </div>
                    <ul className="perfil-items">
                        <li>
                            <Link to='/Pedidos'>
                                <button className={isActive('/Pedidos') ? 'active' : ''}>
                                    <FontAwesomeIcon icon={faUser} /> Meus Pedidos
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to='/Favoritos'>
                                <button className={isActive('/Favoritos') ? 'active' : ''}>
                                    <FontAwesomeIcon icon={faHeart} /> Favoritos
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to='/Enderecos'>
                                <button className={isActive('/Enderecos') ? 'active' : ''}>
                                    <FontAwesomeIcon icon={faHouse} /> Endereços
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to='/Cupons'>
                                <button className={isActive('/Cupons') ? 'active' : ''}>
                                    <FontAwesomeIcon icon={faBagShopping} /> Cupons
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to='/Pagamentos'>
                                <button className={isActive('/Pagamentos') ? 'active' : ''}>
                                    <FontAwesomeIcon icon={faCreditCard} /> Pagamentos
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Config">
                                <button className={isActive('/Config') ? 'active' : ''}>
                                    <FontAwesomeIcon icon={faGear} /> Configurações
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button className="logaout">
                                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sair
                            </button>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default NavProfile;
