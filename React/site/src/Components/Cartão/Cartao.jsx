import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./Cartao.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,

} from '@fortawesome/free-solid-svg-icons';

function Cartao({ onCartaoAdicionado }) {
  const [state, setState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focused: ""
  });

  const [loading, setLoading] = useState(false);

  const [erros, setErros] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    geral: ""
  });

  const [tentouEnviar, setTentouEnviar] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "number") {
      val = val.replace(/\D/g, "");
      val = val.replace(/(.{4})/g, "$1 ").trim();
    }
    if (name === "cvc") {
      val = val.replace(/\D/g, "");
      if (val.length > 3) val = val.slice(0, 3);
    }
    if (name === "expiry") {
      val = val.replace(/[^\d]/g, "");
      if (val.length > 4) val = val.slice(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    }
    if (name === "name") {
      val = val.replace(/\d/g, "");
    }

    setState((prev) => ({ ...prev, [name]: val }));

    if (tentouEnviar) {
      setErros((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focused: e.target.name }));
  };

  const validarCampos = () => {
    const novosErros = {
      number: "",
      name: "",
      expiry: "",
      cvc: "",
      geral: ""
    };

    const numeroLimpo = state.number.replace(/\s/g, "");
    if (numeroLimpo.length < 13) {
      novosErros.number = "Número do cartão inválido.";
    }

    if (state.name.trim().length < 3) {
      novosErros.name = "Nome do titular deve ter ao menos 3 caracteres.";
    }

    if (!state.expiry.includes("/")) {
      novosErros.expiry = "Validade inválida. Use o formato MM/AA.";
    } else {
      const [mes, ano] = state.expiry.split("/");
      if (
        !mes ||
        !ano ||
        mes.length !== 2 ||
        ano.length !== 2 ||
        isNaN(parseInt(mes)) ||
        isNaN(parseInt(ano)) ||
        parseInt(mes) < 1 ||
        parseInt(mes) > 12
      ) {
        novosErros.expiry = "Validade inválida. Mês deve estar entre 01 e 12.";
      } else {
        const mesNum = parseInt(mes, 10);
        const anoNum = 2000 + parseInt(ano, 10);
        const ultimoDiaMes = new Date(anoNum, mesNum, 0);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        if (ultimoDiaMes < hoje) {
          novosErros.expiry = "Data de validade inválida. O cartão já expirou.";
        }
      }
    }

    if (state.cvc.length < 3) {
      novosErros.cvc = "CVC inválido.";
    }

    setErros(novosErros);

    return !Object.values(novosErros).some((x) => x.length > 0);
  };

  const camposPreenchidos = () =>
    state.number.trim() !== "" &&
    state.name.trim() !== "" &&
    state.expiry.trim() !== "" &&
    state.cvc.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTentouEnviar(true);
    setErros({ number: "", name: "", expiry: "", cvc: "", geral: "" });
    setLoading(true);

    const usuarioId = localStorage.getItem("idUsuario");
    if (!usuarioId) {
      setErros((prev) => ({ ...prev, geral: "Usuário não encontrado. Faça login novamente." }));
      setLoading(false);
      return;
    }

    if (!validarCampos()) {
      setLoading(false);
      return;
    }

    const numeroLimpo = state.number.replace(/\s/g, "");
    const [mes, ano] = state.expiry.split("/");
    const validadeISO = new Date(2000 + parseInt(ano, 10), parseInt(mes, 10) - 1, 1).toISOString();

    const payload = {
      usuarioId,
      numeroCartao: numeroLimpo,
      nomeTitular: state.name.trim(),
      validade: validadeISO,
      cvv: state.cvc
    };

    try {
      const response = await fetch("https://artenza.onrender.com/Cartao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!response.ok) {
        const msg = data?.message || data?.error || `Status: ${response.status}`;
        throw new Error(`Erro ao salvar o cartão. ${msg}`);
      }

      setErros({ number: "", name: "", expiry: "", cvc: "", geral: "Cartão salvo com sucesso!" });

      if (onCartaoAdicionado) {
        onCartaoAdicionado();
      }

      setTimeout(() => {
        setState({
          number: "",
          name: "",
          expiry: "",
          cvc: "",
          focused: ""
        });
        setErros({ number: "", name: "", expiry: "", cvc: "", geral: "" });
        setTentouEnviar(false);
      }, 2000);

    } catch (error) {
      setErros((prev) => ({ ...prev, geral: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-cartao-container">
      <details className="details-cartao" open>
        <summary className="summary-cartao">
          <p>
            <FontAwesomeIcon icon={faCreditCard} />
            Adicionar um novo Cartão de Crédito/Débito
          </p>
          <i className="fa-solid fa-chevron-down icon-summary"></i>
        </summary>

        <div className="add-container-hero-cartao">
          <form onSubmit={handleSubmit} noValidate className="add-cartao-form">
            <div className="form-group-cartao">
              <label>Número do Cartão *</label>
              <input
                type="tel"
                name="number"
                placeholder="Ex: 1234 5678 9012 3456"
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                maxLength={19}
                required
              />
              {tentouEnviar && erros.number && <p className="erro-text">{erros.number}</p>}
            </div>

            <div className="form-group-cartao">
              <label>Nome do Titular *</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: João da Silva"
                value={state.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
              />
              {tentouEnviar && erros.name && <p className="erro-text">{erros.name}</p>}
            </div>

            <div className="validade-cvv">
              <div className="form-group-cartao">
                <label>Data de Validade *</label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/AA"
                  value={state.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  maxLength={5}
                  required
                />
                {tentouEnviar && erros.expiry && <p className="erro-text">{erros.expiry}</p>}
              </div>

              <div className="form-group-cartao">
                <label>CVC *</label>
                <input
                  type="tel"
                  name="cvc"
                  placeholder="Ex: 123"
                  value={state.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  maxLength={3}
                  required
                />
                {tentouEnviar && erros.cvc && <p className="erro-text">{erros.cvc}</p>}
              </div>
            </div>

            {/* Mensagem de sucesso/erro acima do botão */}
            {tentouEnviar && erros.geral && (
              <p className={`geral-msg ${erros.geral.includes("sucesso") ? "success" : "error"}`}>
                {erros.geral}
              </p>
            )}


            <button type="submit" disabled={!camposPreenchidos() || loading} className="form-button">
              {loading ? "Salvando..." : "Salvar Cartão"}
            </button>
          </form>

          <div className="cartao-animado">
            <Cards
              number={state.number}
              name={state.name}
              expiry={state.expiry.replace("/", "")}
              cvc={state.cvc}
              focused={state.focused}
            />
          </div>
        </div>

      </details>

    </div>
  );
}

export default Cartao;



