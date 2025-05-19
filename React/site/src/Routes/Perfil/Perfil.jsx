import React, { useEffect, useState } from 'react';
import NavProfile from './NavProfile';
import './Perfil.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    dataCadastro: '',
    dataNascimento: '',
    telefone: '',
  });

  useEffect(() => {
    const atualizarUsuario = () => {
      const nome = localStorage.getItem("nomeCompletoUser") || '';
      const email = localStorage.getItem("email") || '';
      const dataCadastro = localStorage.getItem("dataCadastro") || '';
      const dataNascimento = localStorage.getItem("dataNascimento") || '';
      const telefone = localStorage.getItem("telefone") || '';

      let dataCadastroFormatada = '';
      if (dataCadastro) {
        const data = new Date(dataCadastro);
        dataCadastroFormatada = data.toLocaleString("pt-BR", {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      }

      let dataNascimentoFormatada = '';
      if (dataNascimento) {
        const nascimento = new Date(dataNascimento);
        if (!isNaN(nascimento.getTime())) {
          dataNascimentoFormatada = nascimento.toLocaleDateString("pt-BR", {
            day: '2-digit', month: '2-digit', year: 'numeric'
          });
        }
      }

      setUsuario({
        nome, email, dataCadastro: dataCadastroFormatada,
        dataNascimento: dataNascimentoFormatada,
        telefone
      });
    };

    atualizarUsuario();
    window.addEventListener("storage", atualizarUsuario);
    return () => window.removeEventListener("storage", atualizarUsuario);
  }, []);

  return (
    <div className="perfil-page-main">
      <NavProfile />
      <div className="perfil-container">
        <div className="perfil-info">
          <div className="perfil-header">
            <div className="perfil-img-wrapper">
              <img src="./img/fundo.png" alt="Foto de Perfil" className="perfil-img" />
              <button className="btn-edit-img">  <FontAwesomeIcon icon={faCamera} /> </button>
            </div>
            <div className="perfil-dados">
            </div>
          </div>

          <div className="perfil-detalhes">
            <h2>Olá, {usuario.nome}</h2>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Telefone:</strong> {usuario.telefone}</p>
            <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento || '---'}</p>
            <p><strong>Data de Cadastro:</strong> {usuario.dataCadastro || '---'}</p>
            <div className="perfil-actions">
              <button className="btn-editar">Editar Informações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
