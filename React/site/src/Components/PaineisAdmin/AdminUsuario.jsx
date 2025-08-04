import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Db/FireBase";
import './AdminPainel.css';
import SideBar from "../NavBar/SideBar";

const AdminUsuario = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("https://artenza.onrender.com/Usuario");
        if (!response.ok) {
          throw new Error("Erro ao carregar usuários.");
        }
        const data = await response.json();

        // Administradores primeiro
        data.sort((a, b) => (b.isAdmin ? 1 : 0) - (a.isAdmin ? 1 : 0));
        setUsuarios(data);
      } catch (error) {
        setErro("Não foi possível carregar os usuários.");
        console.error(error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("nomeUsuario");
      localStorage.removeItem("isAdmin");
      navigate("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const handleDeleteUsuario = async (id) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Usuario/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário.");
      }

      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      setErro("Erro ao excluir o usuário.");
      console.error(error);
    }
  };

  // Filtrar usuários conforme o termo de busca
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.telefone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const usuariosPaginados = usuariosFiltrados.slice(inicio, inicio + porPagina);

  return (
    <div className="container-dashboard">
      <SideBar />
      <div className="admin-painel">
        <h2 className="title">Painel de Usuários</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <div className="btn-actions">
          <button onClick={() => navigate("/admin/adicionar-usuario")}>Adicionar Usuário</button>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>

        <div className="top-table">
          <h2>Lista de Usuários</h2>
          <div className="search-item">
            <input
              type="search"
              name="searchInput"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagina(1); // Voltar para página 1 ao pesquisar
              }}
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
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.length === 0 ? (
              <tr>
                <td colSpan="5">Nenhum usuário encontrado.</td>
              </tr>
            ) : (
              usuariosPaginados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nomeCompleto}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefone}</td>
                  <td>
                    {usuario.isAdmin && (
                      <button className="editar" onClick={() => navigate(`/admin/editar-usuario/${usuario.id}`)}>Editar</button>
                    )}
                    {searchTerm && (
                      <button className="excluir" onClick={() => handleDeleteUsuario(usuario.id)}>Excluir</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="paginacao">
            <button
              onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
              disabled={pagina === 1}
              className="seta"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                id="page"
                key={i}
                className={pagina === i + 1 ? "pagina-ativa" : ""}
                onClick={() => setPagina(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={pagina === totalPaginas}
              className="seta"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuario;
