import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const Feminino = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);

 const cards = [
    {
      img: '././img/vestidos.jpg',
      alt: 'Vestidos femininos',
      link: '/categoria/vestidos',
      title: 'Vestidos'
    },
    {
      img: '././img/saias.jpg',
      alt: 'Saias',
      link: '/categoria/saias',
      title: 'Saias'
    },
    {
      img: '././img/sapatos.jpg',
      alt: 'Sapatos femininos',
      link: '/categoria/sapatos',
      title: 'Sapatos'
    },
    {
      img: '././img/bijuterias.jpg',
      alt: 'Bijuterias e acessórios',
      link: '/categoria/acessorios',
      title: 'Acessórios'
    },
    {
      img: '././img/blusasf.jpg',
      alt: 'Blusas femininas básicas e estampadas',
      link: '/categoria/blusas',
      title: 'Blusas'
    },
    {
      img: '././img/casacosf.jpg',
      alt: 'Casacos e jaquetas femininas',
      link: '/categoria/casacos',
      title: 'Casacos'
    }
  ];

  useEffect(() => {
    const buscarProdMasc = async () => {
      try {
        const response = await fetch("https://localhost:7294/Produto");

        if (!response.ok) {
          throw new Error("Erro ao buscar produtos: " + response.status);
        }

        const data = await response.json();

        const femininos = data.filter(produto => produto.genero === "Feminino");

        const dataComImagem = femininos.map(produto => ({
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

  // Cria uma referência para acessar a div com rolagem horizontal
  const scrollRef = useRef(null);

  // Rola a div 800px para a esquerda com animação suave
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -1100, behavior: 'smooth' });
  };

  // Rola a div 800px para a direita com animação suave
  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 1100, behavior: 'smooth' });
  };



  return (
    <div className="masc-container">
      <div className="masc-content">
        <h1>Modelos Femininas</h1>
        <h3>Procure as melhores roupas para você aqui. </h3>
      </div>

      <div className="masc-img">
        <div className="content-img">
          <h3>Nossa coleção</h3>
          <button className="masc-btn">Saiba mais</button>
        </div>
      </div>

      <div className="container-masc-categories">
        <div>
          <h2>Compre por categoria</h2>
        </div>
        <button className="carousel-button left" onClick={scrollLeft}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="masc-categories" ref={scrollRef}>
          {cards.slice(0, 5).map((card, index) => (
            <div className="masc-categ" key={index}>
              <div>
                <img src={card.img} alt={card.alt} />
                <p className="legenda">{card.title}</p>
              </div>
              <div className="btn-actions">
                <Link to={card.link}>
                  <button className="masc-btn">Ver Tudo</button>
                </Link>
              </div>
            </div>
          ))}
        </div>


        <button className="carousel-button right" onClick={scrollRight}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>

      </div>


      <div className="conteiner-masc-prod">
        <h2>Nossos Produtos:</h2>
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
      </div>

      <div className="ver-mais">
        <Link>
          <p>Ver Mais</p>
        </Link>
      </div>
    </div>
  );
};

export default Feminino;
