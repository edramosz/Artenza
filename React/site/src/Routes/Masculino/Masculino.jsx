import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Masculino.css';

const Masculino = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  // const location = useLocation();
  // const isActive = (path) => location.pathname === path;

  const ChecksList = [
    {
      title: 'Categorias',
      checksLists: [
        "Blusas", "Calças", "Tênnis", "Camisas", "Vestidos", "Meias"
      ]
    },
    {
      title: 'Sub-Categorias',
      checksLists: [
        "Casual", "Sportivo", "Social"
      ]
    },
    {
      title: 'Tamanhos',
      categoriaTamanho: [
        {
          tipo: 'Roupas',
          checksLists: [
            "PP", "P", "M", "G", "GG"
          ]
        },
         {
          tipo: 'Calçados',
          checksLists: [
            "34", "35", "36", "38", "40", "42", "44", "46", "47", "48"
          ]
        }
      ]
    },
  ]



  useEffect(() => {
    const buscarProdMasc = async () => {
      try {
        const response = await fetch("https://localhost:7294/Produto");

        if (!response.ok) {
          throw new Error("Erro ao buscar produtos: " + response.status);
        }

        const data = await response.json();
        const masculinos = data.filter(produto => produto.genero === "Masculino");

        const dataComImagem = masculinos.map(produto => ({
          ...produto,
          urlImagens: Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0 && produto.urlImagens[0] !== "string"
            ? produto.urlImagens
            : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
        }));

        setProdutos(dataComImagem);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setErro("Não foi possível carregar os produtos.");
      }
    };

    buscarProdMasc();

    const id = localStorage.getItem("idUsuario");
    setIdUsuario(id);
  }, []);



  const adicionarAoCarrinho = async (produto) => {
    if (!idUsuario) {
      alert("Você precisa estar logado.");
      return;
    }

    const idProduto = produto.id;

    try {
      const resposta = await fetch("https://localhost:7294/Carrinho");
      const todos = await resposta.json();

      const existente = todos.find(c => c.idUsuario === idUsuario && c.idProduto === idProduto);

      if (existente) {
        const novaQuantidade = existente.quantidade + 1;
        await fetch(`https://localhost:7294/Carrinho/${existente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUsuario, idProduto, quantidade: novaQuantidade })
        });
      } else {
        await fetch("https://localhost:7294/Carrinho", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUsuario, idProduto, quantidade: 1 })
        });
      }

      alert("Produto adicionado ao carrinho!");
    } catch (err) {
      console.error("Erro ao adicionar:", err);
      alert("Erro ao adicionar ao carrinho.");
    }
  };


  return (
    <>
      <div className="conteiner-masc">
        <div className="masc-content">
          <div>
            <h2 className="title-masc">Masculino</h2>
          </div>
          <div>
            <p>8 Resultado</p>
          </div>
        </div>
      </div>
      <div className="flex-conteiner">

         <aside className="sidebar">
      <h2>Filtros</h2>

      {ChecksList.map((item, index) => (
        <details key={index} open>
          <summary>{item.title}</summary>

          {/* Renderiza tamanhos com subgrupos */}
          {item.categoriaTamanho ? (
            item.categoriaTamanho.map((subItem, subIndex) => (
              <details key={subIndex} style={{ marginLeft: '1rem' }} open>
                <summary>{subItem.tipo}</summary>
                <ul>
                  {subItem.checksLists.map((check, i) => (
                    <li key={i}>
                      <label>
                        <input type="checkbox" value={check} />
                        {check}
                      </label>
                    </li>
                  ))}
                </ul>
              </details>
            ))
          ) : (
            // Renderiza listas simples
            <ul>
              {item.checksLists.map((check, i) => (
                <li key={i}>
                  <label>
                    <input type="checkbox" value={check} />
                    {check}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </details>
      ))}
    </aside>



        <main className="content">
          <div className="masc-produtos">
            {produtos.map((prod) => (
              <Link to={`/produto/${prod.id}`} key={prod.id}>
                <div className="card-prods">
                  <div>
                    <img
                      src={prod.urlImagens[0]}
                      alt={prod.nome}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                      }}
                    />
                  </div>
                  <div className="text-card">
                    <h4 className="nome">{prod.nome}</h4>
                    <p className="categoria">{prod.categoria}</p>
                    <p className="preco">
                      {prod.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <div className="btns-actions">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        adicionarAoCarrinho(prod);
                      }}           >
                      Adicione ao Carrinho
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Masculino;