import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SidebarFiltros from '../../Components/SidebarFiltros';
import SecaoProdutos from '../../Components/SecaoProdutos';
import Flag from '../../Components/Banner/Flag';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFull, faHeart as faHeartSolid, faCartPlus, faBagShopping } from '@fortawesome/free-solid-svg-icons';

const Colecao = () => {
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagina, setPagina] = useState(Number(searchParams.get("page")) || 1);
  const [produtosPorPagina, setProdutosPorPagina] = useState(12);
  const [mostrarTamanhosId, setMostrarTamanhosId] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [mensagem, setMensagem] = useState("");


  const [filtros, setFiltros] = useState({
    categorias: [],
    subcategorias: [],
    tamanhos: [],
    cores: [],
    preco: [0, 2600],
  });

  const mapaCores = {
    Amarelo: "#FFD700", Azul: "#0000FF", Branco: "#FFFFFF",
    Cinza: "#808080", Laranja: "#FFA500", Marrom: "#A52A2A",
    Preto: "#000000", Rosa: "#FFC0CB", Roxo: "#800080",
    Verde: "#008000", Vermelho: "#FF0000"
  };

  const CoresDisponiveis = Object.keys(mapaCores);

  const ChecksList = [
    {
      title: 'Categorias', tipo: 'categorias',
      checksLists: ["Blusas", "Calças", "Tênnis", "Camisas", "Meias"]
    },
    {
      title: 'Sub-Categorias', tipo: 'subcategorias',
      checksLists: ["Casual", "Esportivo", "Social"]
    },
    {
      title: 'Tamanhos', tipo: 'tamanhos',
      categoriaTamanho: [
        { tipo: 'Roupas', checksLists: ["PP", "P", "M", "G", "GG"] },
        { tipo: 'Calçados', checksLists: ["34", "35", "36", "38", "40", "42", "44", "46", "47", "48"] }
      ]
    }
  ];




  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        // TODOS OS PRODUTOS
        const resTodos = await fetch("https://artenza.onrender.com/Produto");
        console.log(resTodos)
        const todosData = await resTodos.json();
        const masculinos = todosData.filter(prod => ["Masculino", "Unissex", "Feminino"].includes(prod.genero));
        const formatar = (lista) => lista.map(prod => ({
          ...prod,
          urlImagens: Array.isArray(prod.urlImagens) && prod.urlImagens.length > 0 && typeof prod.urlImagens[0] === "string"
            ? prod.urlImagens
            : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
        }));
        setProdutos(formatar(masculinos));



        setErro(null);

      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setErro("Erro ao carregar produtos.");
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    buscarDados();

    const id = localStorage.getItem("idUsuario");

    setIdUsuario(id);

    const precoURL = searchParams.get('preco')?.split('-').map(Number);
    const filtrosIniciais = {
      categorias: searchParams.get('categoria')?.split(',') || [],
      subcategorias: searchParams.get('subcategoria')?.split(',') || [],
      tamanhos: searchParams.get('tamanho')?.split(',') || [],
      cores: searchParams.get('cor')?.split(',') || [],
      preco: precoURL && precoURL.length === 2 ? precoURL : [0, 2600],
    };
    setFiltros(filtrosIniciais);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagina.toString());
    setSearchParams(params);
  }, [pagina]);

  const handleCheckboxChange = (tipo, valor) => {
    setFiltros(prev => {
      const atual = prev[tipo];
      const atualizado = atual.includes(valor) ? atual.filter(i => i !== valor) : [...atual, valor];
      return { ...prev, [tipo]: atualizado };
    });
  };

  const handlePrecoChange = (event, index) => {
    const novoValor = parseFloat(event.target.value);
    setFiltros(prev => {
      const novoPreco = [...prev.preco];
      if (index === 0) {
        novoPreco[0] = Math.min(novoValor, novoPreco[1]);
      } else {
        novoPreco[1] = Math.max(novoValor, novoPreco[0]);
      }
      return { ...prev, preco: novoPreco };
    });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filtros.categorias.length > 0) params.set('categoria', filtros.categorias.join(','));
    if (filtros.subcategorias.length > 0) params.set('subcategoria', filtros.subcategorias.join(','));
    if (filtros.tamanhos.length > 0) params.set('tamanho', filtros.tamanhos.join(','));
    if (filtros.cores.length > 0) params.set('cor', filtros.cores.join(','));
    if (filtros.preco) params.set('preco', `${filtros.preco[0]}-${filtros.preco[1]}`);
    setSearchParams(params);
  }, [filtros]);

  const limparFiltros = () => {
    setFiltros({
      categorias: [],
      subcategorias: [],
      tamanhos: [],
      cores: [],
      preco: [0, 2600],
    });
  };

  const removerFiltro = (tipo, valor) => {
    setFiltros(prev => {
      if (tipo === 'preco') return { ...prev, preco: [0, 2600] };
      const novoFiltro = prev[tipo].filter(item => item !== valor);
      return { ...prev, [tipo]: novoFiltro };
    });
  };

  const produtosFiltrados = produtos.filter(prod => {
    const categoriaOk = filtros.categorias.length === 0 || filtros.categorias.includes(prod.categoria);
    const subcategoriaOk = filtros.subcategorias.length === 0 || filtros.subcategorias.includes(prod.subcategoria);
    const tamanhoOk = filtros.tamanhos.length === 0 || prod.tamanhos?.some(t => filtros.tamanhos.includes(t));
    const corOk = filtros.cores.length === 0 || filtros.cores.includes(capitalizeFirst(prod.cor));
    const precoOk = prod.preco >= filtros.preco[0] && prod.preco <= filtros.preco[1];
    return categoriaOk && subcategoriaOk && tamanhoOk && corOk && precoOk;
  });

  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);

  const favoritarProduto = async (produtoId) => {
    if (!idUsuario) {
      exibirMensagem("Você precisa estar logado para favoritar.");
      return;
    }

    try {
      const jaFavoritado = favoritos.includes(produtoId);

      if (jaFavoritado) {
        const resposta = await fetch("https://artenza.onrender.com/Favorito");
        const favoritosAPI = await resposta.json();

        const favoritoExistente = favoritosAPI.find(
          fav => fav.usuarioId === idUsuario && fav.produtoId === produtoId
        );

        if (favoritoExistente) {
          await fetch(`https://artenza.onrender.com/Favorito/${favoritoExistente.id}`, {
            method: "DELETE",
          });

          setFavoritos(prev => prev.filter(id => id !== produtoId));
          exibirMensagem("Produto removido dos favoritos.");
        }
      } else {
        const response = await fetch(`https://artenza.onrender.com/Favorito`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            UsuarioId: idUsuario,
            ProdutoId: produtoId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error('Erro na API: ' + JSON.stringify(errorData));
        }

        setFavoritos(prev => [...prev, produtoId]);
        exibirMensagem('Produto adicionado aos favoritos!');
      }
    } catch (erro) {
      console.error('Erro ao favoritar/desfavoritar produto:', erro);
      exibirMensagem('Erro ao processar favorito.');
    }
  };


  useEffect(() => {
    const verificarFavoritos = async () => {
      if (!idUsuario) return;

      try {
        const resposta = await fetch(`https://artenza.onrender.com/Favorito`);
        const favoritosAPI = await resposta.json();

        const idsFavoritados = favoritosAPI
          .filter(fav => fav.usuarioId === idUsuario)
          .map(fav => fav.produtoId);

        setFavoritos(idsFavoritados);
      } catch (error) {
        console.error("Erro ao verificar favoritos:", error);
      }
    };

    verificarFavoritos();
  }, [idUsuario]);

  const exibirMensagem = (texto) => {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 3000);
  };



  const adicionarAoCarrinho = async (idProduto, tamanhoSelecionado) => {
    if (!idUsuario) {
      exibirMensagem("Você precisa estar logado.");
      return;
    }

    try {
      const resposta = await fetch("https://artenza.onrender.com/Carrinho");
      const todos = await resposta.json();

      const existente = todos.find(c =>
        c.idUsuario === idUsuario &&
        c.idProduto === idProduto &&
        c.tamanho === tamanhoSelecionado
      );

      if (existente) {
        const novaQuantidade = existente.quantidade + 1;

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
            quantidade: 1,
            tamanho: tamanhoSelecionado
          })
        });
      }

      exibirMensagem(`Produto adicionado ao carrinho (tamanho ${tamanhoSelecionado})`);
    } catch (err) {
      console.error("Erro ao adicionar:", err);
      exibirMensagem("Erro ao adicionar ao carrinho.");
    }
  };



  return (
    <>
      <Flag />
      <div className='masc-tudo'>
        <div className="conteiner-masc">
          <div className="masc-content">
            <h2 className="title-masc">Feminino</h2>
            <p>{produtosFiltrados.length} Resultado{produtosFiltrados.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="flex-conteiner">
          <SidebarFiltros
            filtros={filtros}
            setFiltros={setFiltros}
            ChecksList={ChecksList}
            CoresDisponiveis={CoresDisponiveis}
            mapaCores={mapaCores}
            handleCheckboxChange={handleCheckboxChange}
            handlePrecoChange={handlePrecoChange}
            limparFiltros={limparFiltros}
            removerFiltro={removerFiltro}
          />

          <main className="content">
            {mensagem && <p className="mensagem-topo">{mensagem}</p>}
            {loading ? (
              <div className="carregando"><h3>Carregando...</h3></div>
            ) : erro ? (
              <div className="erro"><h3>{erro}</h3></div>
            ) : (
              <>
                {/* <div className="controle-pagina">
                  <label htmlFor="qtd">Produtos por página:</label>
                  <select
                    id="qtd"
                    value={produtosPorPagina}
                    onChange={(e) => {
                      setProdutosPorPagina(Number(e.target.value));
                      setPagina(1);
                    }}
                  >
                    <option value={3}>3</option> 
                    <option value={6}>6</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div> */}

                {produtosFiltrados.length === 0 ? (
                  <p className="nenhum-resultado masc-nenhum-resultado">Nenhum produto encontrado com os filtros aplicados.</p>
                ) : (
                  <div className="masc-produtos">

                    {produtosFiltrados
                      .slice((pagina - 1) * produtosPorPagina, pagina * produtosPorPagina)
                      .map((prod) => {

                        return (
                          <div className="card-prods" key={prod.id}>
                            <Link to={`/produto/${prod.id}`}>
                              <img
                                src={prod.urlImagens[0]}
                                alt={prod.nome}
                                onError={(e) => {
                                  e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                                }}
                              />
                            </Link>

                            <div
                              className="btn-carrinho-wrapper"
                            >
                              {mostrarTamanhosId === prod.id ? (
                                <div className="tamanhos-disponiveis">
                                  {prod.tamanhos?.map((t, i) => (
                                    <button
                                      key={i}
                                      className="btn-tamanho"
                                      onClick={() => {
                                        adicionarAoCarrinho(prod.id, t);
                                        setMostrarTamanhosId(null); // esconde após clique
                                      }}
                                    >
                                      {t}
                                    </button>
                                  ))}
                                  <button onClick={() => setMostrarTamanhosId(false)} className='cancelar-tamanho'><i className="fa-solid fa-xmark"></i></button>
                                </div>
                              ) : (
                                <button
                                  className="add-carr"
                                  onClick={() =>
                                    setMostrarTamanhosId(mostrarTamanhosId === prod.id ? null : prod.id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faBagShopping} />
                                  <span className="texto-hover">Adicionar ao Carrinho</span>
                                </button>


                              )}
                            </div>
                            <div className="text-card">
                              <div className="head-prod">
                                <p className="categoria">{prod.categoria}</p>
                                <button
                                  className='favoritar-btn'
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    favoritarProduto(prod.id);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={favoritos.includes(prod.id) ? faHeartSolid : faHeartRegular}
                                    style={{ color: favoritos.includes(prod.id) ? 'red' : 'black' }}
                                  />
                                </button>
                              </div>

                              <Link to={`/produto/${prod.id}`}>
                                <h4 className="nome">{prod.nome}</h4>
                                <p className="preco">
                                  {prod.preco.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </p>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                )}


                {produtosFiltrados.length > 0 && (
                  <div className="paginacao">
                    <button
                      onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                      disabled={pagina === 1}
                      className="seta"
                    >
                      <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {Array.from({ length: totalPaginas }, (_, i) => (
                      <button
                        id='page'
                        key={i}
                        className={pagina === i + 1 ? 'pagina-ativa' : ''}
                        onClick={() => setPagina(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
                      disabled={pagina === totalPaginas}
                      className="seta"
                    >
                      <i className="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                )}

              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Colecao;
