import React, { useEffect, useState } from "react";
import creditCardType from "credit-card-type";

function ListaCartoes({ usuarioId, atualizar, onAtualizar, onSelecionar, mostrarTextoProtecao = true }) {
  const [cartoes, setCartoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [deletandoId, setDeletandoId] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [cartaoParaExcluir, setCartaoParaExcluir] = useState(null);
  const [cartaoSelecionadoId, setCartaoSelecionadoId] = useState(null);

  useEffect(() => {
    async function fetchCartoes() {
      setLoading(true);
      setErro(null);
      try {
        const response = await fetch(`https://artenza.onrender.com/Cartao/usuario/${usuarioId}`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar cartões: ${response.status}`);
        }
        const data = await response.json();
        setCartoes(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (usuarioId) {
      fetchCartoes();
    }
  }, [usuarioId, atualizar]);

  const mascararNumero = (num) => {
    if (!num || num.length < 4) return num;
    return "**** **** **** " + num.slice(-4);
  };

  const pegarBandeira = (num) => {
    const tipos = creditCardType(num);
    if (tipos.length === 0) return null;
    return tipos[0].niceType;
  };

  const logoBandeira = (bandeira) => {
    switch ((bandeira || "").toLowerCase()) {
      case "visa":
        return <img src="././img/visa.png" alt="Visa" className="img-bandeira" height={30} />;
      case "mastercard":
        return <img src="././img/mastercard.png" alt="Mastercard" className="img-bandeira" height={30} />;
      case "american express":
        return <img src="././img/amex.png" alt="American Express" className="img-bandeira" height={30} />;
      case "discover":
        return <img src="././img/discover.png" alt="Discover" className="img-bandeira" height={30} />;
      case "elo":
        return <img src="././img/elo.png" alt="Elo" className="img-bandeira" height={30} />;
      default:
        return <span>{bandeira}</span>;
    }
  };

  const abrirModalExcluir = (cartao) => {
    setCartaoParaExcluir(cartao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCartaoParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    if (!cartaoParaExcluir) return;

    setDeletandoId(cartaoParaExcluir.id);
    setErro(null);
    setModalAberto(false);

    try {
      const response = await fetch(`https://artenza.onrender.com/Cartao/${cartaoParaExcluir.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Erro ao deletar cartão: ${response.status}`);
      }
      if (onAtualizar) {
        onAtualizar();
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setDeletandoId(null);
      setCartaoParaExcluir(null);
    }
  };

  const handleSelecionar = (cartao) => {
    setCartaoSelecionadoId(cartao.id);
    if (onSelecionar) {
      onSelecionar(cartao);
    }
  };

  if (loading) return <p>Carregando cartões...</p>;
  if (erro) return <p className="erro">{erro}</p>;
  if (cartoes.length === 0) return <p className="nenhum-cartao">Sem cartões cadastrados.</p>;

  return (
    <div className="cartoes-usuario">
      <ul className="ul-cartao">
        {cartoes.map((cartao) => {
          const bandeira = pegarBandeira(cartao.numeroCartao);
          return (
            <li key={cartao.id} className="item-cartao">
              <span>
                <input
                  type="radio"
                  name="cartaoSelecionado"
                  value={cartao.id}
                  checked={cartaoSelecionadoId === cartao.id}
                  onChange={() => handleSelecionar(cartao)}
                />

                <p className="bandeira">{logoBandeira(bandeira)}</p>
                <p>{mascararNumero(cartao.numeroCartao)}</p>
              </span>
              <button
                onClick={() => abrirModalExcluir(cartao)}
                disabled={deletandoId === cartao.id}
                aria-label="Excluir cartão"
                title="Excluir cartão"
                className="btn-excluir"
              >
                <i className="fa-solid fa-trash"></i> Excluir
              </button>
            </li>
          );
        })}
      </ul>

      {mostrarTextoProtecao && (
        <div className="text-cartoes">
          <h4><i className="fa-regular fa-circle-check"></i> As informações do seu cartão de crédito são protegidas</h4>
          <p>tabelecemos parcerias com plataformas de pagamento para garantir que os detalhes do seu cartão de crédito sejam bem protegidos.</p>
        </div>
      )}

      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <p>
              Deseja realmente excluir o cartão{" "}
              <span>{mascararNumero(cartaoParaExcluir?.numeroCartao)}</span>?
            </p>
            <div className="modal-buttons">
              <button className="cancel" onClick={fecharModal}>
                Cancelar
              </button>
              <button
                className="delete"
                onClick={confirmarExclusao}
                disabled={deletandoId === cartaoParaExcluir?.id}
              >
                {deletandoId === cartaoParaExcluir?.id ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaCartoes;
