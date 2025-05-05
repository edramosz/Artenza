import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Db/FireBase";
import "./AdminPainel.css";
import SideBar from "../NavBar/SideBar";

const AdminEndereco = () => {
  const navigate = useNavigate();
  const [enderecos, setEnderecos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchEnderecos = async () => {
      try {
        const response = await fetch("https://localhost:7294/Endereco");
        if (!response.ok) {
          throw new Error("Erro ao carregar endereços.");
        }
        const data = await response.json();
        setEnderecos(data);
      } catch (error) {
        setErro("Não foi possível carregar os endereços.");
        console.error(error);
      }
    };

    fetchEnderecos();
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

  const handleDeleteEndereco = async (id) => {
    try {
      const response = await fetch(`https://localhost:7294/Endereco/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir endereço.");
      }

      setEnderecos(enderecos.filter((endereco) => endereco.id !== id));
    } catch (error) {
      setErro("Erro ao excluir o endereço.");
      console.error(error);
    }
  };

  return (
    <div className="container-dashboard">
      <SideBar />
      <div className="admin-painel">
        <h2 className="title">Painel de Endereços</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <div className="btn-actions">
          <button onClick={() => navigate("/Admin/adicionar-endereco")}>Adicionar Endereço</button>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>

        <div className="top-table">
          <h2>Lista de Endereços</h2>
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="search" placeholder="Buscar endereços..." />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>CEP</th>
              <th>Estado</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {enderecos.length === 0 ? (
              <tr>
                <td colSpan="9">Nenhum endereço encontrado.</td>
              </tr>
            ) : (
              enderecos.map((endereco) => (
                <tr key={endereco.id}>
                  <td>{endereco.id}</td>
                  <td>{endereco.cep}</td>
                  <td>{endereco.estado}</td>
                  <td>{endereco.cidade}</td>
                  <td>
                    <button className="editar" onClick={() => navigate(`/Admin/editar-endereco/${endereco.id}`)}>Editar</button>
                    <button className="excluir" onClick={() => handleDeleteEndereco(endereco.id)}>Excluir</button>
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

export default AdminEndereco;
