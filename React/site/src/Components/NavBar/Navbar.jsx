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


 const items = [
  { id: 1, url: "/", label: "Home" },
  {
    id: 2,
    url: "/masculino",
    label: "Masculino",
    submenu: [
      {
        title: "ROUPAS",
        items: [
          { label: "Camisetas", url: "/masculino/camisetas" },
          { label: "Camisas", url: "/masculino/camisas" },
          { label: "Calças", url: "/masculino/calcas" },
          { label: "Bermudas", url: "/masculino/bermudas" },
          { label: "Jaquetas", url: "/masculino/jaquetas" },
        ],
      },
      {
        title: "CALÇADOS",
        items: [
          { label: "Calçados", url: "/masculino/calcados" },
        ],
      },
      {
        title: "ACESSÓRIOS",
        items: [
          { label: "Acessórios Masculinos", url: "/masculino/acessorios" },
        ],
      },
    ],
  },
  {
    id: 3,
    url: "/feminino",
    label: "Feminino",
    submenu: [
      {
        title: "ROUPAS",
        items: [
          { label: "Blusas", url: "/feminino/blusas" },
          { label: "Saias", url: "/feminino/saias" },
          { label: "Vestidos", url: "/feminino/vestidos" },
          { label: "Calças", url: "/feminino/calcas" },
          { label: "Macacões", url: "/feminino/macacoes" },
        ],
      },
      {
        title: "CALÇADOS",
        items: [
          { label: "Calçados", url: "/feminino/calcados" },
        ],
      },
      {
        title: "ACESSÓRIOS",
        items: [
          { label: "Acessórios Femininos", url: "/feminino/acessorios" },
        ],
      },
    ],
  },
  {
    id: 4,
    url: "/acessorios",
    label: "Acessórios",
    submenu: [
      {
        title: "BOLSAS E ÓCULOS",
        items: [
          { label: "Bolsas e Mochilas", url: "/acessorios/bolsas-mochilas" },
          { label: "Óculos de Sol", url: "/acessorios/oculos" },
        ],
      },
      {
        title: "OUTROS",
        items: [
          { label: "Bonés e Chapéus", url: "/acessorios/bones-chapeus" },
          { label: "Relógios", url: "/acessorios/relogios" },
          { label: "Cintos", url: "/acessorios/cintos" },
          { label: "Bijuterias", url: "/acessorios/bijuterias" },
          { label: "Meias e Outros", url: "/acessorios/meias-outros" },
        ],
      },
    ],
  },
  {
    id: 5,
    url: "/novidades",
    label: "Novidades",
    submenu: [
      {
        title: "LANÇAMENTOS",
        items: [
          { label: "Lançamentos Masculinos", url: "/novidades/masculino" },
          { label: "Lançamentos Femininos", url: "/novidades/feminino" },
          { label: "Novos Acessórios", url: "/novidades/acessorios" },
        ],
      },
      {
        title: "COLEÇÕES",
        items: [
          { label: "Coleções Recentes", url: "/novidades/colecoes" },
        ],
      },
    ],
  },
  {
    id: 6,
    url: "/promocoes",
    label: "Promoções",
    submenu: [
      {
        title: "POR CATEGORIA",
        items: [
          { label: "Masculino em Promoção", url: "/promocoes/masculino" },
          { label: "Feminino em Promoção", url: "/promocoes/feminino" },
          { label: "Acessórios em Promoção", url: "/promocoes/acessorios" },
        ],
      },
      {
        title: "ESPECIAIS",
        items: [
          { label: "Queima de Estoque", url: "/promocoes/queima-de-estoque" },
          { label: "Outlet", url: "/promocoes/outlet" },
        ],
      },
    ],
  },
  { id: 7, url: "/contato", label: "Contato" },
  { id: 8, url: "/sobre", label: "Sobre" },
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
                <>
                  <li className="main-user">
                    <div className="icon-perfil">
                      <Link to="/perfil">
                        <i className="fa-solid fa-user"></i>
                      </Link>
                    </div>
                    <div>
                      <Link to="/perfil">
                        <p className="user-item">Bem-vindo, {usuarioLogado.nome}</p>
                        <p className="user-item">{usuarioLogado.email}</p>
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
                  submenu={item.submenu}
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
