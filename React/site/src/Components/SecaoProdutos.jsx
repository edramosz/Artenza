import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SecaoProdutos.css';

const SecaoProdutos = ({ titulo, endpoint }) => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const carrosselRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Buscar os produtos do endpoint
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setLoading(true);
        const res = await fetch(endpoint);
        const data = await res.json();

        const formatar = (lista) => lista.map(prod => ({
          ...prod,
          urlImagens: Array.isArray(prod.urlImagens) && prod.urlImagens.length > 0 && typeof prod.urlImagens[0] === "string"
            ? prod.urlImagens
            : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
        }));

        const filtrados = data.filter(p => ["Masculino", "Unissex"].includes(p.genero)); // pode remover se quiser mostrar todos
        setProdutos(formatar(filtrados));
        setErro(null);
      } catch (err) {
        console.error("Erro ao buscar produtos da seção:", err);
        setErro("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    buscarProdutos();
  }, [endpoint]);

  const verificarBotoes = () => {
    const el = carrosselRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (direcao) => {
    const el = carrosselRef.current;
    const scrollAmount = 1000;

    if (el) {
      el.scrollBy({
        left: direcao === 'esquerda' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(verificarBotoes, 300);
    }
  };

  useEffect(() => {
    verificarBotoes();

    const el = carrosselRef.current;
    const handleResize = () => verificarBotoes();

    if (el) {
      el.addEventListener('scroll', verificarBotoes);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (el) el.removeEventListener('scroll', verificarBotoes);
      window.removeEventListener('resize', handleResize);
    };
  }, [produtos]);

  return (
    <div className="secao-prod">
      <h3 className="secao-titulo">{titulo}</h3>
      <div className="carrossel-wrapper">
        {showLeft && (
          <button className="btn-carrossel esquerda" onClick={() => scroll('esquerda')}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <div className="secao-produtos" ref={carrosselRef}>
          {loading ? (
            <p>Carregando...</p>
          ) : erro ? (
            <p>{erro}</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto disponível</p>
          ) : (
            produtos.map((prod) => (
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
                    <h4 className="nome">{prod.nome}</h4>
                    <p className="categoria">{prod.categoria}</p>
                    <p className="preco">
                      {prod.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {showRight && (
          <button className="btn-carrossel direita" onClick={() => scroll('direita')}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SecaoProdutos;
