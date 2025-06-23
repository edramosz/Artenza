import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProdutoDetalhe.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        const resposta = await fetch(`https://localhost:7294/Produto/${id}`);
        if (!resposta.ok) throw new Error("Produto não encontrado");
        const dados = await resposta.json();

        console.log('Produto recebido:', dados);
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

  // Função para garantir que tamanhos seja um array, mesmo se vier string
  const obterTamanhos = () => {
    if (!produto) return [];
    if (Array.isArray(produto.tamanhos)) return produto.tamanhos;
    if (typeof produto.tamanhos === 'string') {
      return produto.tamanhos.split(',').map(t => t.trim());
    }
    return [];
  };

  const adicionarAoCarrinho = async () => {
    if (!idUsuario) {
      alert("Você precisa estar logado.");
      return;
    }

    if (!tamanhoSelecionado) {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    // Sua lógica para adicionar ao carrinho aqui...
    alert(`Produto ${produto.nome} no tamanho ${tamanhoSelecionado} adicionado ao carrinho!`);
  };

  if (carregando) return <p>Carregando produto...</p>;
  if (erro) return <p>{erro}</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  const tamanhos = obterTamanhos();

  return (
    <div className="prod-detalhe-container">
      <div className="btn">
        <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
      </div>

      <div className="produto-detalhe-container">
        <div className="imagens-container">
          {produto.urlImagens && produto.urlImagens.length > 0 ? (
            produto.urlImagens.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Imagem do produto ${i + 1}`}
                className="imagem-produto"
              />
            ))
          ) : (
            <img
              src="http://via.placeholder.com/600x400.png?text=Sem+imagem"
              alt="Sem imagem"
              className="imagem-produto"
            />
          )}
        </div>

        <div className="info-produto">
          <h2 className="name-prod">{produto.nome}</h2>
          <p className="tipo-prod">{produto.tipo}</p>
          <div className="descricao-div">
            <p className="descricao">{produto.descricao}</p>
            <a href="#descrição">ver-mais</a>
          </div>

          <div className="avaliacoes">
            <p className="avaliacao">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <span>4.7</span>
            </p>

          </div>

          <div className="detalhes-produto">
            <p className="preco">
              {produto.preco.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>

            <div className="filtro-tamanhos">
              <h4 className="title-tamanho">Tamanhos disponíveis:</h4>
              {tamanhos.length > 0 ? (
                tamanhos.map((tam) => (
                  <button
                    key={tam}
                    className={tamanhoSelecionado === tam ? 'selecionado' : ''}
                    onClick={() => setTamanhoSelecionado(tam)}
                  >
                    {tam}
                  </button>
                ))
              ) : (
                <p>Nenhum tamanho disponível</p>
              )}
            </div>
          </div>

          <div className="acoes">
            <button className="btn adicionar-carrinho" onClick={adicionarAoCarrinho}>
              Adicionar ao Carrinho
            </button>
          </div>

          <div className="links">
            <p>Compartilhar: <i className="fa-brands fa-whatsapp"></i> WhatsApp</p>
          </div>
        </div>
      </div>

      <section id="descrição">
        <div className="info-prods">
          <h2 className="title-info">Detalhes do Produtos</h2>
          <p className="descr">{produto.descricao}</p>
        </div>
        <div className="ficha-container">
          <h2 className="title-info">Informações Técnicas</h2>
          <table className="tabela-info">
            <tbody>
              <tr>
                <td><strong>Categoria:</strong></td>
                <td>{produto.categoria}</td>
              </tr>
              <tr>
                <td><strong>Estoque Disponível:</strong></td>
                <td>{produto.estoque}</td>
              </tr>
              <tr>
                <td><strong>Tamanhos Disponíveis:</strong></td>
                <td>{obterTamanhos().join(', ')}</td>
              </tr>
              <tr>
                <td><strong>Material:</strong></td>
                <td>{produto.material}</td>
              </tr>
              <tr>
                <td><strong>Cor:</strong></td>
                <td>{produto.cor}</td>
              </tr>
              <tr>
                <td><strong>Gênero:</strong></td>
                <td>{produto.genero}</td>
              </tr>
              <tr>
                <td><strong>Tipo:</strong></td>
                <td>{produto.tipo}</td>
              </tr>
              <tr>
                <td><strong>Marca:</strong></td>
                <td>{produto.marca}</td>
              </tr>
              <tr>
                <td><strong>Quantidade Vendida:</strong></td>
                <td>{produto.quantidadeVendida}</td>
              </tr>
              <tr>
                <td><strong>Data de Cadastro:</strong></td>
                <td>{new Date(produto.dataCriacao).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ProdutoDetalhe;
