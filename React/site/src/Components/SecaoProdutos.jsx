import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SecaoProdutos.css';

const SecaoProdutos = ({ titulo, produtos, adicionarAoCarrinho }) => {
    const carrosselRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const verificarBotoes = () => {
        const el = carrosselRef.current;
        if (!el) return;

        setShowLeft(el.scrollLeft > 0);
        setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    const scroll = (direcao) => {
        const el = carrosselRef.current;
        const scrollAmount = 100000;

        if (el) {
            el.scrollBy({
                left: direcao === 'esquerda' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });

            // Espera a animação terminar antes de verificar
            setTimeout(verificarBotoes, 300);
        }
    };

    useEffect(() => {
        verificarBotoes();

        const handleResize = () => verificarBotoes();
        const el = carrosselRef.current;

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
                    {produtos.length === 0 ? (
                        <p>Nenhum produto disponível</p>
                    ) : (
                        produtos.map((prod) => (
                            <Link to={`/produto/${prod.id}`} key={prod.id}>
                                <div className="card-prods">
                                    <img
                                        src={prod.urlImagens[0]}
                                        alt={prod.nome}
                                        onError={(e) => {
                                            e.target.src =
                                                "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
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
