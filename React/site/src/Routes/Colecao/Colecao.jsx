import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from 'react-router-dom';
import SidebarFiltros from '../../Components/SidebarFiltros';

const ListaProdutos = () => {
  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
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
    Bege: "#F5F5DC",
    Preto: "#000000",
  };

  const CoresDisponiveis = ["Amarelo", "Azul", "Bege", "Preto"];

  const ChecksList = [
    {
      title: 'Categorias',
      tipo: 'categorias',
      checksLists: ["Blusas", "Calças", "Tênis", "Camisas"]
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
          checksLists: ["26", "28", "30", "32", "34", "36"]
        }
      ]
    }
  ];

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

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("https://localhost:7294/Produto");
        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json();

        const dataComImagem = data.map(produto => ({
          ...produto,
          urlImagens: Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0
            ? produto.urlImagens
            : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
        }));

        setProdutos(dataComImagem);
      } catch (error) {
        setErro("Não foi possível carregar os produtos.");
        console.error("Erro:", error.message);
      }
    };

    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter(prod => {
    const categoriaOk = filtros.categorias.length === 0 || filtros.categorias.includes(prod.categoria);
    const subcategoriaOk = filtros.subcategorias.length === 0 || filtros.subcategorias.includes(prod.subcategoria);
    const tamanhoOk = filtros.tamanhos.length === 0 || prod.tamanhos?.some(t => filtros.tamanhos.includes(t));
    const corOk = filtros.cores.length === 0 || filtros.cores.includes(capitalizeFirst(prod.cor));
    const precoOk = prod.preco >= filtros.preco[0] && prod.preco <= filtros.preco[1];
    return categoriaOk && subcategoriaOk && tamanhoOk && corOk && precoOk;
  });

  return (
    <div className="colecao-container">
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
          {erro && <p style={{ color: 'red' }}>{erro}</p>}

          <div className="masc-produtos">
            {produtosFiltrados.map((prod) => (
              <Link to={`/produto/${prod.id}`} key={prod.id}>
                <div className="card-prods">
                  <img
                    src={prod.urlImagens[0]}
                    alt={prod.nome}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                    }}
                  />
                  <div className="text-card">
                    <h4 className="nome">{prod.nome}</h4>
                    <p className="categoria">{prod.categoria}</p>
                    <p className="preco">
                      {prod.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListaProdutos;
