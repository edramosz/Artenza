import React, { useEffect, useState } from "react";
import "./FinalizarPedido.css";

function FinalizarPedido() {
  // Estados principais
  const [usuario, setUsuario] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const [metodoPagamento, setMetodoPagamento] = useState("credito");
  const [parcelamento, setParcelamento] = useState(1);

  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const email = localStorage.getItem("email");

  // Lista de cupons válidos
  const cuponsValidos = [
    { codigo: "desconto10", desconto: 0.10 },
    { codigo: "fretegratis", desconto: 0.15 },
    { codigo: "vip", desconto: 0.20 }
  ];

  // Carregamento dos dados ao abrir a página
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Usuário
        const resUsuario = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);

        // Endereço
        const resEndereco = await fetch(`https://localhost:7294/Endereco/${usuarioData.idEndereco}`);
        const enderecoData = await resEndereco.json();
        setEndereco(enderecoData);

        // Produtos e Carrinho
        const resProdutos = await fetch("https://localhost:7294/Produto");
        const listaProdutos = await resProdutos.json();
        setProdutos(listaProdutos);

        const resCarrinho = await fetch("https://localhost:7294/Carrinho");
        const listaCarrinho = await resCarrinho.json();

        const selecionadosIds = JSON.parse(localStorage.getItem("itensSelecionados") || "[]");
        const itensDoUsuario = listaCarrinho.filter(
          item => item.idUsuario === usuarioData.id && selecionadosIds.includes(item.id)
        );
        setItensSelecionados(itensDoUsuario);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, [email]);

  // Buscar um produto pelo ID
  const getProduto = (idProduto) => produtos.find(p => p.id === idProduto) || {};

  // Cálculo do total e com desconto
  const total = itensSelecionados.reduce((acc, item) => {
    const produto = getProduto(item.idProduto);
    return acc + (produto.preco || 0) * item.quantidade;
  }, 0);

  const totalComDesconto = total * (1 - desconto);

  // Validação do cupom digitado
  const validarCupom = () => {
    const cupomEncontrado = cuponsValidos.find(c => c.codigo.toLowerCase() === cupom.toLowerCase());
    if (cupomEncontrado) {
      setDesconto(cupomEncontrado.desconto);
      alert(`Cupom "${cupomEncontrado.codigo}" aplicado!`);
    } else {
      setDesconto(0);
      alert("Cupom inválido.");
    }
  };

  // Enviar pedido para a API
  const finalizarPedido = async () => {
    if (enviando) return;
    if (!usuario || !endereco || itensSelecionados.length === 0) {
      alert("Dados incompletos.");
      return;
    }

    setEnviando(true);

    const produtosVenda = itensSelecionados.map(item => {
      const produto = getProduto(item.idProduto);
      return {
        produtoId: item.idProduto,
        quantidade: item.quantidade,
        precoUnitario: produto.preco
      };
    });

    const venda = {
      usuarioId: usuario.id,
      enderecoId: endereco.id,
      dataVenda: new Date().toISOString(),
      valorTotal: totalComDesconto,
      produtos: produtosVenda
    };

    try {
      // Envia a venda
      const res = await fetch("https://localhost:7294/Venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda)
      });

      if (!res.ok) throw new Error("Erro ao registrar venda");

      const vendaCriada = await res.json();

      // Envia transação (pagamento)
      const transacao = {
        vendaId: vendaCriada.id,
        data: new Date().toISOString(),
        parcelamento: metodoPagamento === "credito" ? parcelamento : 1,
        metodoPagamento
      };

      const resTransacao = await fetch("https://localhost:7294/Transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transacao)
      });

      if (resTransacao.ok) {
        // Limpa o carrinho do backend
        await Promise.all(
          itensSelecionados.map(item =>
            fetch(`https://localhost:7294/Carrinho/${item.id}`, {
              method: "DELETE"
            })
          )
        );

        alert("Pedido realizado com sucesso!");
        localStorage.removeItem("itensSelecionados");
        window.location.href = "/pedido-sucesso";
      } else {
        alert("Erro ao registrar transação.");
      }

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao finalizar pedido.");
    } finally {
      setEnviando(false);
    }
  };

  if (!usuario || !endereco || produtos.length === 0) {
    return <p>Carregando informações do pedido...</p>;
  }

  // Interface
  return (
    <div className="finalizar-container">
      <h1>Finalizar Pedido</h1>

      {/* Endereço */}
      <div className="endereco">
        <h2>Endereço de Entrega</h2>
        <p><strong>Rua:</strong> {endereco.rua}</p>
        <p><strong>Número:</strong> {endereco.numero}</p>
        <p><strong>Bairro:</strong> {endereco.bairro}</p>
        <p><strong>Cidade:</strong> {endereco.cidade}</p>
        <p><strong>CEP:</strong> {endereco.cep}</p>
      </div>

      {/* Itens do pedido */}
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
                    : "https://placehold.co/300x200.png?text=Sem+Imagem"
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

      {/* Pagamento */}
      <div className="pagamento">
        <h2>Forma de Pagamento</h2>

        <label>
          <input
            type="radio"
            value="credito"
            checked={metodoPagamento === "credito"}
            onChange={(e) => setMetodoPagamento(e.target.value)}
          />
          Cartão de Crédito
        </label>

        <label>
          <input
            type="radio"
            value="debito"
            checked={metodoPagamento === "debito"}
            onChange={(e) => setMetodoPagamento(e.target.value)}
          />
          Cartão de Débito
        </label>

        <label>
          <input
            type="radio"
            value="pix"
            checked={metodoPagamento === "pix"}
            onChange={(e) => setMetodoPagamento(e.target.value)}
          />
          Pix
        </label>

        {/* Parcelamento se for cartão de crédito */}
        {metodoPagamento === "credito" && (
          <div className="parcelamento">
            <label>Parcelamento:</label>
            <select value={parcelamento} onChange={(e) => setParcelamento(Number(e.target.value))}>
              {[...Array(12).keys()].map(i => {
                const parcelas = i + 1;
                const valorParcela = totalComDesconto / parcelas;
                return (
                  <option key={parcelas} value={parcelas}>
                    {parcelas}x de R$ {valorParcela.toFixed(2)}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Campo de cupom */}
        <div className="cupon">
          <label>Cupom de desconto:</label>
          <input
            type="text"
            placeholder="Digite seu cupom"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
          />
          <button onClick={validarCupom}>Aplicar</button>
        </div>
      </div>

      {/* Resumo */}
      <div className="resumo-final">
        <h2>Total: R$ {totalComDesconto.toFixed(2)}</h2>
        <button onClick={finalizarPedido} disabled={enviando}>
          {enviando ? "Finalizando..." : "Finalizar Pedido"}
        </button>
      </div>
    </div>
  );
}

export default FinalizarPedido;
