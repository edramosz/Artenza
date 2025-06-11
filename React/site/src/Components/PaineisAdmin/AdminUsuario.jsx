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

    useEffect(() => {
      const fetchUsuarios = async () => {
        try {
          const response = await fetch("https://localhost:7294/Usuario"); // Atualize se o endpoint for diferente
          if (!response.ok) {
            throw new Error("Erro ao carregar usuários.");
          }
          const data = await response.json();

          // Ordenar os usuários para que os administradores venham primeiro
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
      console.log("Excluindo usuário com ID:", id);
      try {
        const response = await fetch(`https://localhost:7294/Usuario/${id}`, {
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
            <div className="search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="search" placeholder="Buscar usuários..." />
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
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nomeCompleto}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefone}</td>
                    <td>
                      {usuario.isAdmin && (
                        <button className="editar" onClick={() => navigate(`/admin/editar-usuario/${usuario.id}`)}>Editar</button>
                      )}
                      <button className="excluir" onClick={() => handleDeleteUsuario(usuario.id)}>Excluir</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  export default AdminUsuario;
