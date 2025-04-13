import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth"; //  Funções do Firebase Auth
import { auth } from "../Db/FireBase"; //  Autenticação do Firebase
import "./Navbar.css";
import NavItem from "./NavItem";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); //  Para redirecionar após logout
  const [openMenu, setOpenMenu] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null); //  Estado para controlar se há usuário logado

  //  Itens do menu principal
  const items = [
    { id: 1, url: "/", label: "Home" },
    { id: 2, url: "/Sobre", label: "Sobre" },
    { id: 3, url: "/Contato", label: "Contato" },
    { id: 4, url: "/Empresa", label: "Empresa" },
  ];

  //  Verifica se o usuário está logado no Firebase e pega o nome salvo no localStorage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const nome = localStorage.getItem("nomeUsuario") || "Usuário"; // Pega nome do localStorage
        setUsuarioLogado(nome); // Define no estado
      } else {
        setUsuarioLogado(null); // Se não estiver logado
      }
    });

    return () => unsubscribe(); //  Limpa o listener ao desmontar
  }, []);

  //  Função de logout
  const handleLogout = async () => {
    await signOut(auth); // Desloga do Firebase
    localStorage.removeItem("nomeUsuario"); // Remove o nome salvo
    setUsuarioLogado(null); // Limpa estado
    navigate("/"); // Redireciona para a home
  };

  return (
    <div>
      <div className="top-menu">
        <nav>
          <ul>
            {/* Se estiver logado, mostra nome, link do perfil e botão de sair */}
            {usuarioLogado ? (
              <>
                <li>Olá, {usuarioLogado}</li>
                <li>
                  <Link to="/perfil">Visualizar Perfil</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              //  Se não estiver logado, mostra links de Cadastro e Login
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
        </nav>
      </div>

      <div className="main-menu">
        <header>
          <div className="logo">
            <Link to="/">
              <img src="caminho/da/imagem.png" alt="Logo" />
            </Link>
          </div>
          <nav>
            <ul className={`nav-items ${openMenu ? "open" : ""}`}>
              {/* Menu principal com os itens configurados */}
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

          {/* Botão mobile */}
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
