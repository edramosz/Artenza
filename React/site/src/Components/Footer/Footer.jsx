import React from 'react';
import './Footer.css'; // Importa o CSS separado

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Seção Ajuda */}
                <div className="footer-column">
                    <h4>Ajuda</h4>
                    <ul>
                        <li>Pedidos</li>
                        <li>Entregas</li>
                        <li>Devoluções</li>
                        <li>Opções de pagamento</li>
                        <li>Contato</li>
                    </ul>
                </div>

                {/* Seção Sobre */}
                <div className="footer-column">
                    <details className='detalhes'>
                        <summary>Sobre</summary>
                        <ul>
                            <li>Quem somos</li>
                            <li>Carreiras</li>
                            <li>Termos de uso</li>
                            <li>Privacidade</li>
                        </ul>
                    </details>

                    <ul className='footer-item'>
                        <h4>Sobre</h4>
                        <li>Quem somos</li>
                        <li>Carreiras</li>
                        <li>Termos de uso</li>
                        <li>Privacidade</li>
                    </ul>
                </div>

                {/* Seção Redes Sociais */}
                <div className="footer-column">
                    <details className='detalhes'>
                        <summary>Redes Sociais</summary>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">YouTube</a></li>
                        </ul>
                    </details>
                    <ul  className='footer-item'>
                        <h4>Redes Sociais</h4>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">YouTube</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Artenza - Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
