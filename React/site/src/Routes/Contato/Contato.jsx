import React from 'react'
import { Link } from 'react-router-dom'
import './Contato.css'

const Contato = () => {
    return (
        <div className="container-contact">
            <div className="banner-contact">
                <h2>Fale com a gente.</h2>
            </div>
            <div className="contact-page">
                <div className="contact-info">
                    <div>
                        <h1>Endereço</h1>
                        <p> 102 Jardim Canadá,<br />
                            34515-228 Belo-Horizonte</p>
                    </div>
                    <div>
                        <h2>Contato</h2>
                        <p>Telefone: (31) 9 9237-2061<br />
                            Email: Artenza@gmail.com</p>
                    </div>
                    <div>
                        <h2>Horário de Funcionamento</h2>
                        <p>Segunda a Sexta 8:00 - 20:00</p>
                    </div>
                    <h2>Fique Conectado</h2>
                    <div className="social-icons">
                        <ul>
                            <li><Link to="#"><i className="fa-brands fa-instagram"></i></Link></li>
                            <li><Link to="#"><i className="fa-brands fa-facebook"></i></Link></li>
                            <li><Link to="#"><i className="fa-brands fa-twitter"></i></Link></li>
                            <li><Link to="#"><i className="fa-brands fa-youtube"></i></Link></li>
                        </ul>
                    </div>
                </div>

                <div className="contact-form">
                    <p className='text-contact'><span>//</span> contate-nos</p>
                    <h2>Entre em Contato</h2>
                    <p>Fale com a nossa equipe pronta pra você!</p>

                    <form className='form-contact'>
                        <div className="contact-hero">
                            <div className="form-group">
                                <label htmlFor="name">Seu Nome *</label>
                                <input type="text" id="name" placeholder="Ex. Edson Jose" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input type="email" id="email" placeholder="Digite seu email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Telefone *</label>
                                <input type="tel" id="phone" placeholder="Digite seu número de telefone" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Serviço *</label>
                                <input type="tel" id="phone" placeholder="Ex: Devolução" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Sua Mensagem *</label>
                                <textarea id="message" placeholder="Digite aqui..." required></textarea>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Enviar Mensagem</button>
                    </form>
                </div>
            </div>
            <div className="newsletter-container">
                <div className="newsletter-box">
                    <p><span>//</span> Newsletter</p>
                    <h2>Inscreva-se para receber <br /> <span>ofertas e descontos</span> especiais</h2>

                    <form className="newsletter-form">
                        <div className="div-form">
                            <div className="newsletter-icon">
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                            <div className="form-group-contact">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Digite seu e-mail"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="subscribe-btn">
                            Inscrever-se
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contato
