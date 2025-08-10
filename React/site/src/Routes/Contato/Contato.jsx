import React, { useState }from 'react'
import { Link } from 'react-router-dom'
import './Contato.css'

const Contato = () => {
    
    const [EmailNewsletter, setEmailNewsletter] = useState("");

    const [EmailContato, setEmailContato] = useState("");
    const [Nome, setNome] = useState("");
    const [Telefone, setTelefone] = useState("");
    const [Servico, setServico] = useState("");
    const [Mensagem, setMensagem] = useState("");

    const handleContatoSubmit = async (e) => {
        e.preventDefault(); // evita recarregar a página

        const novoContato = {
            emailContato: EmailContato,
            nome: Nome,
            telefone: Telefone,
            servico: Servico,
            mensagem: Mensagem
        }
        try {
      const response = await fetch("https://artenza.onrender.com/Email/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoContato)
      });

      if (!response.ok) {
        console.log(novoContato);
        throw new Error("Erro ao criar o contato.");
      }
      setEmailContato("");
      setNome("");
      setMensagem(""); // limpa campo
      setServico("");
      setTelefone("");
    } catch (error) {
      console.error(error);
    }
    }
    const handleNewsletterSubmit = async (e) => {
    e.preventDefault(); // evita recarregar a página

    const novoNewsletter = {
      emailNewsletter: EmailNewsletter
    };
    try {
      const response = await fetch("https://artenza.onrender.com/Email/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoNewsletter)
      });

      if (!response.ok) {
        console.log(novoNewsletter);
        throw new Error("Erro ao criar inscrição na newsletter.");
      }
      setEmailNewsletter(""); // limpa campo
    } catch (error) {
      console.error(error);
    }
  }
    return (
        <div className="container-contact">
            <div className="banner-contact">
                <h2>Fale com a gente.</h2>
            </div>
            <div className="contact-page">
                <div className="contact-info">
                    <div>
                        <h1>Endereço</h1>
                        <p> 102 Rua dos Anjos,<br />
                            34515-228 Belo-Horizonte</p>
                    </div>
                    <div>
                        <h2>Contato</h2>
                        <p>Telefone: (31) 9982-0921<br />
                            Email: artenza.ofc@gmail.com</p>
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

                    <form className='form-contact' onSubmit={handleContatoSubmit}>
                        <div className="contact-hero">
                            <div className="form-group">
                                <label htmlFor="name">Seu Nome *</label>
                                <input type="text" value={Nome} onChange={(e) => setNome(e.target.value)} id="name" placeholder="Ex. Edson Jose" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input type="email" value={EmailContato} onChange={(e) => setEmailContato(e.target.value)} id="email-contato" placeholder="Digite seu email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Telefone *</label>
                                <input type="tel" value={Telefone} onChange={(e) => setTelefone(e.target.value)} id="phone" placeholder="Digite seu número de telefone" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Serviço *</label>
                                <input type="tel" value={Servico} onChange={(e) => setServico(e.target.value)} id="phone" placeholder="Ex: Devolução" required />
                            </div>

                            <div className="form-group textarea">
                                <label htmlFor="message">Sua Mensagem *</label>
                                <textarea value={Mensagem} onChange={(e) => setMensagem(e.target.value)} id="message" placeholder="Digite aqui..." required></textarea>
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

                    <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <div className="div-form">
                            <div className="newsletter-icon">
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <div className="form-group-contact">
                                <input 
                                    type="email"
                                    value={EmailNewsletter} onChange={(e) => setEmailNewsletter(e.target.value)}
                                    id="email-newsletter"
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
