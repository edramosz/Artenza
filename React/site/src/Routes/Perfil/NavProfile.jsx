import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavProfile.css';

import { signOut } from 'firebase/auth';
import { auth } from '../../Components/Db/FireBase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faBagShopping,
  faGear,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import {
  faUser,
  faHeart,
  faCreditCard,
} from '@fortawesome/free-regular-svg-icons';

const NavProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const isActive = (path) => location.pathname === path;

  const carregarDadosUsuario = () => {
    const nome = localStorage.getItem('nomeUsuario');
    const email = localStorage.getItem('email');
    const isAdminStr = localStorage.getItem('isAdmin');

    if (nome && email) {
      setUsuarioLogado({
        nome,
        email,
        isAdmin: isAdminStr === 'true',
      });
    } else {
      setUsuarioLogado(null);
    }
  };

  useEffect(() => {
    carregarDadosUsuario();
    window.addEventListener('storage', carregarDadosUsuario);

    return () => window.removeEventListener('storage', carregarDadosUsuario);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.dispatchEvent(new Event('storage'));
      navigate("/");
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <div className="container-perfil">
      <aside className="sidebar">
        <div className="perfil">
          <div className="profile">            
            <Link to="/Perfil">
              <h2 className='profile-title'>Meu Perfil</h2>
            </Link>
          </div>
          <ul className="perfil-items">
            <li className={isActive('/Pedidos') ? 'active' : ''}>
              <Link to="/Pedidos">
                <FontAwesomeIcon icon={faUser} /> Meus Pedidos
              </Link>
            </li>
            <li className={isActive('/Favoritos') ? 'active' : ''}>
              <Link to="/Favoritos">
                <FontAwesomeIcon icon={faHeart} /> Favoritos
              </Link>
            </li>
            <li className={isActive('/Enderecos') ? 'active' : ''}>
              <Link to="/Enderecos">
                <FontAwesomeIcon icon={faHouse} /> Endereços
              </Link>
            </li>
            <li className={isActive('/Cupons') ? 'active' : ''}>
              <Link to="/Cupons">
                <FontAwesomeIcon icon={faBagShopping} /> Cupons
              </Link>
            </li>
            <li className={isActive('/Pagamentos') ? 'active' : ''}>
              <Link to="/Pagamentos">
                <FontAwesomeIcon icon={faCreditCard} /> Pagamentos
              </Link>
            </li>

            {usuarioLogado?.isAdmin && (
              <li className={isActive('/Config') ? 'active' : ''}>
                <Link to="/Admin">
                  <FontAwesomeIcon icon={faGear} /> Administração
                </Link>
              </li>
            )}

            <li>
              <button className="logout" onClick={() => setShowModal(true)}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sair
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Tem certeza que deseja sair?</h3>
            <div className="modal-buttons">
              <button onClick={handleLogout} className="confirm">
                Sim
              </button>
              <button onClick={() => setShowModal(false)} className="cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavProfile;
