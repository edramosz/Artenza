import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Masculino.css';
import SidebarFiltros from '../../Components/SidebarFiltros';
import SecaoProdutos from '../../Components/SecaoProdutos';
import Flag from '../../Components/Banner/Flag';

const Masculino = () => {
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagina, setPagina] = useState(Number(searchParams.get("page")) || 1);
  const [produtosPorPagina, setProdutosPorPagina] = useState(12);
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
        const resTodos = await fetch("https://localhost:7294/Produto");
        const todosData = await resTodos.json();
        const masculinos = todosData.filter(prod => ["Masculino", "Unissex"].includes(prod.genero));
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

  return (
    <>
      <Flag />
      <div className='masc-tudo'>
        <div className="conteiner-masc">
          <div className="masc-content">
            <h2 className="title-masc">Masculino</h2>
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

                <div className="masc-produtos">
                  {produtosFiltrados
                    .slice((pagina - 1) * produtosPorPagina, pagina * produtosPorPagina)
                    .map((prod) => (
                      <Link to={`/produto/${prod.id}`} key={prod.id}>
                        <div className="card-prods">
                          <img src={prod.urlImagens[0]} alt={prod.nome} onError={(e) => { e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"; }} />
                          <div className="text-card">
                            <p className="categoria">{prod.categoria}</p>
                            <h4 className="nome">{prod.nome}</h4>
                            <p className="preco">{prod.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>

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
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Masculino;
