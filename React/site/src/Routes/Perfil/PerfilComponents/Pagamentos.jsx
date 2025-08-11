import React, { useState } from 'react';
import './PerfilComponents.css';
import NavProfile from '../NavProfile';
import Cartao from '../../../Components/Cartão/Cartao';
import ListaCartoes from '../../../Components/Cartão/ListaCartoes';
import './Pagamentos.css';


const Pagamentos = () => {
  const usuarioId = localStorage.getItem("idUsuario");

  const [atualizarLista, setAtualizarLista] = useState(false);

  const handleCartaoAdicionado = () => {
    setAtualizarLista(prev => !prev); // força o ListaCartoes a atualizar
  };

  return (
    <div className='perfil-page'>
      <NavProfile />
      <div className="pagamento-container">
        <div className="pagamento-top">
          <h2>Meus Cartões</h2>
        </div>

        <ListaCartoes usuarioId={usuarioId} atualizar={atualizarLista} onAtualizar={handleCartaoAdicionado} />
        <Cartao onCartaoAdicionado={handleCartaoAdicionado} />


      </div>
    </div>
  );
};

export default Pagamentos;
