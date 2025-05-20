import React, { useEffect, useState } from "react";
import "./Carrinho.css";

function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resUsuario = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);
        const usuario = await resUsuario.json();

        const resCarrinho = await fetch("https://localhost:7294/Carrinho");
        const carrinho = await resCarrinho.json();

        const carrinhoUsuario = carrinho.filter(item => item.idUsuario === usuario.id);
        setItensCarrinho(carrinhoUsuario);

        const resProdutos = await fetch("https://localhost:7294/Produto");
        const listaProdutos = await resProdutos.json();
        setProdutos(listaProdutos);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    carregarDados();
  }, [email]);

  const getProduto = (idProduto) =>
    produtos.find(p => p.id === idProduto) || {};

  const alterarQuantidade = async (item, novaQtd) => {
    if (novaQtd <= 0) return;

    await fetch(`https://localhost:7294/Carrinho/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idUsuario: item.idUsuario,
        idProduto: item.idProduto,
        quantidade: novaQtd
      })
    });

    setItensCarrinho(prev =>
      prev.map(i => (i.id === item.id ? { ...i, quantidade: novaQtd } : i))
    );
  };

  const removerItem = async (id) => {
    await fetch(`https://localhost:7294/Carrinho/${id}`, { method: "DELETE" });
    setItensCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const totalGeral = itensCarrinho.reduce((total, item) => {
    const produto = getProduto(item.idProduto);
    return total + (produto.preco || 0) * item.quantidade;
  }, 0);

  if (itensCarrinho.length === 0) return <p>Seu carrinho está vazio.</p>;

  return (
    <div className="carrinho-container">
      <div className="lista-carrinho">
        <h1>Meu Carrinho</h1>

        {itensCarrinho.map(item => {
          const produto = getProduto(item.idProduto);
          return (
            <div key={item.id} className="item-carrinho">
              <img className="img-item"
                src={
                  Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0 && produto.urlImagens[0] !== "string"
                    ? produto.urlImagens[2]
                    : "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"
                }
                alt={produto.nome}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                }}

              />
              <div className="atributos-carrinho">
                <div className="items-imp">
                  <p>{produto.nome}</p>
                  <p>Tipo: {produto.categoria}</p>
                </div>
                <div className="items-atributos">
                  <p>{produto.preco?.toFixed(2)}</p>
                </div >
                <div className="items-atributos">
                  <label>
                    Quantidade:
                    <input
                      type="number"
                      value={item.quantidade}
                      onChange={e => alterarQuantidade(item, parseInt(e.target.value))}
                      min={1}
                    />
                  </label>
                </div>
                <div className="items-atributos">
                  <p>{(produto.preco * item.quantidade).toFixed(2)}</p>
                </div>
                <button onClick={() => removerItem(item.id)}>Remover</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="resumo">
        <h1>Resumo</h1>
        <div className="items-count-carrinho">
          <p>Itens: 5</p>
        </div>
        <div className="frete">
          <h2>Frete:</h2>
          <select name="" id="">
            <option value="">Azure - 10,00</option>
            <option value="">Mounts - 30,00</option>
            <option value="">Nousy - 8,00</option>
          </select>
        </div>
        <div className="cupon">
          <h2>Digite seu cupon:</h2>
          <input type="text" />
        </div>
        <div className="total">
          <h3>Total da Compra: R$ {totalGeral.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default Carrinho;
