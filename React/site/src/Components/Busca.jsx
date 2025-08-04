import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Busca = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para controlar o input de busca
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para os produtos e erro da busca
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);

  // useEffect para buscar produtos sempre que a query string mudar
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const termo = queryParams.get("termo") || "";

    // Atualiza o valor do input para refletir o termo da URL
    setSearchTerm(termo);

    if (termo.trim()) {
      fetch(`https://artenza.onrender.com/Produto/search?termo=${encodeURIComponent(termo)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar produtos");
          return res.json();
        })
        .then((data) => {
          setProdutos(data);
          setErro(null);
        })
        .catch((err) => {
          setErro(err.message);
          setProdutos([]);
        });
    } else {
      // Se não tem termo, limpa os produtos e erro
      setProdutos([]);
      setErro(null);
    }
  }, [location.search]);

  // Função que dispara a navegação para a URL com o termo de busca
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      navigate(`/busca?termo=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  return (
    <main className="pagina-busca">      

      <h2 className="titulo-busca">
        Resultado da busca por: <strong>{searchTerm}</strong>
      </h2>

      {erro && <p className="erro-busca">Erro: {erro}</p>}

      {!erro && produtos.length === 0 && searchTerm.trim() !== "" && (
        <p className="nenhum-resultado">Nenhum produto encontrado.</p>
      )}

      <div className="masc-produtos">
        {produtos.map((prod) => (
          <Link to={`/produto/${prod.id}`} key={prod.id}>
            <div className="card-prods">
              <img
                src={prod.urlImagens[0]}
                alt={prod.nome}
                onError={(e) => {
                  e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                }}
              />
              <div className="text-card">
                <p className="categoria">{prod.categoria}</p>
                <h4 className="nome">{prod.nome}</h4>
                <p className="preco">
                  {prod.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Busca;
