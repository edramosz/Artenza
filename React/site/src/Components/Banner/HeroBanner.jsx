import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const carrosselRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const verificarBotoes = () => {
        const el = carrosselRef.current;
        if (!el) return;

        // Adiciona uma tolerância de 10px para evitar flickering
        setShowLeft(el.scrollLeft > 10);
        setShowRight(el.scrollLeft + el.clientWidth + 10 < el.scrollWidth);
    };

    const scroll = (direcao) => {
        const el = carrosselRef.current;
        const scrollAmount = 300; // Reduzido para scroll mais suave
        if (el) {
            el.scrollBy({
                left: direcao === 'esquerda' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(verificarBotoes, 300);
        }
    };

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://artenza.onrender.com/Produto/lancamentos");
                const data = await res.json();

                const filtrados = data.filter(p => ["Masculino", "Unissex"].includes(p.genero));

                const formatados = filtrados.map(prod => ({
                    ...prod,
                    urlImagens: Array.isArray(prod.urlImagens) && prod.urlImagens.length > 0
                        ? prod.urlImagens
                        : ["http://via.placeholder.com/300x200.png?text=Sem+Imagem"]
                }));

                setProdutos(formatados);
                setErro(null);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setErro("Erro ao carregar produtos.");
                setProdutos([]);
            } finally {
                setLoading(false);
                // Verifica os botões após o carregamento
                setTimeout(verificarBotoes, 500);
            }
        };

        buscarProdutos();
    }, []);

    useEffect(() => {
        const el = carrosselRef.current;
        const handleResize = () => setTimeout(verificarBotoes, 100);

        if (el) {
            el.addEventListener('scroll', verificarBotoes);
            window.addEventListener('resize', handleResize);
            // Verificação inicial com delay
            setTimeout(verificarBotoes, 300);
        }

        return () => {
            if (el) el.removeEventListener('scroll', verificarBotoes);
            window.removeEventListener('resize', handleResize);
        };
    }, [produtos]);

    return (
        <div className="hero-banner-conteiner">
            <div className="content-hero">
                <div className="content-banner">
                    <div className="title-intro">
                        <i className="fa-solid fa-truck-fast"></i>
                        <p>Explore Nossa Coleção de Roupas e Acessórios.</p>
                    </div>
                    <div className="content-intro">
                        <h1 className="title-hero">
                            Explore Nossa Coleção de <span>Roupas e Acessórios.</span>
                        </h1>
                        <p className="text-hero">
                            Lorem ipsum dolor sit amet consectetur modi inventore incidunt in perferendis rem et quaerat. Lorem ipsum dolor sit amet consectetur modiendis rem et quaerat.
                        </p>
                    </div>
                </div>

                <div className="buttons-banner">
                    <button>Compre Agora</button>
                    <button className="secondary">Veja nossos produtos</button>
                </div>               
            </div>

            <div className="carrossel-section">
                <div className="carrossel-wrapper">


                    <div className="_secao-produtos" ref={carrosselRef}>
                        {loading ? (
                            <div className="loading-placeholder">Carregando...</div>
                        ) : erro ? (
                            <div className="error-message">{erro}</div>
                        ) : produtos.length === 0 ? (
                            <div className="empty-message">Nenhum produto disponível</div>
                        ) : (
                            produtos.slice(0, 3).map(prod => (
                                <Link to={`/produto/${prod.id}`} key={prod.id} className="product-link">
                                    <div className="_card-prods">
                                        <img
                                            src={prod.urlImagens[0]}
                                            alt={prod.nome}
                                            onError={(e) => {
                                                e.target.src = "http://via.placeholder.com/300x200.png?text=Sem+Imagem";
                                            }}
                                        />
                                        <div className="_text-card">
                                            <h4 className="_nome">{prod.nome}</h4>
                                            <p className="_categoria">{prod.categoria}</p>
                                            <p className="_preco">
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


                    <button
                        className={`btn-carrossel esquerda ${showLeft ? 'visible' : ''}`}
                        onClick={() => scroll('esquerda')}
                        aria-label="Voltar"
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button
                        className={`btn-carrossel direita ${showRight ? 'visible' : ''}`}
                        onClick={() => scroll('direita')}
                        aria-label="Avançar"
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;