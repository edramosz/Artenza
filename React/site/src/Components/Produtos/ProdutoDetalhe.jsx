import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProdutoDetalhe.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFull, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';


import SecaoProdutos from '../../Components/SecaoProdutos';
import Dropdown from '../DropDown';

const Estrelas = ({ nota, max = 5 }) => {
  const estrelas = [];
  for (let i = 1; i <= max; i++) {
    estrelas.push(
      <FontAwesomeIcon
        key={i}
        icon={faStarFull}
        style={{ color: i <= nota ? "#f1d323ff" : "#ccc", marginRight: 2 }}
      />
    );
  }
  return <span>{estrelas}</span>;
};

const ProdutoDetalhe = () => {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [urlUsuario, setUrlUsuario] = useState("");
  const [erro, setErro] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [quantidadeExibida, setQuantidadeExibida] = useState(3);
  const [filtroEstrela, setFiltroEstrela] = useState(null);
  const [selecao, setSelecao] = useState("descricao")
  const [favoritado, setFavoritado] = useState(false);

  const [feedbacks, setFeedbacks] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(0);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoComentario, setNovoComentario] = useState("");
  const [novaNota, setNovaNota] = useState(0);


  const navigate = useNavigate();

  function RenderConteudo() {
    switch (selecao) {
      case "descricao":
        return (
          <section id="descrição">
            <div className="info-prods">
              <h2 className="title-info">Detalhes do Produtos</h2>
              <p className="descr">"{produto.descricao}"</p>
            </div>
          </section>
        );
      case "tabela":
        return (
          <section>
            <div className="ficha-container">
              <table className="tabela-info">
                <thead>
                  <tr>
                    <td>Produto</td>
                    <td>Informações</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className='info-span'>Categoria:</span></td>
                    <td>{produto.categoria}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Estoque Disponível:</span></td>
                    <td>{produto.estoque}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Tamanhos Disponíveis:</span></td>
                    <td>{obterTamanhos().join(', ')}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Material:</span></td>
                    <td>{produto.material}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Cor:</span></td>
                    <td>{produto.cor}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Gênero:</span></td>
                    <td>{produto.genero}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Subcategoria:</span></td>
                    <td>{produto.subCategoria}</td>
                  </tr>
                  <tr>
                    <td><span className='info-span'>Marca:</span></td>
                    <td>{produto.marca}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        );
      case "feedback":
        return (
          <div className="feedback-container">
            <div className="feedback-header">
              <div className="rating-overview">
                <div className="average-rating">
                  <span className="rating-value media-notas">{mediaNotas.toFixed(1)}</span>
                  <span className="rating-text">de 5</span>
                </div>
                <div className="stars-large">
                  <Estrelas nota={Math.round(mediaNotas)} max={5} />
                </div>
                <div className="review-count">({feedbacks.length} Avaliações)</div>
              </div>
            </div>

            <div className="review-controls">
              <div className="review-list-header">
                <h3 className='title-review'>Lista de Avaliações</h3>
                <span className="showing-results">
                  Mostrando 1-{Math.min(quantidadeExibida, feedbacksFiltrados.length)} de {feedbacksFiltrados.length} resultados
                </span>
              </div>

              <div className="filter-sort">
                <h3 className="filter-title">Ordernar por:</h3>
                <div className="filter-section">
                  <div className='DropDonw'>
                    <Dropdown
                      value={filtroEstrela}
                      onChange={setFiltroEstrela}
                      options={[5, 4, 3, 2, 1]}
                      placeholder="Todas as avaliações"
                    />
                  </div>
                </div>

              </div>
            </div>

            {feedbacks.length === 0 && (
              <div className="no-reviews">
                <p>Este produto ainda não possui avaliações.</p>
              </div>
            )}

            {feedbacksFiltrados.length === 0 && filtroEstrela && (
              <div className="no-filtered-reviews">
                <p>Nenhuma avaliação encontrada com {filtroEstrela} estrela(s).</p>
              </div>
            )}

            <div className="review-list">
              {feedbacksFiltrados.slice(0, quantidadeExibida).map((fb) => (
                <div key={fb.id} className="review-item">
                  <div className="review-meta">
                    <div className="reviewer-info">
                      <img
                        src={fb.perfilUrl || "https://via.placeholder.com/40?text=U"}
                        alt={`${fb.nomeUsuario}`}
                        className="reviewer-avatar"
                      />
                      <span className="reviewer-name">{fb.nomeUsuario}</span>
                    </div>
                    <div className="review-rating">
                      <div className="review-date">
                        {new Date(fb.dataCriacao).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="review-content">
                    <h4 className="review-title">{fb.titulo}</h4>
                    <p className="review-text">{fb.comentario}</p>
                    <Estrelas nota={fb.nota} max={5} />
                    <span className="rating-value">{fb.nota.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>

            {quantidadeExibida < feedbacksFiltrados.length && (
              <button
                className="load-more-btn"
                onClick={() => setQuantidadeExibida(quantidadeExibida + 4)}
              >
                Carregar mais avaliações
              </button>
            )}

            <div className="add-review-form">
              <h3>Adicione sua avaliação</h3>

              <div className="form-group">
                <label>Sua Avaliação *</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FontAwesomeIcon
                      key={star}
                      icon={star <= novaNota ? faStarFull : faStarRegular}
                      onClick={() => setNovaNota(star)}
                      style={{ color: star <= novaNota ? "#f1d323ff" : "#ccc", cursor: "pointer" }}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Adicionar Título *</label>
                <input
                  type="text"
                  placeholder="Escreva um título aqui"
                  value={novoTitulo}
                  onChange={e => setNovoTitulo(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Detalhes da Avaliação *</label>
                <textarea
                  placeholder="Escreva aqui...  "
                  value={novoComentario}
                  onChange={e => setNovoComentario(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Foto/Video (Opcional)</label>
                <div className="upload-area">
                  <p>Arraste uma foto ou vídeo.</p>
                  <span className='add-img'><i class="fa-solid fa-images"></i></span>
                  <button className="browse-btn">Procurar</button>
                </div>
              </div>

              <button className="submit-review-btn" onClick={enviarFeedback}>
                Enviar Avaliação
              </button>
            </div>
          </div>
        );
    }
  }

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        // Busca produto pelo ID
        const resposta = await fetch(`https://artenza.onrender.com/Produto/${id}`);
        if (!resposta.ok) throw new Error("Produto não encontrado");
        const dados = await resposta.json();
        setProduto(dados);

        // Busca todos os produtos para mostrar relacionados
        const resTodos = await fetch("https://artenza.onrender.com/Produto");
        if (!resTodos.ok) throw new Error("Erro ao buscar produtos relacionados");
        const todos = await resTodos.json();

        // Embaralhar produtos para dar variedade
        const embaralhar = (array) => {
          return array
            .map(item => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);
        };

        // Filtra todos exceto o atual e garante urlImagens
        const relacionados = embaralhar(
          todos
            .filter(p => p.id !== dados.id)
            .map(p => ({
              ...p,
              urlImagens: Array.isArray(p.urlImagens) && p.urlImagens.length > 0 && typeof p.urlImagens[0] === "string"
                ? p.urlImagens
                : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
            }))
        ).slice(0, 8);

        setProdutosRelacionados(relacionados);

        // Carrega feedbacks do produto
        carregarFeedbacks(dados.id);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarProduto();
  }, [id]);

  useEffect(() => {
    // Pega dados do usuário do localStorage
    setIdUsuario(localStorage.getItem("idUsuario"));
    setNomeUsuario(localStorage.getItem("nomeUsuario") || "");
    setUrlUsuario(localStorage.getItem("perfilUrl") || "");
  }, []);

  const carregarFeedbacks = async (IdProduto) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/api/Feedback/produto/${IdProduto}`);
      if (!response.ok) throw new Error("Erro ao carregar feedbacks");
      const dados = await response.json();
      setFeedbacks(dados);

      if (dados.length > 0) {
        const media = dados.reduce((acc, f) => acc + f.nota, 0) / dados.length;
        setMediaNotas(media);
      } else {
        setMediaNotas(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const obterTamanhos = () => {
    if (!produto) return [];
    if (Array.isArray(produto.tamanhos)) return produto.tamanhos;
    if (typeof produto.tamanhos === 'string') {
      return produto.tamanhos.split(',').map(t => t.trim());
    }
    return [];
  };

  const feedbacksFiltrados = filtroEstrela
    ? feedbacks.filter(f => f.nota === filtroEstrela)
    : feedbacks;

  const adicionarAoCarrinho = async () => {
    if (!idUsuario) {
      alert("Você precisa estar logado.");
      return;
    }

    if (!tamanhoSelecionado) {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    const idProduto = produto.id;

    try {
      const resposta = await fetch("https://artenza.onrender.com/Carrinho");
      const todos = await resposta.json();

      const existente = todos.find(c =>
        c.idUsuario === idUsuario &&
        c.idProduto === idProduto &&
        c.tamanho === tamanhoSelecionado
      );

      if (existente) {
        const novaQuantidade = existente.quantidade + quantidade;

        await fetch(`https://artenza.onrender.com/Carrinho/${existente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario,
            idProduto,
            quantidade: novaQuantidade,
            tamanho: tamanhoSelecionado
          })
        });
      } else {
        await fetch("https://artenza.onrender.com/Carrinho", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario,
            idProduto,
            quantidade,
            tamanho: tamanhoSelecionado
          })
        });
      }

      alert(`Produto ${produto.nome} no tamanho ${tamanhoSelecionado} adicionado ao carrinho!`);
    } catch (err) {
      console.error("Erro ao adicionar:", err);
      alert("Erro ao adicionar ao carrinho.");
    }
  };

  const enviarFeedback = async () => {
    if (!nomeUsuario) {
      alert("Nome do usuário não encontrado. Faça login novamente.");
      return;
    }
    if (!novoTitulo) {
      alert("Informe um título para o feedback.");
      return;
    }
    if (!novoComentario) {
      alert("Informe um comentário para o feedback.");
      return;
    }
    if (novaNota < 1 || novaNota > 5) {
      alert("Informe uma nota entre 1 e 5.");
      return;
    }

    const feedback = {
      idProduto: produto.id,
      idUsuario: idUsuario,
      titulo: novoTitulo,
      comentario: novoComentario,
      nota: novaNota,
      nomeUsuario: nomeUsuario,
      dataCriacao: new Date().toISOString(),
      perfilUrl: urlUsuario
    };

    try {
      const response = await fetch("https://artenza.onrender.com/api/Feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) throw new Error("Erro ao enviar feedback");

      // Limpar inputs
      setNovoTitulo("");
      setNovoComentario("");
      setNovaNota(0);

      // Atualizar lista e média
      carregarFeedbacks(produto.id);
    } catch (error) {
      alert(error.message);
    }
  };

  const favoritarProduto = async (produtoId) => {
    if (!idUsuario) {
      alert("Você precisa estar logado para favoritar.");
      return;
    }

    try {
      // Se já está favoritado, remove
      if (favoritado) {
        // Buscar o ID do favorito para excluir
        const resposta = await fetch("https://artenza.onrender.com/Favorito");
        const favoritos = await resposta.json();

        const favoritoExistente = favoritos.find(
          fav => fav.usuarioId === idUsuario && fav.produtoId === produtoId
        );

        if (favoritoExistente) {
          await fetch(`https://artenza.onrender.com/Favorito/${favoritoExistente.id}`, {
            method: "DELETE",
          });

          setFavoritado(false);
          alert("Produto removido dos favoritos.");
        }
      } else {
        // Caso não esteja favoritado, adiciona
        const response = await fetch(`https://artenza.onrender.com/Favorito`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UsuarioId: idUsuario,
            ProdutoId: produtoId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error('Erro na API: ' + JSON.stringify(errorData));
        }

        setFavoritado(true);
        alert('Produto adicionado aos favoritos!');
      }
    } catch (erro) {
      console.error('Erro ao favoritar/desfavoritar produto:', erro);
      alert('Erro ao processar favorito.');
    }
  };

  useEffect(() => {
    const verificarFavorito = async () => {
      if (!idUsuario || !id) return;

      try {
        const resposta = await fetch(`https://artenza.onrender.com/Favorito`);
        const favoritos = await resposta.json();

        const jaFavoritado = favoritos.some(fav => fav.usuarioId === idUsuario && fav.produtoId === id);
        setFavoritado(jaFavoritado);
      } catch (error) {
        console.error("Erro ao verificar favorito:", error);
      }
    };

    verificarFavorito();
  }, [idUsuario, id]);


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
          <div className="produto-head">
            <h2 className="name-prod">{produto.nome}</h2>
            <button className='favoritar-btn' onClick={() => favoritarProduto(produto.id)}>
              <FontAwesomeIcon
                icon={favoritado ? faHeartSolid : faHeartRegular}
                style={{ color: favoritado ? 'red' : 'black' }}
              />
            </button>
          </div>

          <p className="tipo-prod">{produto.tipo}</p>

          <div className="media-avaliacoes">
            {feedbacks.length > 0 ? (
              <>
                <Estrelas nota={Math.round(mediaNotas)} />
                <span className='media-num'>{mediaNotas.toFixed(1)}</span>
              </>
            ) : (
              <p className="sem-avaliacoes">Sem avaliações</p>
            )}
          </div>

          <p className="preco">
            {produto.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <div className="descricao-div">
            <p className="descricao">{produto.descricao}</p>
            <a href="#descrição"><button onClick={() => setSelecao("descricao")}>ver-mais</button></a>
          </div>

          <div className="detalhes-produto">
            <h4 className="title-tamanho">Tamanhos disponíveis:</h4>
            <div className="filtro-tamanhos">
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

          <div className="quantidade-container">
            <div className="quantidade-div">
              <p className='title-qtd'>Quantidade:</p>
            </div>
            <div className="botoes-qtd" id='qtd-det'>
              <button
                onClick={() => setQuantidade(prev => Math.max(prev - 1, 1))}
                disabled={quantidade <= 1}>
                <span className='ind'>-</span>
              </button>
              <span className="numeros-span">{quantidade}</span>
              <button onClick={() => setQuantidade(prev => prev + 1)}>
                <span className='ind'>+</span>
              </button>
            </div>
          </div>

          <div className="acoes">
            <button className="btn adicionar-carrinho" onClick={adicionarAoCarrinho}>
              Adicionar ao Carrinho
            </button>
            <button className="btn comprar-agora" onClick={adicionarAoCarrinho}>
              Compre Agora
            </button>
          </div>

          <div className="links">
            <p>Compartilhar: <i className="fa-brands fa-whatsapp"></i> WhatsApp</p>
          </div>
        </div>
      </div>

      <div className="selecao-produtos">
        <ul className="items-prod">
          <li className={selecao === "descricao" ? "active" : ""}>
            <button className='btn-selecao' onClick={() => setSelecao("descricao")}>Descrição</button>
          </li>
          <li className={selecao === "tabela" ? "active" : ""}>
            <button className='btn-selecao' onClick={() => setSelecao("tabela")}>Informações Técnicas</button>
          </li>
          <li className={selecao === "feedback" ? "active" : ""}>
            <button className='btn-selecao' onClick={() => setSelecao("feedback")}>Feedbacks</button>
          </li>
        </ul>
      </div>

      <div className="conteudo-detalhe">
        {RenderConteudo()}
      </div>

      <div className="secoes-produtos">
        <SecaoProdutos titulo="Você também pode gostar" endpoint="https://artenza.onrender.com/Produto" />
      </div>
    </div>
  );
};

export default ProdutoDetalhe;
