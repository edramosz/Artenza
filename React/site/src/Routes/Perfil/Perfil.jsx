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
    perfilUrl: ''
  });

  // Atualiza backend
  const puted = async (novoUsuario) => {
    try {
      await fetch("https://localhost:7294/Produto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoUsuario)
      });
    } catch (err) {
      console.error("Erro no put do user", err);
    }
  };

  // Upload e atualiza imagem
  const editImage = async (files) => {
    if (!files || files.length === 0) return;

    try {
      const file = files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Artenza");
      formData.append("cloud_name", "drit350g5");

      const res = await fetch("https://api.cloudinary.com/v1_1/drit350g5/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      const novaUrl = data.secure_url;

      // Atualiza estado e localStorage
      const novoUsuario = { ...usuario, perfilUrl: novaUrl };
      setUsuario(novoUsuario);
      localStorage.setItem("perfilUrl", novaUrl);

      // Atualiza backend
      await puted(novoUsuario);

    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
    }
  };

  // Pega info do localStorage e seta no estado
  useEffect(() => {
    const atualizarUsuario = () => {
      const nome = localStorage.getItem("nomeCompletoUser") || '';
      const email = localStorage.getItem("email") || '';
      const dataCadastro = localStorage.getItem("dataCadastro") || '';
      const dataNascimento = localStorage.getItem("dataNascimento") || '';
      const telefone = localStorage.getItem("telefone") || '';
      const perfilUrl = localStorage.getItem("perfilUrl") || '';

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
        nome,
        email,
        dataCadastro: dataCadastroFormatada,
        dataNascimento: dataNascimentoFormatada,
        telefone,
        perfilUrl
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
<<<<<<< HEAD
              <img src="./img/fundo.png" alt="Foto de Perfil" className="perfil-img" />
              <button  className="btn-edit-img">  <FontAwesomeIcon icon={faCamera} /> </button>
            </div>
            <div className="perfil-dados">
=======
              <img
                src={usuario.perfilUrl || "./img/fundo.png"}
                alt="Foto de Perfil"
                className="perfil-img"
              />
              <button
                onClick={() => document.getElementById('inputFile').click()}
                className="btn-edit-img"
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
              <input
                id="inputFile"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => editImage(e.target.files)}
              />
>>>>>>> 8bc804b0883650dc6d9c895e692c38726c38a9c9
            </div>
            <div className="perfil-dados"></div>
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
