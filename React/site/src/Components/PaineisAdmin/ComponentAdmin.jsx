import React from 'react'

const ComponentAdmin = () => {

    
    return (

        <main className="render">

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
        </main>
    )
}

export default ComponentAdmin