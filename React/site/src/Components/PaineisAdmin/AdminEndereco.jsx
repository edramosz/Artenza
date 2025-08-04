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
  const [busca, setBusca] = useState(""); // Campo de busca

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const enderecosPorPagina = 10;

  useEffect(() => {
    const fetchEnderecos = async () => {
      try {
        const response = await fetch("https://artenza.onrender.com/Endereco");
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
      const response = await fetch(`https://artenza.onrender.com/Endereco/${id}`, {
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

  // Filtrando resultados com base na busca
  const enderecosFiltrados = enderecos.filter((endereco) => {
    const termo = busca.toLowerCase();
    return (
      endereco.cep?.toLowerCase().includes(termo) ||
      endereco.estado?.toLowerCase().includes(termo) ||
      endereco.cidade?.toLowerCase().includes(termo)
    );
  });

  // Paginação com dados filtrados
  const totalPaginas = Math.ceil(enderecosFiltrados.length / enderecosPorPagina);
  const indexInicial = (paginaAtual - 1) * enderecosPorPagina;
  const indexFinal = indexInicial + enderecosPorPagina;
  const enderecosPaginados = enderecosFiltrados.slice(indexInicial, indexFinal);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const handleBuscaChange = (e) => {
    setBusca(e.target.value);
    setPaginaAtual(1); // Reinicia para a primeira página ao buscar
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
          <div className="search-item">
            <input
              type="search"
              placeholder="Buscar endereços..."
              value={busca}
              onChange={handleBuscaChange}
            />
            {busca && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setBusca("")}
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
              <th>CEP</th>
              <th>Estado</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {enderecosPaginados.length === 0 ? (
              <tr>
                <td colSpan="5">Nenhum endereço encontrado.</td>
              </tr>
            ) : (
              enderecosPaginados.map((endereco) => (
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

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="paginacao">
            <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {[...Array(totalPaginas)].map((_, index) => {
              const numeroPagina = index + 1;
              return (
                <button
                  key={numeroPagina}
                  className={paginaAtual === numeroPagina ? "pagina-ativa" : ""}
                  onClick={() => mudarPagina(numeroPagina)}
                >
                  {numeroPagina}
                </button>
              );
            })}

            <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEndereco;
