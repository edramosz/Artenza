import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SidebarFiltros from "./SidebarFiltros";
import './Busca.css';

const Busca = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState(null);

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

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const termo = queryParams.get("termo") || "";
    setSearchTerm(termo);

    if (termo.trim()) {
      fetch(`https://artenza.onrender.com/Produto/search?termo=${encodeURIComponent(termo)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar produtos");
          return res.json();
        })
        .then((data) => {
          setProdutos(data);
          setErro(null);
        })
        .catch((err) => {
          setErro(err.message);
          setProdutos([]);
        });
    } else {
      setProdutos([]);
      setErro(null);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      navigate(`/busca?termo=${encodeURIComponent(trimmedTerm)}`);
    }
  };

  const handleCheckboxChange = (tipo, valor) => {
    setFiltros(prev => {
      const atual = prev[tipo];
      const atualizado = atual.includes(valor)
        ? atual.filter(i => i !== valor)
        : [...atual, valor];
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

  // 🔥 APLICAÇÃO DOS FILTROS
  const produtosFiltrados = produtos.filter(prod => {
    const categoriaOk = filtros.categorias.length === 0 || filtros.categorias.includes(prod.categoria);
    const subcategoriaOk = filtros.subcategorias.length === 0 || filtros.subcategorias.includes(prod.subcategoria);
    const tamanhoOk = filtros.tamanhos.length === 0 || prod.tamanhos?.some(t => filtros.tamanhos.includes(t));
    const corOk = filtros.cores.length === 0 || filtros.cores.includes(capitalizeFirst(prod.cor));
    const precoOk = prod.preco >= filtros.preco[0] && prod.preco <= filtros.preco[1];
    return categoriaOk && subcategoriaOk && tamanhoOk && corOk && precoOk;
  });

  return (
    <div className="pagina-busca">
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
          <h2 className="titulo-busca">
            Resultado da busca por <span className="termo">"{searchTerm}"</span>
          </h2>

          {erro && <p className="erro-busca">Erro: {erro}</p>}

          {!erro && produtosFiltrados.length === 0 && searchTerm.trim() !== "" && (
            <p className="nenhum-resultado">Nenhum produto encontrado com os filtros aplicados.</p>
          )}

          <div className="masc-produtos">
            {produtosFiltrados.map((prod) => (
              <Link to={`/produto/${prod.id}`} key={prod.id}>
                <div className="card-prods">
                  <img
                    src={prod.urlImagens[0]}
                    alt={prod.nome}
                    onError={(e) => {
                      e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                    }}
                  />
                  <div className="text-card">
                    <p className="categoria">{prod.categoria}</p>
                    <h4 className="nome">{prod.nome}</h4>
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

export default Busca;
