import React from 'react'
import './Sobre.css'
const Sobre = () => {
    return (
        <div className="sobre-container">
            <div className="sobre-hero">
                <div className="banner-sobre">
                    <div className="banner-sobre-content">
                        <h2>Descubra a incomparável <span>elegância da Artenza</span></h2>
                    </div>
                </div>
                <div className="sobre-cards">
                    <div className="card-sobre">  
                        <div className="card-border"></div>                      
                        <div className="card-top">
                            <span>1</span>
                            <h2>Quem somos</h2>
                        </div>
                        <p>
                            A Artenza é um e-commerce criado para quem busca estilo, conforto e autenticidade. Nosso objetivo é oferecer peças exclusivas com qualidade e bom gosto. Cada produto é selecionado com cuidado para compor looks únicos e expressivos.
                        </p>
                    </div>

                    <div className="card-sobre">
                        <div className="card-border"></div>  
                        <div className="card-top">
                            <span>2</span>
                            <h2>Nossa missão</h2>
                        </div>
                        <p>
                            Levar moda acessível e com personalidade para todos os estilos. Trabalhamos com transparência, inovação e compromisso com nossos clientes, sempre valorizando o design, a durabilidade e a experiência de compra online.
                        </p>
                    </div>
                </div>
                <div className="secao-sobre">
                    <div className="img-secao"></div>
                    <div className="secao-hero-sobre">
                        <div className="text-secao">
                            <label className='border-label'></label>
                            <p>Sobre-nos</p>
                        </div>
                        <div className="title-secao">
                            <h2>Explore nossas coleções</h2>
                            <p>
                                Se inspire com nossas peças exclusivas e monte looks que refletem sua personalidade. Roupas femininas, masculinas e acessórios com qualidade e atitude para o dia a dia.
                            </p>
                        </div>
                        <div className="secao-cards">
                            <div className="card-secao">
                                <h2>70+</h2>
                                <p>Vendas Realizadas</p>
                            </div>
                            <div className="card-secao">
                                <h2>100+</h2>
                                <p>Clientes Satisfeitos</p>
                            </div>
                            <div className="card-secao">
                                <h2>89%</h2>
                                <p>Avaliação Geral</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="details-hero">
                    <details>
                        <summary>
                            Sede
                            <span class="icon-button"></span>
                        </summary>
                        <div className='detail-content'>
                            <p>
                                Nossa sede está situada em Belo Horizonte - MG, onde operamos toda a parte administrativa, logística e criativa da Artenza. É nesse espaço que ideias se transformam em coleções que representam nossa essência.
                            </p>
                            <p>
                                Aqui também está localizada nossa equipe de atendimento, pronta para oferecer suporte eficiente e humanizado. A estrutura foi pensada para garantir agilidade e qualidade em todas as etapas do nosso serviço.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>
                            Localização
                            <span class="icon-button"></span>
                        </summary>
                        <div className='detail-content'>
                            <p>
                                Nosso endereço físico é: Rua das Artes, 123 – Bairro Criativo, Belo Horizonte - MG, CEP 31000-000. Estamos em uma região de fácil acesso, próxima ao Shopping Central e pontos de transporte público.
                            </p>
                            <p>
                                Embora a Artenza funcione majoritariamente online, nosso espaço físico é o coração da operação, onde cuidamos de estoque, logística e desenvolvimento de novas coleções. Visitas são realizadas somente com agendamento.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>
                            Atendimento
                            <span class="icon-button"></span>
                        </summary>
                        <div className='detail-content'>
                            <p>
                                Nossa central de atendimento funciona de segunda a sexta-feira, das 08h às 18h, para tirar dúvidas, resolver problemas ou orientar sobre pedidos. Prezamos por um contato rápido e direto com nossos clientes.
                            </p>
                            <p>
                                Você pode falar com a gente pelo WhatsApp, e-mail ou mensagens nas redes sociais. Nossa equipe é treinada para oferecer soluções com empatia, respeito e foco total na sua experiência de compra.
                            </p>
                        </div>
                    </details>

                    <details>
                        <summary>
                            Entregas e prazos
                            <span class="icon-button"></span>
                        </summary>
                        <div className='detail-content'>
                            <p>
                                Trabalhamos com as principais transportadoras do Brasil para garantir que seus pedidos cheguem com rapidez e segurança. O prazo de entrega pode variar entre 3 e 7 dias úteis, dependendo da região.
                            </p>
                            <p>
                                Assim que seu pedido for enviado, você receberá um código de rastreio para acompanhar cada etapa do processo. Também enviamos atualizações por e-mail e WhatsApp para manter você sempre informado.
                            </p>
                        </div>
                    </details>

                </div>
            </div>
        </div>
    )
}

export default Sobre
