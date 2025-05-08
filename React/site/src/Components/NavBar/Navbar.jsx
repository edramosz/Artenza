import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Db/FireBase";
import "./Navbar.css";
import NavItem from "./NavItem";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const items = [
    { id: 1, url: "/", label: "Home" },
    { id: 2, url: "/Sobre", label: "Sobre" },
    { id: 3, url: "/Contato", label: "Contato" },
    { id: 4, url: "/Empresa", label: "Empresa" },
    { id: 5, url: "/Sosssbre", label: "Sobre" },
    { id: 6, url: "/ssss", label: "Contato" },
    { id: 7, url: "/Emssspresa", label: "Empresa" },
    { id: 8, url: "/sss", label: "Empresa" },
  ];
  

  // Função que carrega os dados do usuário do localStorage
  const carregarDadosUsuario = () => {
    const nomeCompleto = localStorage.getItem("nomeUsuario");
    const emailStr = localStorage.getItem("email");
    const isAdminStr = localStorage.getItem("isAdmin");

    console.log("carregarDadosUsuario chamado");
    console.log("nomeCompleto:", nomeCompleto);
    console.log("emailStr:", emailStr);
    console.log("isAdminStr:", isAdminStr);

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
  // useEffect para monitorar alterações na autenticação e localStorage
  useEffect(() => {
    // Carrega os dados do usuário ao montar o componente
    carregarDadosUsuario();

    // Escuta mudanças na autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged chamado, user:", user);
      if (user) {
        carregarDadosUsuario();
      } else {
        setUsuarioLogado(null);
      }
    });

    // Escuta mudanças manuais no localStorage
    window.addEventListener("storage", carregarDadosUsuario);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", carregarDadosUsuario);
    };
  }, []); // Este useEffect agora é executado uma vez ao montar o componente

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("isAdmin");
    setUsuarioLogado(null);
    navigate("/");
  };

  console.log("usuarioLogado no render:", usuarioLogado);

  return (
    <div>
      <div className="top-menu">
        <nav>
          <div className="logo">
            <Link to="/">
              <img src="./img/logo.png" alt="Logo" width={180} />
            </Link>
          </div>
          <div className="search">
            <form onSubmit={(e) => {
              e.preventDefault();
              const termo = e.target.elements.searchInput.value;
              console.log("Buscando por:", termo);
            }}>
              <div className="search-item">
                <input
                  type="search"
                  name="searchInput"
                  placeholder="Buscar produtos..."
                />
                 <button type="submit" className="search-btn">
                  <i className="fa fa-search" />
                </button>   
              </div>
            </form>
          </div>
          <div className="menu-user">
            <ul>
              {usuarioLogado ? (
                <>
                  <li className="main-user">
                    <div className="icon-perfil">
                      <Link to="/perfil">
                        <i className="fa-solid fa-user"></i>
                      </Link>
                    </div>
                    <div>
                      <Link to="/perfil">
                        <li className="user-item">Bem-vindo, {usuarioLogado.nome}</li>
                        <li className="user-item">{usuarioLogado.email}</li>
                      </Link>
                    </div>
                  </li>

                  {/* {usuarioLogado.isAdmin && (
                    <li>
                      <Link to="/Admin">Painel de Admin</Link>
                    </li>
                  )}

                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      Sair
                    </button>
                  </li> */}
                </>
              ) : (
                <>
                  <li>
                    <Link to="/Cadastro">Junte-se a nós</Link>
                  </li>
                  <li>
                    <Link to="/Login">Entrar</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {usuarioLogado && (
            <div className="icons">
              <ul>
                <Link to="/carrinho">
                  <li><i className="fa-solid fa-cart-shopping"></i></li>
                </Link>
                <Link to="/favoritos">
                  <li><i className="fa-solid fa-heart"></i></li>
                </Link>
              </ul>
            </div>
          )}
        </nav>
      </div>

      <div className="main-menu">
        <header>
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

          <button className="btn-mob" onClick={() => setOpenMenu(!openMenu)}>
            {openMenu ? (
              <i className="fa-solid fa-xmark"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </button>
        </header>
      </div>
    </div>
  );
};

export default Navbar;
