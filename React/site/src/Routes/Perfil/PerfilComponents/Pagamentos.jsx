import React from 'react'
import './PerfilComponents.css'
import NavProfile from '../NavProfile'
import Cartao from '../../../Components/Cartão/Cartao'

const Pagamentos = () => {
  return (
    <div className='perfil-page'>
      <NavProfile />
      <div className="cartao-container">
        <div className="cartao-top">
          <h2>Seus Cartões </h2>
          <button>Adicionar um Cartão</button>
        </div>
      
      <Cartao />
      </div>
    </div>
  )
}

export default Pagamentos
