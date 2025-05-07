// Importa os hooks e componentes do React e Firebase
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
  ];

  useEffect(() => {
    const carregarDadosUsuario = () => {
      const nomeCompleto = localStorage.getItem("nomeUsuario");
      const emailStr = localStorage.getItem("email");
      const isAdminStr = localStorage.getItem("isAdmin");

      const isAdmin = isAdminStr === "true";

      useEffect(() => {
        console.log("LocalStorage atual:", {
          nome: localStorage.getItem("nomeUsuario"),
          email: localStorage.getItem("email"),
          isAdmin: localStorage.getItem("isAdmin"),
        });
      }, [usuarioLogado]);


      if (nomeCompleto) {
        setUsuarioLogado({
          nome: nomeCompleto,
          email: emailStr,
          isAdmin: isAdmin,
        });
      } else {
        setUsuarioLogado(null);
      }
    };


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
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("isAdmin");
    setUsuarioLogado(null);
    navigate("/");
  };

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
                  type="text"
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
                  <div className="main-user">
                    <div>
                      <Link to="/perfil">
                        <i class="fa-solid fa-user"></i>
                      </Link>
                    </div>
                    <div>
                      <Link to="/perfil">
                        <li className="user-item">Bem-vindo (a), {usuarioLogado.nome}</li>
                        <li className="user-item">{usuarioLogado.email}</li>
                      </Link>
                    </div>

                  </div>
                  

                  {usuarioLogado.isAdmin && (
                    <li>
                      <Link to="/Admin">Painel de Admin</Link>
                    </li>
                  )}

                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      Sair
                    </button>
                  </li>


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
          <div className="icons">
            <ul>
              <Link>
                <li><i class="fa-solid fa-cart-shopping"></i></li>
              </Link>
              <Link>
                <li><i class="fa-solid fa-heart"></i></li>
              </Link>
            </ul>
          </div>
        </nav>
      </div>

      {/* Menu principal */}
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
