import React from 'react'

import { Link, useLocation } from 'react-router';  
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="main-menu">
      <header>
        <div className="logo">
            <Link to="/"> <img src="" alt="" /> </Link>       
        </div>

        <nav>
          <ul>
            <Link to="/"><li>Home</li></Link>
          </ul>
        </nav>
        
        <div className="buttons">
          <button>Login</button> 
        </div>
      </header>
    </div>

  )
}

export default Navbar
