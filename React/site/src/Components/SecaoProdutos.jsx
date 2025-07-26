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

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setLoading(true);
        console.log("Endpoint usado:", endpoint);
        const res = await fetch(endpoint);

        const contentType = res.headers.get("content-type") || "";
        const rawText = await res.text();

        if (!res.ok) {
          throw new Error(`Erro HTTP ${res.status}: ${rawText}`);
        }

        if (!contentType.includes("application/json")) {
          throw new Error(`Resposta não é JSON: ${rawText}`);
        }

        const data = JSON.parse(rawText);

        const embaralhados = data.sort(() => Math.random() - 0.5);

        const formatados = embaralhados.slice(0, 8).map((prod) => ({
          ...prod,
          urlImagens:
            Array.isArray(prod.urlImagens) &&
              prod.urlImagens.length > 0 &&
              typeof prod.urlImagens[0] === "string"
              ? prod.urlImagens
              : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"],
        }));

        setProdutos(formatados);
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
    const scrollAmount = 1800;

    if (el) {
      el.scrollBy({
        left: direcao === 'esquerda' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      // NÃO chamar verificarBotoes aqui para evitar verificar antes do scroll terminar
    }
  };

  useEffect(() => {
    const el = carrosselRef.current;

    verificarBotoes(); // Verifica logo após os produtos carregarem

    const handleResize = () => verificarBotoes();

    if (el) {
      el.addEventListener('scroll', verificarBotoes); // Atualiza os botões sempre que scroll acontecer
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (el) el.removeEventListener('scroll', verificarBotoes);
      window.removeEventListener('resize', handleResize);
    };
  }, [produtos]);

  return (
    <>
      <div>
        <h3 className="secao-titulo">{titulo}</h3>
      </div>
      <div className="secao-prod">
        {showLeft && (
          <button className="btn-carrossel esquerda" onClick={() => scroll('esquerda')}>
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}
        <div className="carrossel-wrapper">
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
                        e.target.src = 'http://via.placeholder.com/300x200.png?text=Produto+sem+imagem';
                      }}
                    />
                    <div className="text-card">
                      <h4 className="nome">{prod.nome}</h4>
                      <p className="categoria">{prod.categoria}</p>
                      <p className="preco">
                        {prod.preco.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {showRight && (
          <button className="btn-carrossel direita" onClick={() => scroll('direita')}>
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>
    </>
  );
};

export default SecaoProdutos;
