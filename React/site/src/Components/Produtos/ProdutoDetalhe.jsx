import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Captura o ID da URL
import Slider from 'react-slick'; // Componente de carrossel para imagens
import './ProdutoDetalhe.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProdutoDetalhe = () => {
    const { id } = useParams(); // Recupera o ID do produto da rota
    const [produto, setProduto] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const buscarProduto = async () => {
            try {
                // Faz a requisição para a API com base no ID capturado
                const resposta = await fetch(`http://localhost:3000/api/produtos/${id}`);

                // Se a resposta não for 200~299, lança um erro
                if (!resposta.ok) throw new Error("Produto não encontrado");

                const dados = await resposta.json();
                setProduto(dados); // Armazena o produto retornado no estado
            } catch (err) {
                setErro(err.message); // Armazena a mensagem de erro
            } finally {
                setCarregando(false); // Marca que o carregamento terminou
            }
        };

        buscarProduto(); // Executa a função ao montar ou trocar o ID
    }, [id]);

    // Controle de estados: carregando, erro ou produto não retornado
    if (carregando) return <p>Carregando produto...</p>;
    if (erro) return <p>{erro}</p>;
    if (!produto) return <p>Produto não encontrado</p>;

    // Garante que sempre haja pelo menos uma imagem para exibir
    const imagens = produto.imagens && produto.imagens.length > 0
        ? produto.imagens
        : [produto.imagem];

    const settings = {
        dots: true,       // Habilita os indicadores
        infinite: true,   // Loop infinito
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="produto-detalhe-container">
            <div className="carousel-container">
                <Slider {...settings}>
                    {imagens.map((img, index) => (
                        <div key={index}>
                            <img src={img} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="info-produto">
                <h2>{produto.nome}</h2>
                <p className="preco">
                    {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="descricao">{produto.descricao}</p>

                {/* Informações técnicas e detalhes do produto */}
                <div className="detalhes">
                    <p><strong>Marca:</strong> {produto.marca}</p>
                    <p><strong>Cor:</strong> {produto.cor}</p>
                    <p><strong>Tamanho:</strong> {produto.tamanho}</p>
                    <p><strong>Material:</strong> {produto.material}</p>
                    <p><strong>Gênero:</strong> {produto.genero}</p>
                    <p><strong>Tipo:</strong> {produto.tipo}</p>
                    <p><strong>Estoque:</strong> {produto.estoque}</p>
                </div>

                {/* Ações do usuário */}
                <div className="acoes">
                    <button className="btn adicionar-carrinho">Adicionar ao Carrinho</button>
                    <button className="btn favoritar">Favoritar</button>
                </div>
            </div>
        </div>
    );
};

export default ProdutoDetalhe;
