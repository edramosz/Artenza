import React, { useState } from "react";
import './AdminPainel.css';
import AdminProduto from "./AdminProduto";

const AdminPainel = () => {
  const [selecao, setSelecao] = useState('painel');

  function renderConteudo() {
    switch (selecao) {
      case 'usuarios':
        return <div><h3>Usuários</h3></div>;
      case 'enderecos':
        return <div><h3>Endereços</h3></div>;
      case 'produtos':
        return <AdminProduto />;
      default:
        return (
          <div className="content">
            <h2 className="title">Visão geral do site</h2>
            <div className="cards">
              <div className="info-card">
                <span className="icon"><i className="fa-solid fa-users"></i></span>
                <div>
                  <div className="value">203</div>
                  <div className="label">Usuários</div>
                </div>
              </div>
              <div className="info-card">
                <span className="icon"><i className="fa-solid fa-map-location-dot"></i></span>
                <div>
                  <div className="value">12</div>
                  <div className="label">Endereços</div>
                </div>
              </div>
              <div className="info-card">
                <span className="icon"><i className="fa-solid fa-cart-shopping"></i></span>
                <div>
                  <div className="value">33</div>
                  <div className="label">Produtos</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="container-dashboard">
      <aside className="sidebar">
        <h2 className="title">Painel Admin</h2>
        <ul className="pages">
          <li className={selecao === 'painel' ? 'active' : ''}>
            <button onClick={() => setSelecao('painel')}><i class="fa-solid fa-gear"></i>Administração</button>
          </li>
          <li className={selecao === 'usuarios' ? 'active' : ''}>
            <button onClick={() => setSelecao('usuarios')}><i className="fa-solid fa-users"></i>Usuários</button>
          </li>
          <li className={selecao === 'enderecos' ? 'active' : ''}>
            <button onClick={() => setSelecao('enderecos')}><i class="fa-solid fa-location-dot"></i>Endereços</button>
          </li>
          <li className={selecao === 'produtos' ? 'active' : ''}>
            <button onClick={() => setSelecao('produtos')}><i class="fa-solid fa-cart-shopping"></i>Produtos</button>
          </li>
        </ul>
      </aside>
      <main className="render">
        {renderConteudo()}
      </main>
    </div>
  );
};

export default AdminPainel;
