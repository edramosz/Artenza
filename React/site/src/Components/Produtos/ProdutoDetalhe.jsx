import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProdutoDetalhe.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFull } from '@fortawesome/free-solid-svg-icons';

import SecaoProdutos from '../../Components/SecaoProdutos';

const Estrelas = ({ nota, max = 5 }) => {
  const estrelas = [];
  for (let i = 1; i <= max; i++) {
    estrelas.push(
      <FontAwesomeIcon
        key={i}
        icon={faStarFull}
        style={{ color: i <= nota ? "#111" : "#ccc", marginRight: 2 }}
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
  const [quantidadeExibida, setQuantidadeExibida] = useState(3);

  const [filtroEstrela, setFiltroEstrela] = useState(null);


  // Feedbacks e avaliação
  const [feedbacks, setFeedbacks] = useState([]);
  const [mediaNotas, setMediaNotas] = useState(0);

  // Novos feedbacks
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoComentario, setNovoComentario] = useState("");
  const [novaNota, setNovaNota] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const buscarProduto = async () => {
      try {
        const resposta = await fetch(`https://localhost:7294/Produto/${id}`);
        if (!resposta.ok) throw new Error("Produto não encontrado");
        const dados = await resposta.json();
        setProduto(dados);

        // Buscar produtos relacionados 
        const resTodos = await fetch("https://localhost:7294/Produto");
        const todos = await resTodos.json();

        const embaralhar = (array) => {
          return array
            .map(item => ({ item, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ item }) => item);
        };

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

        // Após carregar produto, carregar feedbacks
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
    const idSalvo = localStorage.getItem("idUsuario");
    setIdUsuario(idSalvo);

    const nomeSalvo = localStorage.getItem("nomeUsuario") || "";
    setNomeUsuario(nomeSalvo);

    const urlSalva = localStorage.getItem("perfilUrl") || "";
    setUrlUsuario(urlSalva);

    console.log(localStorage.getItem("perfilUrl"));

  }, []);

  const carregarFeedbacks = async (idProduto) => {
    try {

      const response = await fetch(`https://localhost:7294/api/Feedback?idProduto=${idProduto}`);
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
      const resposta = await fetch("https://localhost:7294/Carrinho");
      const todos = await resposta.json();

      const existente = todos.find(c =>
        c.idUsuario === idUsuario &&
        c.idProduto === idProduto &&
        c.tamanho === tamanhoSelecionado // compara também o tamanho!
      );

      if (existente) {
        const novaQuantidade = existente.quantidade + 1;
        await fetch(`https://localhost:7294/Carrinho/${existente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario,
            idProduto,
            quantidade: novaQuantidade,
            tamanho: tamanhoSelecionado // envia tamanho no PUT também
          })
        });
      } else {
        await fetch("https://localhost:7294/Carrinho", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idUsuario,
            idProduto,
            quantidade: 1,
            tamanho: tamanhoSelecionado // envia tamanho no POST
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
      const response = await fetch("https://localhost:7294/api/Feedback", {
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
            <span className='heart'><FontAwesomeIcon icon={faHeart} /></span>
          </div>

          <p className="tipo-prod">{produto.tipo}</p>

          <div className="media-avaliacoes">
            <Estrelas nota={Math.round(mediaNotas)} />
            <span className='media-num'> {mediaNotas.toFixed(1)}</span>
          </div>

          <p className="preco">
            {produto.preco.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          <div className="descricao-div">
            <p className="descricao">{produto.descricao}</p>
            <a href="#descrição">ver-mais</a>
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
          <p className="descr">"{produto.descricao}"</p>
        </div>
        <div className="ficha-container">
          <h2 className="title-info">Informações Técnicas</h2>
          <table className="tabela-info">
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
                <td><span className='info-span'>Tipo:</span></td>
                <td>{produto.tipo}</td>
              </tr>
              <tr>
                <td><span className='info-span'>Marca:</span></td>
                <td>{produto.marca}</td>
              </tr>
              <tr>
                <td><span className='info-span'>Quantidade Vendida:</span></td>
                <td>{produto.quantidadeVendida}</td>
              </tr>
              <tr>
                <td><span className='info-span'>Data de Cadastro:</span></td>
                <td>{new Date(produto.dataCriacao).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="secoes-prodrudos">
        <SecaoProdutos
          titulo="Você também pode gostar"
          produtos={produtosRelacionados}
        />
      </div>

      <div className="feedback-container">
        <div className="filtro-estrelas">
          <div className="header-feedback">
            <div className="filtros-titles">
              <h3 className='title-feedback'>Avaliações do Produto</h3>
              <span className="media-nota">{mediaNotas.toFixed(1)} de 5.0 </span>
            </div>
            <div className="btns-filtros">
              <button
                onClick={() => setFiltroEstrela(null)}
                className={filtroEstrela === null ? 'ativo' : ''}
              >
                Tudo
              </button>
              {[5, 4, 3, 2, 1].map(nota => {
                const count = feedbacks.filter(f => f.nota === nota).length;
                return (
                  <button
                    key={nota}
                    onClick={() => setFiltroEstrela(nota)}
                    className={filtroEstrela === nota ? 'ativo' : ''}
                  >
                    {nota} Estrela{nota > 1 ? 's' : ''} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>



        {feedbacks.length === 0 && <p>Este produto ainda não possui avaliações.</p>}
        {feedbacksFiltrados.length === 0 && (
          <p>Nenhum feedback encontrado com {filtroEstrela} estrela(s).</p>
        )}


        <ul className="lista-feedbacks">
          {feedbacksFiltrados.slice(0, quantidadeExibida).map(fb => (
            <li key={fb.id} className="feedback-item">
              <div>
                <p><Estrelas nota={fb.nota} /> {fb.nota.toFixed(1)}</p>
              </div>
              <div className="feedback-header">
                <img
                  src={fb.perfilUrl || "https://via.placeholder.com/40?text=U"}
                  alt="Foto do usuário"
                  className="foto-perfil-feedback"
                />
                <p className='nome-feedback'>{fb.nomeUsuario}</p>
                <p className='data-feedback'>{new Date(fb.dataCriacao).toLocaleDateString()}</p>
              </div>
              <div>
                <p className='tile-feedback'>{fb.titulo}</p>
                <p className='comentario-feedback'>"{fb.comentario}"</p>
              </div>
            </li>
          ))}
        </ul>
        {quantidadeExibida < feedbacksFiltrados.length && (
          <button
            className="btn-carregar-mais"
            onClick={() => setQuantidadeExibida(quantidadeExibida + 3)}
          >
            Carregar-mais
          </button>
        )}



        <h4>Deixe sua avaliação</h4>
        <input
          type="text"
          placeholder="Título do feedback"
          value={novoTitulo}
          onChange={e => setNovoTitulo(e.target.value)}
        />
        <textarea
          placeholder="Comentário"
          value={novoComentario}
          onChange={e => setNovoComentario(e.target.value)}
        />
        <select value={novaNota} onChange={e => setNovaNota(Number(e.target.value))}>
          <option value={0}>Selecione a nota</option>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button onClick={enviarFeedback}>Enviar Avaliação</button>
      </div>
    </div>
  );
};

export default ProdutoDetalhe;
