import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
<div>
  <nav>
    <button popovertarget="modal">Menu</button>
    <div id="modal" popover="auto">
      <ul>
        <li>Home</li>
        <li>Sobre</li>
        <li>Homens</li>
        <li>Mulheres</li>
        <li>Contato</li>
      </ul> 
      <button popovertarget="modal" popovertargetaction="hide">Close</button>
    </div>
  </nav>
</div>
  )
}

export default Navbar
