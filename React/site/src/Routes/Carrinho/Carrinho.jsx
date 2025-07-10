import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Carrinho.css";

function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resUsuario = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);
        const usuario = await resUsuario.json();

        const resCarrinho = await fetch("https://localhost:7294/Carrinho");
        const carrinho = await resCarrinho.json();
        const carrinhoUsuario = carrinho.filter(item => item.idUsuario === usuario.id);
        setItensCarrinho(carrinhoUsuario);

        const estadoInicialSelecionados = {};
        carrinhoUsuario.forEach(item => {
          estadoInicialSelecionados[item.id] = false;
        });
        setSelecionados(estadoInicialSelecionados);

        const resProdutos = await fetch("https://localhost:7294/Produto");
        const listaProdutos = await resProdutos.json();
        setProdutos(listaProdutos);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [email]);

  useEffect(() => {
    const selecionadosIds = Object.entries(selecionados)
      .filter(([_, valor]) => valor)
      .map(([id]) => id);

    localStorage.setItem("itensSelecionados", JSON.stringify(selecionadosIds));
  }, [selecionados]);

  const getProduto = (idProduto) => produtos.find(p => p.id === idProduto) || {};

  const alterarQuantidade = async (item, novaQtd) => {
    const quantidadeFinal = parseInt(novaQtd);
    if (isNaN(quantidadeFinal) || quantidadeFinal <= 0) return;

    const payload = {
      idUsuario: item.idUsuario,
      idProduto: item.idProduto,
      quantidade: quantidadeFinal,
      tamanho: item.tamanho
    };

    try {
      const response = await fetch(`https://localhost:7294/Carrinho/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Erro na resposta do PUT:", await response.text());
        return;
      }

      setItensCarrinho(prevItens =>
        prevItens.map(i =>
          i.id === item.id ? { ...i, quantidade: quantidadeFinal } : i
        )
      );
    } catch (error) {
      console.error("Erro ao enviar PUT para carrinho:", error);
    }
  };

  const removerItem = async (id) => {
    await fetch(`https://localhost:7294/Carrinho/${id}`, { method: "DELETE" });
    setItensCarrinho(prev => prev.filter(item => item.id !== id));
    setSelecionados(prev => {
      const novoSelecionados = { ...prev };
      delete novoSelecionados[id];
      return novoSelecionados;
    });
  };

  const toggleSelecionado = (id) => {
    setSelecionados(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFinalizarPedido = () => {
    const selecionadosIds = Object.values(selecionados).filter(Boolean);
    if (selecionadosIds.length === 0) {
      alert("Você precisa selecionar pelo menos um item para continuar.");
      return;
    }

    navigate("/FinalizarPedido");
  };

  const totalSelecionado = itensCarrinho.reduce((total, item) => {
    if (!selecionados[item.id]) return total;
    const produto = getProduto(item.idProduto);
    return total + (produto.preco || 0) * item.quantidade;
  }, 0);

  if (isLoading) {
    return <div className="loading">Carregando carrinho...</div>;
  }

  if (itensCarrinho.length === 0) {
    return (
      <div className="carrinho-null">
        <h2 className="title-null">Carrinho</h2>
        <p className="text-null">Seu carrinho está vazio <i className="fa-solid fa-circle-exclamation"></i></p>
        <span><i className="fa-solid fa-cart-shopping"></i></span>
        <div className="btns-null">
          <Link to="/"><button>Ver Produtos</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="carrinho-container">
      <div className="lista-carrinho">
        <h1>Meu Carrinho</h1>

        <table className="tabela-carrinho">
          <thead>
            <tr className="sb">
              <th></th>
              <th>Imagem</th>
              <th>Produto</th>
              <th>Tamanho</th>
              <th>Preço</th>
              <th>Qtd</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {itensCarrinho.map(item => {
              const produto = getProduto(item.idProduto);
              return (
                <tr key={item.id}>
                  <td><input type="checkbox" checked={selecionados[item.id] || false} onChange={() => toggleSelecionado(item.id)} /></td>
                  <td>
                    <Link to={`/produto/${produto.id}`}>
                      <img
                        className="img-item"
                        src={Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0 && produto.urlImagens[0] !== "string"
                          ? produto.urlImagens[0]
                          : "https://placeholde.co/300x200.png?text=Produto+sem+imagem"}
                        alt={produto.nome}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placeholde.co/300x200.png?text=Produto+sem+imagem";
                        }}
                      />
                    </Link>
                  </td>
                  <td className="nomes-prods">
                    <Link to={`/produto/${produto.id}`} className="link-produto">
                      <p className="nome">{produto.nome}</p>
                      <p className="tipo">{produto.tipo}</p>
                    </Link>
                  </td>
                  <td><p className="tamanho">{item.tamanho}</p></td>
                  <td><p className="_preco">R$ {produto.preco?.toFixed(2)}</p></td>
                  <td>
                    <div className="botoes-qtd">
                      <button onClick={() => alterarQuantidade(item, item.quantidade ? item.quantidade - 1 : 1)} disabled={!item.quantidade || item.quantidade <= 1}>-</button>
                      <span className="numeros-span">{item.quantidade ?? 1}</span>
                      <button onClick={() => alterarQuantidade(item, (item.quantidade || 1) + 1)}>+</button>
                    </div>
                  </td>
                  <td><p className="_preco">R$ {(produto.preco * item.quantidade).toFixed(2)}</p></td>
                  <td><button onClick={() => removerItem(item.id)} className="remove-btn"><i className="fa-solid fa-xmark"></i></button></td>
                </tr>

              );
            })}
          </tbody>
        </table>
      </div>

      <div className="resumo">
        <h1>Resumo</h1>
        <div className="items-count-carrinho">
          <p>Itens selecionados: {Object.values(selecionados).filter(Boolean).length}</p>
        </div>
        <div className="frete">
          <h2>Frete:</h2>
          <select>
            <option value="">Azure - 10,00</option>
            <option value="">Mounts - 30,00</option>
            <option value="">Nousy - 8,00</option>
          </select>
        </div>
        <div className="cupon">
          <h2>Digite seu cupom:</h2>
          <input type="text" />
        </div>
        <div className="total">
          <h3>Total da Compra: R$ {totalSelecionado.toFixed(2)}</h3>
        </div>
        <div className="btn-compra">
          <button onClick={handleFinalizarPedido} className="botao-comprar">Comprar</button>
        </div>
      </div>
    </div>
  );
}

export default Carrinho;
