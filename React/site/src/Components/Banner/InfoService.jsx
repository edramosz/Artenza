import './InfoService.css'

const InfoService = () => {

    return (
        <div className="container-service">
            <div className="cards">

                <div className="card">
                    <div className="icon">
                        <i className="fa-solid fa-truck-fast"></i>
                    </div>
                    <div className="texts">
                        <h2>Frete Grátis</h2>
                        <p>Para todos produtos acima de R$ 100,00</p>
                    </div>
                </div>
                <div className="card">
                    <div className="icon">
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                    </div>
                    <div className="texts">
                        <h2>Devoluções em 30 dias</h2>
                        <p>Para produtos do site</p>
                    </div>
                </div>
                <div className="card">
                    <div className="icon">
                       <i className="fa-solid fa-wallet"></i>
                    </div>
                    <div className="texts">
                        <h2>Pagamento Seguro</h2>
                        <p>Cartoes de pagamentos aceitos</p>
                    </div>
                </div>
                <div className="card">
                    <div className="icon">
                       <i className="fa-solid fa-headset"></i>
                    </div>
                    <div className="texts">
                        <h2>Suporte ao Cliente</h2>
                        <p>Atendimento via WhatsApp e Email</p>
                    </div>
                </div>
                <div className="card">
                    <div className="icon">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div className="texts">
                        <h2>Compra Garantida</h2>
                        <p>Segurança e reembolso</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default InfoService