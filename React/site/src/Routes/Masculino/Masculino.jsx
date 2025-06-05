import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Masculino.css";

const Masculino = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);

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

    // Pega o id do usuário logado
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
    <div className="masc-container">
      <div className="masc-content">
        <h1>Roupas Masculinas</h1>
        <h3>Encontre as melhores vestimentas para o dia a dia. </h3>
      </div>

      <div className="masc-img">
        <div className="content-img">
          <h3>Nossa coleção</h3>
          <button>Saiba mais</button>
        </div>
      </div>

      <div className="conteiner-masc-prod">
        <h2>Nossos Produtos</h2>
        <div className="masc-produtos">
          {erro && <p style={{ color: "red" }}>{erro}</p>}

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
                <div>
                  <h4>{prod.nome}</h4>
                  <p>{prod.categoria}</p>
                  <p>
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
      </div>

      <div className="masc-catalog">
        <div className="links-masc">
          <h2>Outros</h2>
          <nav>
            <ul className="items-masc">
              <Link to=''>
                <li className="item-ul-masc">Tennis</li>
              </Link>

              <Link to=''>
                <li className="item-ul-masc">Calças</li>
              </Link>

              <Link to=''>
                <li className="item-ul-masc">Blusas</li>
              </Link>
            </ul>
            
            <ul className="items-masc">
              <Link to=''>
                <li className="item-ul-masc">Corrente</li>
              </Link>

              <Link to=''>
                <li className="item-ul-masc">Shorts</li>
              </Link>

              <Link to=''>
                <li className="item-ul-masc">Jaquetas</li>
              </Link>
            </ul>
          </nav>
        </div>
        <div className="cards-prods">
            <img src="../img/fundo.png" alt="" />
        </div>        
      </div>
    </div>
  );
};

export default Masculino;
