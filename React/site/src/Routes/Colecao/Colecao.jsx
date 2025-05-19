import './Colecao.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("https://localhost:7294/Produto");
        if (!response.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        const data = await response.json();

        const dataComImagem = data.map(produto => ({
          ...produto,
          urlImagens: Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0 && produto.urlImagens[0] !== "string"
            ? produto.urlImagens
            : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
        }));

        setProdutos(dataComImagem);
      } catch (error) {
        setErro("Não foi possível carregar os produtos.");
        console.error("Erro:", error.message);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="colecao-container">
      <aside className="filtro-lateral">
        <h3>Cores</h3>
        <ul className="filtro-lista">
          <li><span className="cor cor-amarelo" /> Amarelo</li>
          <li><span className="cor cor-azul" /> Azul</li>
          <li><span className="cor cor-bege" /> Bege</li>
          <li><span className="cor cor-preto" /> Preto</li>
        </ul>

        <h3>Tamanho</h3>
        <div className="filtro-tamanhos">
          {['26', '28', '30', '32', '34', '36'].map(tam => (
            <button key={tam}>{tam}</button>
          ))}
        </div>
      </aside>

      <main className="lista-produtos">
        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        {produtos.map(prod => (
          <Link to={`/produto/${prod.id}`} key={prod.id}>
            <div className="card-produto">
              <img
                src={prod.urlImagens[0]}
                alt={prod.nome}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                }}
              />
              <h4>{prod.nome}</h4>
              <p>{prod.categoria}</p>
              <p>{prod.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default ListaProdutos;
