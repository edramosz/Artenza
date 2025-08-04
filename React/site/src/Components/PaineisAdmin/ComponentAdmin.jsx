import React, { useState, useEffect } from "react";

const ComponentAdmin = () => {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalEnderecos, setTotalEnderecos] = useState(0);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Busca usuários
        const usuariosRes = await fetch("https://artenza.onrender.com/Usuario");
        if (!usuariosRes.ok) throw new Error("Erro ao buscar usuários");
        const usuariosData = await usuariosRes.json();
        setTotalUsuarios(usuariosData.length);

        // Busca endereços
        const enderecosRes = await fetch("https://artenza.onrender.com/Endereco");
        if (!enderecosRes.ok) throw new Error("Erro ao buscar endereços");
        const enderecosData = await enderecosRes.json();
        setTotalEnderecos(enderecosData.length);

        // Busca produtos
        const produtosRes = await fetch("https://artenza.onrender.com/Produto");
        if (!produtosRes.ok) throw new Error("Erro ao buscar produtos");
        const produtosData = await produtosRes.json();
        setTotalProdutos(produtosData.length);

      } catch (error) {
        setErro(error.message);
        console.error(error);
      }
    };

    fetchTotals();
  }, []);

  return (
    <main className="render">
      <div className="content">
        <h2 className="title">Visão geral do site</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <div className="cards">
          <div className="info-card">
            <span className="icon">
              <i className="fa-solid fa-users"></i>
            </span>
            <div>
              <div className="value">{totalUsuarios}</div>
              <div className="label">Usuários</div>
            </div>
          </div>

          <div className="info-card">
            <span className="icon">
              <i className="fa-solid fa-map-location-dot"></i>
            </span>
            <div>
              <div className="value">{totalEnderecos}</div>
              <div className="label">Endereços</div>
            </div>
          </div>

          <div className="info-card">
            <span className="icon">
              <i className="fa-solid fa-cart-shopping"></i>
            </span>
            <div>
              <div className="value">{totalProdutos}</div>
              <div className="label">Produtos</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ComponentAdmin;
