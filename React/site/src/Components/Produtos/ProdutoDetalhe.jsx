import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProdutoDetalhe.css';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        const resposta = await fetch(`https://localhost:7294/Produto/${id}`);
        if (!resposta.ok) throw new Error("Produto não encontrado");

        const dados = await resposta.json();
        setProduto(dados);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarProduto();
  }, [id]);

  useEffect(() => {
    const id = localStorage.getItem("idUsuario");
    setIdUsuario(id);
  }, []);

  const imagens = Array.isArray(produto?.urlImagens) && produto.urlImagens.length > 0
    ? produto.urlImagens
    : ["http://via.placeholder.com/600x400.png?text=Produto+sem+imagem"];

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });
  };

  const scrollLeft = () => {
    const newIndex = currentIndex === 0 ? imagens.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = (currentIndex + 1) % imagens.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const adicionarAoCarrinho = async () => {
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

  if (carregando) return <p>Carregando produto...</p>;
  if (erro) return <p>{erro}</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div className="produto-detalhe-container">
      <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>

      <div className="carousel-wrapperr">
        <button className="carousel-button left" onClick={scrollLeft}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="carousel-container" ref={carouselRef}>
          {imagens.map((img, index) => (
            <div key={index} className="carousel-slide">
              <img src={img} alt={`Imagem ${index}`} />
            </div>
          ))}
        </div>

        <button className="carousel-button right" onClick={scrollRight}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div className="info-produto">
        <h2>{produto.nome}</h2>
        <p className="preco">
          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <p className="descricao">{produto.descricao}</p>

        <div className="detalhes">
          <p><strong>Marca:</strong> {produto.marca}</p>
          <p><strong>Cor:</strong> {produto.cor}</p>
          <p><strong>Tamanho:</strong> {produto.tamanho}</p>
          <p><strong>Material:</strong> {produto.material}</p>
          <p><strong>Gênero:</strong> {produto.genero}</p>
          <p><strong>Tipo:</strong> {produto.tipo}</p>
          <p><strong>Estoque:</strong> {produto.estoque}</p>
        </div>

        <div className="acoes">
          <button className="btn adicionar-carrinho" onClick={adicionarAoCarrinho}>
            Adicionar ao Carrinho
          </button>

          <button className="btn favoritar">Favoritar</button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;
