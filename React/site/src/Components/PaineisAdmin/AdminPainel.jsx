import React, { useState } from "react";
import './AdminPainel.css';
import AdminProduto from "./AdminProduto";

const AdminPainel = () => {

  const [selecao, setSelecao] = useState('painel');

  function renderConteudo() {
    if (selecao === 'usuarios') {
      return (
        <div>
          <h3>Usuários</h3>
          
        </div>
      );
    } else if (selecao === 'enderecos') {
      return (
        <div>
          <h3>Endereços</h3>

        </div>
      );
    } else if (selecao === 'produtos') {

      return <AdminProduto />

    }


    // conteúdo padrão (Painel de Admin)
    return (
      <div className="content">
        <h2 className="title">Visão geral do site</h2>
        <div className="cards">
          <div className="info-card"><span className="icon"><i class="fa-solid fa-users"></i></span><div><div className="value">203</div><div className="label">Usuários</div></div></div>
          <div className="info-card"><span className="icon"><i class="fa-solid fa-map-location-dot"></i></span><div><div className="value">12</div><div className="label">Endereços</div></div></div>
          <div className="info-card"><span className="icon"><i class="fa-solid fa-cart-shopping"></i></span><div><div className="value">33</div><div className="label">Produtos</div></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-dashboard">
      <div className="sidebar">
        <h2 className="title">Painel Admin</h2>
        <ul className="Pages">
          <li><button onClick={() => setSelecao('painel')}>Painel de Admin</button></li>
          <li><button onClick={() => setSelecao('usuarios')}>Usuários</button></li>
          <li><button onClick={() => setSelecao('enderecos')}>Endereços</button></li>
          <li><button onClick={() => setSelecao('produtos')}>Produtos</button></li>
        </ul>
      </div>

      <div className="render">
        {renderConteudo()}
      </div>
    </div>
  );
};

export default AdminPainel;
