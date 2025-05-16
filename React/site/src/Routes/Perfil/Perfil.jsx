import { useState } from 'react';
import './Perfil.css';

const Perfil = () => {
  const [tab, setTab] = useState('info');

  return (
    <div className="container-perfil">
      <aside className="sidebar">
        <img src="./././img/fundo.png" alt="Foto de perfil" className="avatar" />
        <h2>Thulio Resende</h2>
        <p>thuliojose@gmail.com</p>
        <button className="edit-button">Alterar perfil</button>
        <div className="tab-buttons">
          <button onClick={() => setTab('info')} className={tab === 'info' ? 'active' : ''}>Informações</button>
          <button onClick={() => setTab('endereco')} className={tab === 'endereco' ? 'active' : ''}>Endereço</button>
          <button onClick={() => setTab('seguranca')} className={tab === 'seguranca' ? 'active' : ''}>Segurança</button>
        </div>
      </aside>

      <main className="content">
        {tab === 'info' && (
          <section>
            <h3>Informações Pessoais</h3>
            <p><strong>Nome:</strong> Thulio Resende</p>
            <p><strong>Email:</strong> thuliojose@gmail.com</p>
            <p><strong>Telefone:</strong> (31) 99999-9999</p>
          </section>
        )}

        {tab === 'endereco' && (
          <section>
            <h3>Endereço</h3>
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
                  <td>34515-270</td>
                  <td>Minas Gerais</td>
                  <td>Sabará</td>
                  <td>Beco do Colatino</td>
                  <td className="acao">Editar</td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {tab === 'seguranca' && (
          <section>
            <h3>Segurança</h3>
            <p>Último login: 15/05/2025 às 18:00</p>
            <p>Dispositivo: Chrome - Windows 10</p>
            <button className="edit-button">Alterar Senha</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default Perfil;
