import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Carrinho.css";

function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const abrirModalTamanho = (item) => {
    setItemSelecionado(item);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setItemSelecionado(null);
  };

  const salvarTamanho = async (novoTamanho) => {
    if (!itemSelecionado) return;

    const payload = {
      idUsuario: itemSelecionado.idUsuario,
      idProduto: itemSelecionado.idProduto,
      quantidade: itemSelecionado.quantidade,
      tamanho: novoTamanho
    };

    await fetch(`https://artenza.onrender.com/Carrinho/${itemSelecionado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setItensCarrinho(prev =>
      prev.map(i => i.id === itemSelecionado.id ? { ...i, tamanho: novoTamanho } : i)
    );

    fecharModal();
  };


  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resUsuario = await fetch(`https://artenza.onrender.com/Usuario/por-email/${email}`);
        const usuario = await resUsuario.json();

        const resCarrinho = await fetch("https://artenza.onrender.com/Carrinho");
        const carrinho = await resCarrinho.json();
        const carrinhoUsuario = carrinho.filter(item => item.idUsuario === usuario.id);
        setItensCarrinho(carrinhoUsuario);

        const estadoInicialSelecionados = {};
        carrinhoUsuario.forEach(item => {
          estadoInicialSelecionados[item.id] = false;
        });
        setSelecionados(estadoInicialSelecionados);

        const resProdutos = await fetch("https://artenza.onrender.com/Produto");
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
      const response = await fetch(`https://artenza.onrender.com/Carrinho/${item.id}`, {
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
    await fetch(`https://artenza.onrender.com/Carrinho/${id}`, { method: "DELETE" });
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
      setMensagemErro("Você precisa selecionar pelo menos um item para continuar.");

      setTimeout(() => {
        setMensagemErro("");
      }, 3000);

      return;
    }

    setMensagemErro("");
    navigate("/FinalizarPedido");
  };


  const totalSelecionado = itensCarrinho.reduce((total, item) => {
    if (!selecionados[item.id]) return total;
    const produto = getProduto(item.idProduto);
    return total + (produto.preco || 0) * item.quantidade;
  }, 0);

  const desmarcarTodos = () => {
    const novoSelecionados = {};
    Object.keys(selecionados).forEach(id => {
      novoSelecionados[id] = false;
    });
    setSelecionados(novoSelecionados);
  };


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
        <div className="top-carrinho">
          <label className="label-top-carr"></label>
          <h1>Meu Carrinho</h1>
        </div>

        <table className="tabela-carrinho">
          <thead>
            <tr className="cabecalho-table">
              <th></th>
              <th>Produtos</th>
              <th></th>
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
                  <td><input type="checkbox" className="check-btn" checked={selecionados[item.id] || false} onChange={() => toggleSelecionado(item.id)} /></td>
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
                  <td>
                    <div className="tamanho-coluna">
                      <p className="tamanho">{item.tamanho}</p>
                      <button onClick={() => abrirModalTamanho(item)}><i class="fa-solid fa-chevron-down"></i></button>
                    </div>
                  </td>
                  <td><p className="_preco">R$ {produto.preco?.toFixed(2)}</p></td>
                  <td>
                    <div className="botoes-qtd">
                      <button onClick={() => alterarQuantidade(item, item.quantidade ? item.quantidade - 1 : 1)} disabled={!item.quantidade || item.quantidade <= 1}>-</button>
                      <span className="numeros-span">{item.quantidade ?? 1}</span>
                      <button onClick={() => alterarQuantidade(item, (item.quantidade || 1) + 1)}>+</button>
                    </div>
                  </td>
                  <td><p className="_preco">R$ {(produto.preco * item.quantidade).toFixed(2)}</p></td>
                  <td><button onClick={() => removerItem(item.id)} className="remove-btn"><i className="fa-solid fa-trash"></i></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="conteiner-resumo">
        <div className="resumo">
          <div className="top-carrinho">
            <h1>Resumo do Pedido</h1>
            <label className="label-top-carr" style={{ backgroundColor: "#fff" }}></label>
          </div>
          <div className="items-count-carrinho">
            <p>Itens selecionados: {Object.values(selecionados).filter(Boolean).length}</p>
            <p>R$ {totalSelecionado.toFixed(2)}</p>
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
            <form className="cupom-form">
              <input type="text" placeholder="Ex: TESTE2" />
              <button className="aplicar-cupom-btn">Aplicar</button>
            </form>
          </div>
          <div className="total">
            <h3>Total da Compra: <span>R$ {totalSelecionado.toFixed(2)}</span></h3>
          </div>
          <div className="btn-compra">
            {mensagemErro && <p className="erro-carrinho"><i class="fa-solid fa-circle-exclamation"></i> {mensagemErro}</p>}
            <button onClick={handleFinalizarPedido} className="botao-comprar">Comprar</button>
          </div>

          {Object.values(selecionados).some(valor => valor) && (
            <div className="desmarcar">
              <button onClick={desmarcarTodos}>Desmarcar tudo</button>
            </div>
          )}
        </div>
      </div>
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="tamanho-title">Selecione o tamanho:</h3>
            {getProduto(itemSelecionado.idProduto)?.tamanhos?.map(tam => (
              <button key={tam} className="btn-tamanho-alteracao" onClick={() => salvarTamanho(tam)}>
                {tam}
              </button>
            ))}
            <button className="cancelar-btn" onClick={fecharModal}><i className="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Carrinho;
