// Importa os hooks e componentes do React e Firebase
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../Db/FireBase"; // Importa a configuração do Firebase
import "./Navbar.css"; // Importa os estilos da navbar
import NavItem from "./NavItem"; // Componente que renderiza os itens do menu principal

const Navbar = () => {
  const location = useLocation(); // Hook do React Router para saber a rota atual
  const navigate = useNavigate(); // Hook para redirecionar o usuário
  const [openMenu, setOpenMenu] = useState(false); // Estado para controlar o menu mobile (hamburger)
  const [usuarioLogado, setUsuarioLogado] = useState(null); // Estado para armazenar o nome do usuário logado

  // Lista de itens do menu principal
  const items = [
    { id: 1, url: "/", label: "Home" },
    { id: 2, url: "/Sobre", label: "Sobre" },
    { id: 3, url: "/Contato", label: "Contato" },
    { id: 4, url: "/Empresa", label: "Empresa" },
  ];

  // Efeito que observa mudanças de autenticação no Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Se o usuário estiver logado, pega o nome do localStorage
        const nomeCompleto = localStorage.getItem("nomeUsuario");

        // Armazena o nome ou "Usuário" como fallback
        setUsuarioLogado(nomeCompleto || "Usuário");
      } else {
        // Se não estiver logado, limpa o estado
        setUsuarioLogado(null);
      }
    });

    // Cleanup da autenticação quando o componente desmontar
    return () => unsubscribe();
  }, []);

  // Função para deslogar o usuário
  const handleLogout = async () => {
    await signOut(auth); // Firebase: faz o logout
    localStorage.removeItem("nomeUsuario"); // Remove o nome salvo
    setUsuarioLogado(null); // Limpa o estado local
    navigate("/"); // Redireciona para a página inicial
  };

  return (
    <div>
      {/* Menu superior (exibe nome do usuário e links de login/cadastro ou logout) */}
      <div className="top-menu">
        <nav className="menu-usuario">
          <ul>
            {usuarioLogado ? (
              // Se estiver logado, mostra nome, link para perfil e botão de sair
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
              // Se não estiver logado, mostra links para cadastro e login
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

      {/* Menu principal (com logo e itens de navegação) */}
      <div className="main-menu">
        <header>
          {/* Logo do site */}
          <div className="logo">
            <Link to="/">
              <img src="./img/logo.png" alt="Logo" width={180} />
            </Link>
          </div>

          {/* Lista de itens do menu de navegação */}
          <nav>
            <ul className={`nav-items ${openMenu ? "open" : ""}`}>
              {items.map((item) => (
                <NavItem
                  key={item.id}
                  url={item.url}
                  label={item.label}
                  IsActive={location.pathname === item.url} // Ativa o item conforme a rota atual
                />
              ))}
            </ul>
          </nav>

          {/* Botão para abrir/fechar menu mobile */}
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
