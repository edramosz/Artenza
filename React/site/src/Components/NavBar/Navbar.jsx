import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Db/FireBase";
import defaultProfile from '../../../public/img/userDefault.png';
import "./Navbar.css";
import NavItem from "./NavItem";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [perfilUrl, setPerfilUrl] = useState("");

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const items = [
    { id: 1, url: "/", label: "Home" },
    { id: 2, url: "/masculino", label: "Masculino" },
    { id: 3, url: "/feminino", label: "Feminino" },
    { id: 4, url: "/acessorios", label: "Acessórios" },
    { id: 5, url: "/novidades", label: "Novidades" },
    { id: 6, url: "/promocoes", label: "Promoções" },
    { id: 7, url: "/contato", label: "Contato" },
    { id: 8, url: "/sobre", label: "Sobre" },
  ];

  const carregarDadosUsuario = () => {
    const nomeCompleto = localStorage.getItem("nomeUsuario");
    const emailStr = localStorage.getItem("email");
    const isAdminStr = localStorage.getItem("isAdmin");
    const isAdmin = isAdminStr === "true";

    if (nomeCompleto && emailStr) {
      setUsuarioLogado({
        nome: nomeCompleto,
        email: emailStr,
        isAdmin: isAdmin,
      });
    } else {
      setUsuarioLogado(null);
    }
  };

  useEffect(() => {
    carregarDadosUsuario();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        carregarDadosUsuario();
      } else {
        setUsuarioLogado(null);
      }
    });

    window.addEventListener("storage", carregarDadosUsuario);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", carregarDadosUsuario);
    };
  }, []);

  useEffect(() => {
    const updatePerfilUrl = () => {
      const url = localStorage.getItem("perfilUrl");
      setPerfilUrl(url);
    };

    window.addEventListener("perfilAtualizado", updatePerfilUrl);
    updatePerfilUrl();

    return () => {
      window.removeEventListener("perfilAtualizado", updatePerfilUrl);
    };
  }, []);

  return (
    <div className="all-menu">
      <div className="top-menu">
        <nav>
          <div className="logo">
            <Link to="/">
              <img src="./img/logo.png" alt="Logo" width={180} />
            </Link>
          </div>

          <div className="search">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Buscando por:", searchTerm);
              }}
            >
              <div className="search-item">
                <input
                  type="search"
                  name="searchInput"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fa fa-times" />
                  </button>
                )}
                <button type="submit" className="search-btn">
                  <i className="fa fa-search" />
                </button>
              </div>
            </form>
          </div>

          <div className="menu-user">
            <ul>
              {usuarioLogado ? (
                <li className="main-user">
                  <div className="icon-perfil">
                    <Link to="/perfil">
                      <img
                        src={perfilUrl || defaultProfile}
                        alt="Foto de Perfil"
                        className="perfil-foto"
                        onError={(e) => (e.currentTarget.src = defaultProfile)}
                      />
                    </Link>
                  </div>
                  <div>
                    <Link to="/perfil">
                      <p className="user-item">Olá, {usuarioLogado.nome}</p>
                      <p className="user-item">{usuarioLogado.email}</p>
                    </Link>
                  </div>
                </li>
              ) : (
                <div className="acount">
                  <ul>
                    <li>
                      <Link to="/Cadastro">Junte-se a nós</Link>
                    </li>
                    <li>
                      <Link to="/Login">Entrar</Link>
                    </li>
                  </ul>
                </div>
              )}
            </ul>
          </div>

          {usuarioLogado && (
            <div className="icons">
              <ul>
                <Link to="/Carrinho">
                  <li><i className="fa-solid fa-cart-shopping"></i></li>
                </Link>
                <Link to="/Favoritos">
                  <li><i className="fa-solid fa-heart"></i></li>
                </Link>
              </ul>
            </div>
          )}
        </nav>
      </div>

      <div className="main-menu">
        <header>
          <button className="btn-mob" onClick={toggleMenu}>
            {openMenu ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </button>

          <nav>
            <ul className={`nav-items ${openMenu ? "open" : ""}`}>
              {items.map((item) => (
                <NavItem
                  key={item.id}
                  url={item.url}
                  label={item.label}
                  IsActive={location.pathname === item.url}
                />
              ))}
            </ul>
          </nav>

          <button className="btn-mob" onClick={toggleMenu}>
            {openMenu ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </button>
        </header>

        {/* Menu Lateral Mobile */}
        <div
          className={`mobile-menu-overlay ${openMenu ? "active" : ""}`}
          onClick={toggleMenu}
        ></div>

        <div className={`mobile-menu ${openMenu ? "active" : ""}`}>
          <div className="mobile-menu-header">
            {usuarioLogado ? (
              <>
                <Link to="/perfil" onClick={toggleMenu}>
                  <img
                    src={perfilUrl || defaultProfile}
                    alt="Foto de Perfil"
                    className="perfil-img"
                    onError={(e) => (e.currentTarget.src = defaultProfile)}
                  />
                </Link>
                <div className="mobile-user-info">
                  <Link to="/perfil" onClick={toggleMenu}>
                    <p>Olá, {usuarioLogado.nome}</p>
                    <p>{usuarioLogado.email}</p>
                  </Link>
                </div>
              </>
            ) : (
              <div className="mobile-login-options">
                <Link to="/Login" onClick={toggleMenu} className="mobile-login-btn">
                  Entrar
                </Link>
                <Link to="/Cadastro" onClick={toggleMenu} className="mobile-register-btn">
                  Cadastre-se
                </Link>
              </div>
            )}
          </div>

          <ul className="mobile-nav-items">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.url}
                  className={location.pathname === item.url ? "active" : ""}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {usuarioLogado && (
              <>
                <li>
                  <Link to="/Carrinho" onClick={toggleMenu}>
                    <i className="fa-solid fa-cart-shopping"></i> Carrinho
                  </Link>
                </li>
                <li>
                  <Link to="/Favoritos" onClick={toggleMenu}>
                    <i className="fa-solid fa-heart"></i> Favoritos
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
