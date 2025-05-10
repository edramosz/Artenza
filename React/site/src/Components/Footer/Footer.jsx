import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Seção Ajuda */}
                <div className="footer-column">
                    <h4>Ajuda</h4>
                    <ul>
                        <li><Link to="#">Pedidos</Link></li>
                        <li><Link to="#">Entregas</Link></li>
                        <li><Link to="#">Devoluções</Link></li>
                        <li><Link to="#">Opções de pagamento</Link></li>
                        <li><Link to="#">Contato</Link></li>
                    </ul>
                </div>

                {/* Seção Sobre */}
                <div className="footer-column">
                    <details className='detalhes'>
                        <summary>Sobre</summary>
                        <ul>
                            <li><Link to="#">Quem somos</Link></li>
                            <li><Link to="#">Carreiras</Link></li>
                            <li><Link to="#">Termos de uso</Link></li>
                            <li><Link to="#">Privacidade</Link></li>
                        </ul>
                    </details>

                    <ul className='footer-item'>
                        <h4>Sobre</h4>
                        <li><Link to="#">Quem somos</Link></li>
                        <li><Link to="#">Carreiras</Link></li>
                        <li><Link to="#">Termos de uso</Link></li>
                        <li><Link to="#">Privacidade</Link></li>
                    </ul>
                </div>

                {/* Seção Redes Sociais */}
                <div className="footer-column">
                    <details className='detalhes'>
                        <summary>Redes Sociais</summary>
                        <ul>
                            <li><Link to="#">Instagram</Link></li>
                            <li><Link to="#">Facebook</Link></li>
                            <li><Link to="#">Twitter</Link></li>
                            <li><Link to="#">YouTube</Link></li>
                        </ul>
                    </details>

                    <ul className='footer-item'>
                        <h4>Redes Sociais</h4>
                        <div id='social-media'>
                            <li><Link to="#"><i className="fa-brands fa-instagram"></i></Link></li>
                            <li><Link to="#"><i className="fa-brands fa-facebook"></i></Link></li>
                            <li><Link to="#"><i className="fa-brands fa-twitter"></i></Link></li>
                            <li><Link to="#"><i className="fa-brands fa-youtube"></i></Link></li>
                        </div>
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
