import React, { useEffect, useState } from 'react';
import NavProfile from './NavProfile';
import './Perfil.css';

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    dataCadastro: '',
    dataNascimento: ''
  });


  useEffect(() => {
    const atualizarUsuario = () => {
      const nome = localStorage.getItem("nomeCompletoUser") || '';
      const email = localStorage.getItem("email") || '';
      const dataCadastro = localStorage.getItem("dataCadastro") || '';
      const dataNascimento = localStorage.getItem("dataNascimento") || '';


      // Se a data de cadastro for válida, formatamos ela
      let dataCadastroFormatada = '';
      if (dataCadastro) {
        const data = new Date(dataCadastro);
        dataCadastroFormatada = data.toLocaleString("pt-BR", {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }

      let dataNascimentoFormatada = '';
      if (dataNascimento) {
        const nascimento = new Date(dataNascimento); // "1988-03-02"
        if (!isNaN(nascimento.getTime())) {
          dataNascimentoFormatada = nascimento.toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        } else {
          console.warn("Data de nascimento inválida:", dataNascimento);
        }
      }

      setUsuario({ nome, email, dataCadastro: dataCadastroFormatada, dataNascimento: dataNascimentoFormatada });
    };

    // Atualiza quando o componente montar
    atualizarUsuario();

    // Atualiza quando o localStorage mudar (evento disparado no login)
    window.addEventListener("storage", atualizarUsuario);

    return () => {
      window.removeEventListener("storage", atualizarUsuario);
    };
  }, []);

  return (
    <div className="perfil-page">
      <NavProfile />
      <div className="perfil-info">
        <h2>Informações do Usuário</h2>
        <p><strong>Nome:</strong> {usuario.nome}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Data de Cadastro:</strong> {usuario.dataCadastro || 'Carregando...'}</p>
        <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento || 'Carregando...'}</p>
      </div>
    </div>
  );
};

export default Perfil;
