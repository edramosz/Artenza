import React, { useEffect, useState } from "react";
import "./FinalizarPedido.css";

function FinalizarPedido() {
  // Estados principais
  const [usuario, setUsuario] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [parcelamento, setParcelamento] = useState(1);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const email = localStorage.getItem("email");
  const nomeCompleto = localStorage.getItem("nomeCompletoUser");
  const valorTotal = JSON.parse(localStorage.getItem("valorTotal"));

  // Lista de cupons válidos
  const cuponsValidos = [
    { codigo: "desconto10", desconto: 0.10 },
    { codigo: "fretegratis", desconto: 0.15 },
    { codigo: "vip", desconto: 0.20 }
  ];

  useEffect(() => {
    if (nomeCompleto) {
      setUsuarioLogado({ nome: nomeCompleto });
    } else {
      setUsuarioLogado(null);
    }
  }, [nomeCompleto]);


  // Carregamento dos dados ao abrir a página
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Usuário
        const resUsuario = await fetch(`https://artenza.onrender.com/Usuario/por-email/${email}`);
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);

        // Endereço
        const resEndereco = await fetch(`https://artenza.onrender.com/Endereco/${usuarioData.idEndereco}`);
        const enderecoData = await resEndereco.json();
        setEndereco(enderecoData);

        // Produtos e Carrinho
        const resProdutos = await fetch("https://artenza.onrender.com/Produto");
        const listaProdutos = await resProdutos.json();
        setProdutos(listaProdutos);

        const resCarrinho = await fetch("https://artenza.onrender.com/Carrinho");
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
      const res = await fetch("https://artenza.onrender.com/Venda", {
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

      const resTransacao = await fetch("https://artenza.onrender.com/Transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transacao)
      });

      if (resTransacao.ok) {
        // Limpa o carrinho do backend
        await Promise.all(
          itensSelecionados.map(item =>
            fetch(`https://artenza.onrender.com/Carrinho/${item.id}`, {
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
      {/* Endereço */}
      <div className="endereco">
        <h2 className="title-endereco"><i class="fa-solid fa-location-dot"></i> Endereço de Entrega</h2>
        <div className="edereco-content">
          <div className="dados-endereco">
            <p className="nome">{usuarioLogado.nome}</p>
            <p><span>Rua:</span> {endereco.rua}</p>
            <p><span>Número:</span> {endereco.numero}</p>
            <p><span>Bairro:</span> {endereco.bairro}</p>
            <p><span>Cidade:</span> {endereco.cidade}</p>
            <p><span>CEP:</span> {endereco.cep}</p>
          </div>
          <div className="btns-endereco">
            <button>Alterar</button>
          </div>
        </div>
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
                <p>Tamanho: {item.tamanho}</p>
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
        {/* <div className="cupon">
          <label>Cupom de desconto:</label>
          <input
            type="text"
            placeholder="Digite seu cupom"
            value={cupom}
            onChange={(e) => setCupom(e.target.value)}
          />
          <button onClick={validarCupom}>Aplicar</button>
        </div> */}
      </div>

      {/* Resumo */}
      <div className="resumo-final">
        <h2>Total: R$ {valorTotal.toFixed(2)}</h2>
        <button onClick={finalizarPedido} disabled={enviando}>
          {enviando ? "Finalizando..." : "Finalizar Pedido"}
        </button>
      </div>
    </div>
  );
}

export default FinalizarPedido;
