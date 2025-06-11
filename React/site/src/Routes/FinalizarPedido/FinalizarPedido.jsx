import React, { useEffect, useState } from "react";
import "./FinalizarPedido.css";

function FinalizarPedido() {
  const [usuario, setUsuario] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resUsuario = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);
        setEndereco(usuarioData.endereco); // ou `usuarioData.enderecos[0]` se for array

        const resProdutos = await fetch("https://localhost:7294/Produto");
        const listaProdutos = await resProdutos.json();
        setProdutos(listaProdutos);

        const resCarrinho = await fetch("https://localhost:7294/Carrinho");
        const listaCarrinho = await resCarrinho.json();
        const itensDoUsuario = listaCarrinho.filter(item => item.idUsuario === usuarioData.id && item.selecionado); // "selecionado" precisa existir
        setItensSelecionados(itensDoUsuario);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, [email]);

  const getProduto = (idProduto) => produtos.find(p => p.id === idProduto) || {};

  const total = itensSelecionados.reduce((acc, item) => {
    const produto = getProduto(item.idProduto);
    return acc + (produto.preco || 0) * item.quantidade;
  }, 0);

  const finalizarPedido = async () => {
    const pedido = {
      idUsuario: usuario.id,
      data: new Date().toISOString(),
      itens: itensSelecionados.map(item => ({
        idProduto: item.idProduto,
        quantidade: item.quantidade
      }))
    };

    try {
      const res = await fetch("https://localhost:7294/Pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      });

      if (res.ok) {
        alert("Pedido realizado com sucesso!");
        // Redirecionar para página de sucesso
        window.location.href = "/pedido-sucesso";
      } else {
        alert("Erro ao finalizar pedido.");
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro ao finalizar pedido.");
    }
  };

  return (
    <div className="finalizar-container">
      <h1>Finalizar Pedido</h1>

      {usuario && endereco && (
        <div className="endereco">
          <h2>Endereço de Entrega</h2>
          <p><strong>Rua:</strong> {endereco.rua}</p>
          <p><strong>Número:</strong> {endereco.numero}</p>
          <p><strong>Bairro:</strong> {endereco.bairro}</p>
          <p><strong>Cidade:</strong> {endereco.cidade}</p>
          <p><strong>CEP:</strong> {endereco.cep}</p>
        </div>
      )}

      <div className="itens-pedido">
        <h2>Itens Selecionados</h2>
        {itensSelecionados.map(item => {
          const produto = getProduto(item.idProduto);
          return (
            <div key={item.id} className="item">
              <img
                src={
                  Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0
                    ? produto.urlImagens[0]
                    : "https://placeholde.co/300x200.png?text=Sem+Imagem"
                }
                alt={produto.nome}
              />
              <div>
                <p><strong>{produto.nome}</strong></p>
                <p>Quantidade: {item.quantidade}</p>
                <p>Preço unitário: R$ {produto.preco?.toFixed(2)}</p>
                <p>Subtotal: R$ {(produto.preco * item.quantidade).toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="resumo-final">
        <h2>Total: R$ {total.toFixed(2)}</h2>
        <button onClick={finalizarPedido}>Finalizar Pedido</button>
      </div>
    </div>
  );
}

export default FinalizarPedido;
