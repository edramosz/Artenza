import React from 'react'
import { Link } from 'react-router-dom'
import './SimplesLayout.css'

const FooterSimples = () => {
  return (
    <div className="footer-s">
      <ul>
        <li><Link to="#">Termos de uso</Link></li>
        <li><Link to="#">Privacidade</Link></li>
        <li>&copy; Artenza</li>
      </ul>
    </div>
  )
}

export default FooterSimples