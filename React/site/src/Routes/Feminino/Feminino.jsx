import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import SidebarFiltros from '../../Components/SidebarFiltros';
import SecaoProdutos from '../../Components/SecaoProdutos';
import Flag from '../../Components/Banner/Flag';
import ConteudoGenero from '../../Components/ConteudoGenero';

const Feminino = () => {
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [produtos, setProdutos] = useState([]);
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState([]);
  const [produtosLancamentos, setProdutosLancamentos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [produtosVisiveis, setProdutosVisiveis] = useState(12);
  const [idUsuario, setIdUsuario] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagina, setPagina] = useState(Number(searchParams.get("page")) || 1);
  const [filtros, setFiltros] = useState({
    categorias: [],
    subcategorias: [],
    tamanhos: [],
    cores: [],
    preco: [0, 2600],
  });

  const mapaCores = {
    Amarelo: "#FFD700",
    Azul: "#0000FF",
    Branco: "#FFFFFF",
    Cinza: "#808080",
    Laranja: "#FFA500",
    Marrom: "#A52A2A",
    Preto: "#000000",
    Rosa: "#FFC0CB",
    Roxo: "#800080",
    Verde: "#008000",
    Vermelho: "#FF0000"
  };

  const CoresDisponiveis = ["Amarelo", "Azul", "Branco", "Cinza", "Laranja", "Marrom", "Preto", "Rosa", "Roxo", "Verde", "Vermelho"];

  const ChecksList = [
    {
      title: 'Categorias',
      tipo: 'categorias',
      checksLists: ["Blusas", "Calças", "Tênnis", "Camisas", "Meias"]
    },
    {
      title: 'Sub-Categorias',
      tipo: 'subcategorias',
      checksLists: ["Casual", "Esportivo", "Social"]
    },
    {
      title: 'Tamanhos',
      tipo: 'tamanhos',
      categoriaTamanho: [
        {
          tipo: 'Roupas',
          checksLists: ["PP", "P", "M", "G", "GG"]
        },
        {
          tipo: 'Calçados',
          checksLists: ["34", "35", "36", "38", "40", "42", "44", "46", "47", "48"]
        }
      ]
    },
  ];

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      try {
        const resTodos = await fetch("https://artenza.onrender.com/Produto");
        const todosData = await resTodos.json();
        const femininos = todosData.filter(prod => ["Feminino", "Unissex"].includes(prod.genero));

        const formatar = (lista) => lista.map(prod => ({
          ...prod,
          urlImagens: Array.isArray(prod.urlImagens) && prod.urlImagens.length > 0 && typeof prod.urlImagens[0] === "string"
            ? prod.urlImagens
            : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
        }));

        setProdutos(formatar(femininos));

        const resMaisVendidos = await fetch("https://artenza.onrender.com/mais-vendidos");
        const dataMaisVendidos = await resMaisVendidos.json();
        setProdutosMaisVendidos(formatar(dataMaisVendidos.filter(p => ["Feminino", "Unissex"].includes(p.genero))));

        const resLancamentos = await fetch("https://artenza.onrender.com/Produto/lancamentos");
        const dataLancamentos = await resLancamentos.json();
        setProdutosLancamentos(formatar(dataLancamentos.filter(p => ["Feminino", "Unissex"].includes(p.genero))));

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
      if (tipo === 'preco') {
        return { ...prev, preco: [0, 2600] };
      }
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

 

  return (
    <>
      <Flag genero="feminino" />
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
            {loading ? (
              <div className="carregando"><h3>Carregando...</h3></div>
            ) : erro ? (
              <div className="erro"><h3>{erro}</h3></div>
            ) : (
              <>
                <div className="masc-produtos">
                  {produtosFiltrados.map((prod) => (
                    <Link to={`/produto/${prod.id}`} key={prod.id}>
                      <div className="card-prods">
                        <img src={prod.urlImagens[0]} alt={prod.nome} onError={(e) => { e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"; }} />
                        <div className="text-card">
                          <h4 className="nome">{prod.nome}</h4>
                          <p className="categoria">{prod.categoria}</p>
                          <p className="preco">{prod.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {produtosFiltrados.length > produtosVisiveis && (
                  <div className='carregar-mais'>
                    <button onClick={() => {
                      setPagina(prev => prev + 1);
                      setProdutosVisiveis(prev => prev + 12);
                    }} className="carregar-mais-btn">
                      Carregar mais
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        <div className='secoes-prods'>
          <SecaoProdutos
            titulo="Mais Vendidos"
            produtos={produtosMaisVendidos}
          />

          <SecaoProdutos
            titulo="Novidades"
            produtos={produtosLancamentos}
          />
        </div>

        <ConteudoGenero />
      </div>
    </>
  );
};

export default Feminino;
