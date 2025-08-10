import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

function Cartao() {
  const [state, setState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focused: ""
  });

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let val = value;
    if (name === "number") {
      val = val.replace(/\D/g, "");
    }
    if (name === "cvc") {
      val = val.replace(/\D/g, "");
    }
    if (name === "expiry") {
      val = val.replace(/[^\d\/]/g, "");
      if (val.length === 2 && !val.includes("/")) {
        val = val + "/";
      }
      if (val.length > 5) {
        val = val.slice(0, 5);
      }
    }

    setState((prev) => ({ ...prev, [name]: val }));
  };

  const handleInputFocus = (e) => {
    setState((prev) => ({ ...prev, focused: e.target.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    const usuarioId = localStorage.getItem("idUsuario");

    console.log("🆔 ID do usuário recuperado do localStorage:", usuarioId);

    if (!usuarioId) {
      console.warn("⚠ Nenhum usuário logado encontrado!");
      setMensagem("Usuário não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    const payload = {
      usuarioId,
      numero: state.number,
      nomeTitular: state.name,
      validade: state.expiry,
      cvc: state.cvc
    };

    console.log("📦 Payload que será enviado:", payload);

    try {
      const response = await fetch("https://artenza.onrender.com/Cartao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("📡 Status da resposta:", response.status);
      console.log("📡 Headers da resposta:", [...response.headers.entries()]);

      const data = await response.text();
      console.log("📄 Corpo da resposta:", data);

      if (!response.ok) {
        throw new Error(`Erro ao salvar o cartão. Status: ${response.status}`);
      }

      setMensagem("✅ Cartão salvo com sucesso!");
      setState({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
        focused: ""
      });
    } catch (error) {
      console.error("❌ Erro no POST do cartão:", error);
      setMensagem(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Cards
        number={state.number}
        name={state.name}
        expiry={state.expiry}
        cvc={state.cvc}
        focused={state.focused}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          name="number"
          placeholder="Número do cartão"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength={19}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nome do titular"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
        />
        <input
          type="text"
          name="expiry"
          placeholder="Validade (MM/AA)"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength={5}
          required
        />
        <input
          type="tel"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength={4}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Cartão"}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default Cartao;
