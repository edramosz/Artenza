import './Perfil.css'

const Perfil = () => {
    return (
        <div className="container-perfil">
            <div className="user-info">
                <div className="avatar">
                    <img src="./././img/fundo.png" alt="" />
                </div>
                <div className="user-infoo">
                    <p>Thulio jose fenarndes Resende</p>
                    <p>thuliojose@gmail.com</p>
                </div>
                <div className="user-actions">
                    <button>Alterar perfil</button>
                </div>
            </div>
            <div className="tabs">
                <div className="tab-user">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>CEP</th>
                                <th>Estado</th>
                                <th>Cidade</th>                                
                                <th>Rua</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>34515-270</th>
                                <th>Minas-Gerais</th>
                                <th>Sabara</th>
                                <th>beco do colatino</th>
                                <th>editar</th>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div className="tab-endereco">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>CEP</th>
                                <th>Estado</th>
                                <th>Cidade</th>                                
                                <th>Rua</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>34515-270</th>
                                <th>Minas-Gerais</th>
                                <th>Sabara</th>
                                <th>beco do colatino</th>
                                <th>editar</th>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Perfil;