import React, { useEffect, useState } from "react";
import "./FinalizarPedido.css";
import ListaCartoes from "../../Components/Cartão/ListaCartoes";

function FinalizarPedido() {
  // Estados principais
  const [usuario, setUsuario] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [enviando, setEnviando] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [parcelamento, setParcelamento] = useState(1);
  const [step, setStep] = useState(1); // controle do step atual

  const email = localStorage.getItem("email");
  const nomeCompleto = localStorage.getItem("nomeCompletoUser");
  const valorTotal = JSON.parse(localStorage.getItem("valorTotal"));

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
        const resUsuario = await fetch(`https://artenza.onrender.com/Usuario/por-email/${email}`);
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);

        const resEndereco = await fetch(`https://artenza.onrender.com/Endereco/por-usuario/${usuarioData.id}`);
        const enderecosData = await resEndereco.json();
        const enderecoAtivo = enderecosData.find(e => e.ativo === true);
        if (enderecoAtivo) {
          setEndereco(enderecoAtivo);
        } else {
          setEndereco(null);
          console.warn("Nenhum endereço ativo encontrado para o usuário.");
        }

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

  const getProduto = (idProduto) => produtos.find(p => p.id === idProduto) || {};

  const total = itensSelecionados.reduce((acc, item) => {
    const produto = getProduto(item.idProduto);
    return acc + (produto.preco || 0) * item.quantidade;
  }, 0);

  // Função para avançar para o próximo step, com validação simples
  const irParaProximoStep = () => {
    if (step === 1 && !endereco) {
      alert("Selecione ou cadastre um endereço.");
      return;
    }
    if (step === 2 && (metodoPagamento !== "pix" && !cartaoSelecionado)) {
      alert("Selecione um cartão válido para pagamento.");
      return;
    }
    setStep(step + 1);
  };

  const irParaStepAnterior = () => {
    if (step > 1) setStep(step - 1);
  };

  // Depois do cálculo do total, antes do finalizarPedido:
  const desconto = 0;
  const totalComDesconto = total * (1 - desconto);

  const finalizarPedido = async () => {
    if (enviando) return;

    if (!usuario || !endereco || itensSelecionados.length === 0) {
      alert("Dados incompletos.");
      return;
    }

    // Preparar array produtos com campos corretos
    const produtosVenda = itensSelecionados.map(item => {
      const produto = getProduto(item.idProduto);
      return {
        id: item.id,  // obrigatório para o backend
        produtoId: String(item.idProduto),
        quantidade: item.quantidade > 0 ? item.quantidade : 1,
        precoUnitario: produto.preco > 0 ? produto.preco : 0.01
      };
    });


    // Somar total com base nos produtos preparados
    const total = produtosVenda.reduce(
      (acc, p) => acc + p.precoUnitario * p.quantidade,
      0
    );

    const desconto = 0; // ajustar se tiver desconto
    const totalComDesconto = total * (1 - desconto);

    // Construir objeto venda com dados corretos
    const venda = {
      usuarioId: String(usuario.id),
      enderecoId: String(endereco.id),
      dataVenda: new Date().toISOString(),
      valorTotal: totalComDesconto,
      produtos: produtosVenda
    };

    console.log("Objeto venda:", venda);

    setEnviando(true);

    try {
      // Enviar venda
      const res = await fetch("https://artenza.onrender.com/Venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda)
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Erro ao registrar venda: ${errorBody}`);
      }

      const vendaCriada = await res.json();
      console.log("Venda criada:", vendaCriada);

      // Construir objeto transacao (data só com yyyy-mm-dd)
      const transacao = {
        vendaId: vendaCriada.id,
        data: new Date().toISOString().split("T")[0],
        parcelamento: metodoPagamento === "credito" ? (parcelamento > 0 ? parcelamento : 1) : 1,
        metodoPagamento
      };

      console.log("Objeto transacao:", transacao);

      // Enviar transacao
      const resTransacao = await fetch("https://artenza.onrender.com/Transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transacao)
      });

      if (!resTransacao.ok) {
        const errorBody = await resTransacao.text();
        throw new Error(`Erro ao registrar transação: ${errorBody}`);
      }

      // Limpar itens do carrinho no backend
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

    } catch (error) {
      console.error("Erro:", error);
      alert(error.message || "Erro ao finalizar pedido.");
    } finally {
      setEnviando(false);
    }
  };




  if (!usuario || !endereco || produtos.length === 0) {
    return <p>Carregando informações do pedido...</p>;
  }

  return (
    <div className="finalizar-container">
      {/* Steps indicator simples */}
      <div className="steps-indicator">
        <button disabled={step === 1} onClick={() => setStep(1)}>1. Endereço</button>
        <button disabled={step === 2 || step < 2} onClick={() => setStep(2)}>2. Pagamento</button>
        <button disabled={step === 3 || step < 3} onClick={() => setStep(3)}>3. Revisão</button>
      </div>

      {/* Step 1: Endereço */}
      {step === 1 && (
        <div className="step endereco">
          <h2 className="title-endereco"><i className="fa-solid fa-location-dot"></i> Endereço de Entrega</h2>
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
          <button onClick={irParaProximoStep}>Próximo</button>
        </div>
      )}

      {/* Step 2: Pagamento */}
      {step === 2 && (
        <div className="step pagamento">
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

          {(metodoPagamento === "credito" || metodoPagamento === "debito") && usuario && (
            <div className="lista-cartoes">
              <h3>Selecione um cartão</h3>
              <ListaCartoes
                usuarioId={usuario.id}
                atualizar={false}
                onSelecionar={(cartao) => setCartaoSelecionado(cartao)}
                mostrarTextoProtecao={false} // para ocultar texto de proteção se desejar
              />
            </div>
          )}

          {metodoPagamento === "credito" && (
            <div className="parcelamento">
              <label>Parcelamento:</label>
              <select
                value={parcelamento}
                onChange={(e) => setParcelamento(Number(e.target.value))}
              >
                {[...Array(12).keys()].map((i) => {
                  const parcelas = i + 1;
                  const valorParcela = totalComDesconto / parcelas; // aqui também
                  return (
                    <option key={parcelas} value={parcelas}>
                      {parcelas}x de R$ {valorParcela.toFixed(2)}
                    </option>
                  );
                })}
              </select>
            </div>
          )}


          <div className="botoes-navegacao">
            <button onClick={irParaStepAnterior}>Voltar</button>
            <button onClick={irParaProximoStep}>Próximo</button>
          </div>
        </div>
      )}

      {/* Step 3: Revisão e Finalização */}
      {step === 3 && (
        <div className="step revisao">
          <h2>Revisar Pedido</h2>

          <div className="itens-pedido">
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

          <div className="resumo-final">
            <h2>Total: R$ {valorTotal.toFixed(2)}</h2>
            <button
              onClick={finalizarPedido}
              disabled={enviando || (metodoPagamento !== "pix" && !cartaoSelecionado)}
            >
              {enviando ? "Finalizando..." : "Finalizar Pedido"}
            </button>
          </div>

          <div className="botoes-navegacao">
            <button onClick={irParaStepAnterior}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinalizarPedido;
