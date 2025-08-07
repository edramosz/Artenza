import React from 'react'
import './PerfilComponents.css'
import './Cupom.css'
import NavProfile from '../NavProfile'

const Cupons = () => {
  return (
    <div className='perfil-page'>
      <NavProfile />
      <div className="add-container">
        <div className="add-cupom">
          <div className="form-group-cupom">
            <label>Digite seu cupom:</label>
            <input type="text" name="cupom" placeholder='EXEMPLO10...' />
            <button className="add-cupom">
              Adquirir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cupons