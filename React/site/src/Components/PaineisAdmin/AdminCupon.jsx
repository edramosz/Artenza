import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Db/FireBase";
import SideBar from "../NavBar/SideBar";

const AdminCupom = () => {
  const navigate = useNavigate();
  const [cupons, setCupons] = useState([]);
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCupons = async () => {
      try {
        const response = await fetch("https://artenza.onrender.com/Cupom");
        if (!response.ok) {
          throw new Error("Erro ao carregar cupons.");
        }
        const data = await response.json();
        setCupons(data);
      } catch (error) {
        setErro("Não foi possível carregar os cupons.");
        console.error(error);
      }
    };

    fetchCupons();
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

  const handleDeleteCupom = async (id) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Cupom/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir cupom.");
      }

      setCupons(cupons.filter((cupom) => cupom.id !== id));
    } catch (error) {
      setErro("Erro ao excluir o cupom.");
      console.error(error);
    }
  };

  // Filtrar cupons pela busca no código
  const cuponsFiltrados = cupons.filter((cupom) =>
    cupom.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPaginas = Math.ceil(cuponsFiltrados.length / itensPorPagina);
  const inicio = (pagina - 1) * itensPorPagina;
  const cuponsPaginados = cuponsFiltrados.slice(inicio, inicio + itensPorPagina);

  return (
    <div className="container-dashboard">
      <SideBar />
      <div className="admin-painel">
        <h2 className="title">Painel de Cupons</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <div className="btn-actions">
          <button onClick={() => navigate("/admin/adicionar-cupom")}>
            Adicionar Cupom
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>

        <div className="top-table">
          <h2>Lista de Cupons</h2>
          <div className="search-item">
            <input
              type="search"
              name="searchInput"
              placeholder="Buscar cupons..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagina(1); // Resetar página ao pesquisar
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
              <th>Código</th>
              <th>Desconto (%)</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cuponsPaginados.length === 0 ? (
              <tr>
                <td colSpan="5">Nenhum cupom encontrado.</td>
              </tr>
            ) : (
              cuponsPaginados.map((cupom) => (
                <tr key={cupom.id}>
                  <td>{cupom.id}</td>
                  <td>{cupom.codigo}</td>
                  <td>{cupom.valor}%</td>
                  <td>{cupom.ativo ? "Sim" : "Não"}</td>
                  <td>
                    <button
                      className="editar"
                      onClick={() => navigate(`/admin/editar-cupom/${cupom.id}`)}
                    >
                      <i class="fa-solid fa-pencil"></i>
                    </button>
                    {searchTerm && (
                      <button
                        className="excluir"
                        onClick={() => handleDeleteCupom(cupom.id)}
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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

export default AdminCupom;
