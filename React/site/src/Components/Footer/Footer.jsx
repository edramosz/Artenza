import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {

    const navigate = useNavigate()

    function navegar(){
        navigate("/Contato")
    }


    return (
        <footer className="footer-container">
            <div className="footer-hero">
                <div className="footer-top">
                    <div>
                        <label className='border-label'></label>
                        <h2>Conheça a gente</h2>
                    </div>
                    <button onClick={navegar}>Contate-nos</button>
                </div>
                <div className="footer-content">
                    <div className="footer-section">
                        <h2>A Artenza</h2>
                        <p>Nossa loja sempre está disponilvel, ofertando tudo do bom do melhor, sempre na simplicidade e na qualidade de nossos produtos</p>
                        <div className="social-icons">
                            <ul>
                                <li><Link to="#"><i className="fa-brands fa-instagram"></i></Link></li>
                                <li><Link to="#"><i className="fa-brands fa-facebook"></i></Link></li>
                                <li><Link to="#"><i className="fa-brands fa-twitter"></i></Link></li>
                                <li><Link to="#"><i className="fa-brands fa-youtube"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h3>Navegação</h3>
                        <ul className='navegacao'>
                            <li>
                                <Link to="/Sobre">Sobre-nos</Link>
                            </li>
                            <li>
                                <Link to="/Feminino">Produtos Femininos</Link>
                            </li>
                            <li>
                                <Link to="/Masculino">Produtos Masculinos</Link>
                            </li>
                            <li>
                                <Link to="/Contato">Contato</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Contato</h3>
                        <ul>
                            <li>
                                (31) 9982-0921
                            </li>
                            <li>
                                artenza.ofc@gmail.com
                            </li>
                            <li>
                                102 Rua dos Anjos,<br />
                                34515-228 Belo-Horizonte
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Receba informações especiais </h3>
                        <form className="footer-form">
                            <input type="email" placeholder='Digite seu email' />
                            <button>
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="footer-aside">
                <div>
                    <p>Todos direitos reservados &copy; Artenza 2025</p>
                </div>
                <div>
                    <Link>Termos e Diretrizes</Link>
                    <p>|</p>
                    <Link>Politica de Privacidade</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
