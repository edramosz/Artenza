import React from 'react'
import './Sobre.css'
const Sobre = () => {
    return (
        <div className="sobre-container">
            <div className="sobre-hero">
                <div className="banner-sobre">
                    <div className="banner-sobre-content">
                        <h2></h2>
                        <p></p>
                        <button></button>
                    </div>
                </div>
                <div className="sobre-cards">
                    <div className="card-sobre">

                    </div>
                    <div className="card-sobre">

                    </div>
                </div>
                <div className="details-hero">
                    <details>
                        <summary>
                            Sede
                            <span class="icon-button"></span>
                        </summary>
                        <div className='detail-content'>
                            Conteúdo da seção “Sede”.
                        </div>
                    </details>
                </div>
            </div>
        </div>
    )
}

export default Sobre
