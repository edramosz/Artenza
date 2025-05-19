import React from 'react'
import { Link } from 'react-router-dom'


const NavbarSimples = () => {
  return (
    <div className="nav-s">
      <div className="logo">
        <Link to='/'>
          <img src="./img/logo.png" width={195} />
        </Link>
      </div>
      <div className="nav-s-items">
        <ul>
          <li>
            <Link to="/Cadastro">Junte-se a nós</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default NavbarSimples