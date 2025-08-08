import React, { useState } from "react";
import Cards from "react-credit-cards-2";
//import "react-credit-cards/lib/styles.css";

console.log(Cards);
//import "react-credit-cards-br/dist/styles-compiled.css";

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
    setState((prev) => ({ ...prev, [name]: value }));
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
        />
        <input
          type="tel"
          name="cvc"
          placeholder="CVC"
          value={state.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </form>
    </div>
  );
};