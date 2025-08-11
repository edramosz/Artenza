import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Db/FireBase";
import './AdminPainel.css';
import SideBar from "../NavBar/SideBar";

const AdminProduto = () => {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("https://artenza.onrender.com/Produto");
        if (!response.ok) {
          throw new Error("Erro ao carregar produtos.");
        }
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        setErro("Não foi possível carregar os produtos.");
        console.error(error);
      }
    };

    fetchProdutos();
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

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Produto/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir produto.");
      }

      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      setErro("Erro ao excluir o produto.");
      console.error(error);
    }
  };

  // Filtragem
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(produtosFiltrados.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const produtosPaginados = produtosFiltrados.slice(inicio, inicio + porPagina);

  return (
    <div className="container-dashboard">
      <SideBar />
      <div className="admin-painel">
        <h2 className="title">Painel de Produtos</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <div className="btn-actions">
          <button onClick={() => navigate("/admin/adicionar-produto")}>Adicionar Produto</button>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>

        <div className="top-table">
          <h2>Lista de Produtos</h2>
          <div className="search-item">
            <input
              type="search"
              name="searchInput"
              placeholder="Buscar produtos..."
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
              <th>ID do produto</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosPaginados.length === 0 ? (
              <tr>
                <td colSpan="5">Nenhum produto encontrado.</td>
              </tr>
            ) : (
              produtosPaginados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                  <td>{produto.categoria}</td>
                  <td>
                    <button className="editar" onClick={() => navigate(`/admin/editar-produto/${produto.id}`)}><i class="fa-solid fa-pencil"></i></button>
                    {searchTerm && (
                      <button className="excluir" onClick={() => handleDeleteProduct(produto.id)}><i class="fa-solid fa-xmark"></i></button>
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

export default AdminProduto;
