import React, { useState } from 'react';
import './Selection.css'

const Selection = () => {
    const [selecao, setSelecao] = useState('Blusas');

    function renderConteudo() {
        switch (selecao) {
            case 'Blusas':
                return <div><h3>Blusas</h3></div>;
            case 'Calcas':
                return <div><h3>Calças</h3></div>;
            case 'Shorts':
                return <div><h3>Shorts</h3></div>;
            default:
                return <div>najaja</div>;
        }
    }

    return (
        <div className="container-selection">
            <aside className="selection-nav">
                <nav>
                    <div className="content">
                        <h2 className='title'>Produtos Populares</h2>
                        <p className='text'>nossos produtos mais vendidos</p>
                    </div>
                    <ul className="selection">
                        <div className="items">
                            <li className={selecao === 'Blusas' ? 'active' : ''}>
                                <button onClick={() => setSelecao('Blusas')}>Blusas</button>
                            </li>
                            <li className={selecao === 'Calcas' ? 'active' : ''}>
                                <button onClick={() => setSelecao('Calcas')}>Calças</button>
                            </li>
                            <li className={selecao === 'Shorts' ? 'active' : ''}>
                                <button onClick={() => setSelecao('Shorts')}>Shorts</button>
                            </li>
                            <li className={selecao === 'rr' ? 'active' : ''}>
                                <button onClick={() => setSelecao('rr')}>Shorts</button>
                            </li>
                            <li className={selecao === 'rrxx' ? 'active' : ''}>
                                <button onClick={() => setSelecao('rrxx')}>Shorts</button>
                            </li>
                        </div>
                    </ul>
                </nav>
            </aside>
            <main>
                {renderConteudo()}
            </main>
        </div>
    );
};

export default Selection;
