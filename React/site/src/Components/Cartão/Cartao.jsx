import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

export default function CartaoSimulador() {
  const [state, setState] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focused: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Se quiser, pode limitar o input (exemplo para número e CVC)
    let val = value;
    if (name === "number") {
      // Remove tudo que não for número
      val = val.replace(/\D/g, "");
    }
    if (name === "cvc") {
      val = val.replace(/\D/g, "");
    }
    if (name === "expiry") {
      // Permite só números e barra, e formata como MM/YY
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

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Cards
        number={state.number}
        name={state.name}
        expiry={state.expiry}
        cvc={state.cvc}
        focused={state.focused}
      />

      <form>
        <input
          type="tel"
          name="number"
          placeholder="Número do cartão"
          value={state.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength={19} // Ex: 16 dígitos + espaços
        />
        <input
          type="text"
          name="name"
          placeholder="Nome do titular"
          value={state.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="text"
          name="expiry"
          placeholder="Validade (MM/AA)"
          value={state.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength={5}
        />
        <input
          type="tel"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength={4}
        />
      </form>
    </div>
  );
}
