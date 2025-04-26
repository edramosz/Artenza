import React, { useState } from "react";
import './AdminPainel.css';
import SideBar from "../NavBar/SideBar";
import ComponentAdmin from "./ComponentAdmin";

const AdminPainel = () => {
  // const [selecao, setSelecao] = useState('painel');

  // function renderConteudo() {
  //   switch (selecao) {
  //     case 'usuarios':
  //       return <div><h3>Usuários</h3></div>;
  //     case 'enderecos':
  //       return <div><h3>Endereços</h3></div>;
  //     case 'produtos':
  //       return <AdminProduto />;
  //     default:
  //       return (

  //       );
  //   }
  // }
  return (
    <>
      <div className="container-dashboard">
        <SideBar />
        <ComponentAdmin />
      </div>
    </>
  );
};

export default AdminPainel;
