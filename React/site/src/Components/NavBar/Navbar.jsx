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
  const [searchTerm, setSearchTerm] = useState("");
  const [perfilUrl, setPerfilUrl] = useState("");


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
6

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
  // useEffect para monitorar alterações na autenticação e localStorage
  useEffect(() => {
    // Carrega os dados do usuário ao montar o componente
    carregarDadosUsuario();

    // Escuta mudanças na autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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


  useEffect(() => {
    const updatePerfilUrl = () => {
      const url = localStorage.getItem("perfilUrl");
      setPerfilUrl(url);
    };

    // Escuta o evento customizado
    window.addEventListener("perfilAtualizado", updatePerfilUrl);
    updatePerfilUrl(); // Carrega inicialmente

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
  


          <div className="menu-user">
            <ul>
              {usuarioLogado ? (
                <>
                  <li className="main-user">
                    <div className="icon-perfil">
                      <Link to="/perfil">
                        <img src={perfilUrl || "/img/userDefault.png"} alt="" className="perfil-foto" />
                      </Link>
                    </div>
                    <div>
                      <Link to="/perfil">
                        <p className="user-item">Olá, {usuarioLogado.nome}</p>
                        <p className="user-item">{usuarioLogado.email}</p>
                      </Link>
                    </div>
                  </li>
                </>
              ) : (
                <>
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
                </>
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
