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

  if (itensCarrinho.length === 0) return <p>Seu carrinho está vazio.</p>;

  return (
    <div className="carrinho-container">
      <h2>Meu Carrinho</h2>
      <ul className="lista-carrinho">
        {itensCarrinho.map(item => {
          const produto = getProduto(item.idProduto);
          return (
            <li key={item.id} className="item-carrinho">
              <img src={produto.imagem} alt={produto.nome} style={{ width: 100, height: 100 }} />
              <div>
                <p><strong>{produto.nome}</strong></p>
                <p>Preço: R$ {produto.preco?.toFixed(2)}</p>
                <label>
                  Quantidade:
                  <input
                    type="number"
                    value={item.quantidade}
                    onChange={e => alterarQuantidade(item, parseInt(e.target.value))}
                    min={1}
                  />
                </label>
                <p>Total: R$ {(produto.preco * item.quantidade).toFixed(2)}</p>
                <button onClick={() => removerItem(item.id)}>Remover</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default  Carrinho;