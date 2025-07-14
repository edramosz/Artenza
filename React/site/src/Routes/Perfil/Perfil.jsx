import React, { useEffect, useState } from 'react';
import NavProfile from './NavProfile';
import './Perfil.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const Perfil = () => {
  // Estado que guarda os dados do usuário exibidos no perfil
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    dataCadastro: '',
    dataNascimento: '',
    telefone: '',
    perfilUrl: ''
  });

  // Estado para controlar se o perfil está em modo de edição ou visualização
  const [editando, setEditando] = useState(false);

  // Estado para controlar os valores do formulário de edição
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    dataNascimento: ''
  });

  // Estado para mensagens de erro de validação
  const [erros, setErros] = useState({});

  // Estado para mensagem de sucesso após salvar
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  // Estado para controle de carregamento durante requisições
  const [carregando, setCarregando] = useState(false);

  // Função para atualizar somente a imagem do perfil via PATCH na API
  const atualizarPerfilImagem = async (novoUsuario) => {
    const id = localStorage.getItem("idUsuario");

    try {
      const response = await fetch(`https://artenza.onrender.com/Usuario/${id}/perfil`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perfilUrl: novoUsuario.perfilUrl }),
      });

      if (!response.ok) {
        const erro = await response.text();
        console.error("Erro ao atualizar imagem de perfil:", erro);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro ao fazer PATCH do perfil:", error);
      return false;
    }
  };

  // Função para tratar a edição da imagem do perfil: faz upload na Cloudinary e atualiza a URL no backend
  const editImage = async (files) => {
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Artenza");
      formData.append("cloud_name", "drit350g5");

      // Envia a imagem para Cloudinary
      const res = await fetch("https://api.cloudinary.com/v1_1/drit350g5/image/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      const novaUrl = data.secure_url;

      // Prepara o objeto usuário para atualizar somente a imagem
      const novoUsuario = {
        nome: usuario.nome,
        telefone: usuario.telefone,
        perfilUrl: novaUrl
      };

      // Atualiza a imagem no backend
      await atualizarPerfilImagem(novoUsuario);

      // Dispara um evento customizado para recarregar os dados do perfil após atualização
      window.dispatchEvent(new Event("perfilAtualizado"));
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
    }
  };

  // Atualiza o estado do formulário ao digitar nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Valida os campos do formulário
  const validarCampos = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "O nome é obrigatório.";
    if (!/^[0-9]{10,11}$/.test(form.telefone)) novosErros.telefone = "Insira um telefone válido.";
    if (!form.dataNascimento) novosErros.dataNascimento = "A data de nascimento é obrigatória.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para salvar as alterações feitas no perfil
  const salvarEdicao = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;
    setCarregando(true);
    const id = localStorage.getItem("idUsuario");

    try {
      const resGet = await fetch(`https://artenza.onrender.com/Usuario/${id}`);
      const usuarioExistente = await resGet.json();

      const [ano, mes, dia] = form.dataNascimento.split('-');

      const corpoCompleto = {
        id: id,
        nomeCompleto: form.nome,
        telefone: form.telefone,
        email: usuarioExistente.email,
        senhaHash: usuarioExistente.senhaHash,
        idEndereco: usuarioExistente.idEndereco,
        isAdmin: usuarioExistente.isAdmin,
        dataCadastro: usuarioExistente.dataCadastro,
        diaNascimento: parseInt(dia, 10),
        mesNascimento: parseInt(mes, 10),
        anoNascimento: parseInt(ano, 10),
        perfilUrl: usuarioExistente.perfilUrl
      };

      const response = await fetch(`https://artenza.onrender.com/Usuario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpoCompleto),
      });

      if (!response.ok) {
        const erro = await response.text();
        setErros({ geral: "Erro ao atualizar usuário: " + erro });
        setCarregando(false);
        return;
      }

      setUsuario((prev) => ({
        ...prev,
        nome: form.nome,
        telefone: form.telefone,
        dataNascimento: new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR")
      }));

      setEditando(false);
      setMensagemSucesso("Dados atualizados com sucesso!");
      setErros({});
      setTimeout(() => setMensagemSucesso(""), 4000);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setErros({ geral: "Erro ao atualizar." });
    } finally {
      setCarregando(false);
    }
  };

  const formatarDataParaInput = (dataStr) => {
    if (!dataStr || dataStr.includes("Invalid")) return '';
    const partes = dataStr.split('/');
    if (partes.length !== 3) return '';
    const [dia, mes, ano] = partes;
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  };

  useEffect(() => {
    const carregarUsuarioAPI = async () => {
      const id = localStorage.getItem("idUsuario");
      try {
        const response = await fetch(`https://artenza.onrender.com/Usuario/${id}`);
        const user = await response.json();

        const dataNascimento = new Date(user.anoNascimento, user.mesNascimento - 1, user.diaNascimento);
        const dataCadastro = new Date(user.dataCadastro);

        setUsuario({
          nome: user.nomeCompleto,
          email: user.email,
          telefone: user.telefone,
          perfilUrl: user.perfilUrl,
          dataCadastro: dataCadastro.toLocaleString("pt-BR", {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          dataNascimento: dataNascimento.toLocaleDateString("pt-BR")
        });

        setForm({
          nome: user.nomeCompleto,
          telefone: user.telefone,
          dataNascimento: `${user.anoNascimento}-${String(user.mesNascimento).padStart(2, '0')}-${String(user.diaNascimento).padStart(2, '0')}`
        });
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    carregarUsuarioAPI();
    window.addEventListener("perfilAtualizado", carregarUsuarioAPI);
    return () => window.removeEventListener("perfilAtualizado", carregarUsuarioAPI);
  }, []);

  return (
    <div className="perfil-page-main">
      <NavProfile />
      <div className="perfil-container">
        <div className="perfil-info">
          <div className="perfil-header">
            <div className="perfil-img-wrapper">
              <img
                src={usuario.perfilUrl || "./img/userDefault.png"}
                alt="Foto de Perfil"
                className="perfil-img"
              />
              <button
                onClick={() => document.getElementById('inputFile').click()}
                className="btn-edit-img"
                title="Alterar foto de perfil"
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
            </div>
          </div>

          <div className={`perfil-detalhes ${editando ? 'editando' : ''}`}>
            <h2>Olá, {usuario.nome}</h2>

            {editando ? (
              <form className='form-perfil' onSubmit={salvarEdicao}>
                <div className='perfil-edit'>
                  <label>Nome:</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder='Altere seu nome'
                  />
                  {erros.nome && <p className="erro-campo">{erros.nome}</p>}
                </div>

                <div className='perfil-edit'>
                  <label>Telefone:</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder='Altere seu telefone'
                  />
                  {erros.telefone && <p className="erro-campo">{erros.telefone}</p>}
                </div>

                <div className='perfil-edit'>
                  <label>Data de Nascimento:</label>
                  <input
                    name="dataNascimento"
                    type="date"
                    value={form.dataNascimento}
                    onChange={handleChange}
                  />
                  {erros.dataNascimento && <p className="erro-campo">{erros.dataNascimento}</p>}
                </div>

                {erros.geral && <p className="erro-campo">{erros.geral}</p>}
              </form>
            ) : (
              <>              
                <p><strong>Email:</strong> {usuario.email}</p>
                <p><strong>Telefone:</strong> {usuario.telefone}</p>
                <p><strong>Data de Nascimento:</strong> {usuario.dataNascimento || '---'}</p>
                <p><strong>Data de Cadastro:</strong> {usuario.dataCadastro || '---'}</p>
              </>
            )}

            <div className="perfil-actions">
              {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}

              {editando ? (
                <div className='btns-edit'>
                  <button
                    className="btn-salvar"
                    onClick={salvarEdicao}
                    disabled={carregando}
                  >
                    {carregando ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button id="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
                </div>
              ) : (
                <button
                  className="btn-editar"
                  onClick={() => {
                    setForm({
                      nome: usuario.nome,
                      telefone: usuario.telefone,
                      dataNascimento: formatarDataParaInput(usuario.dataNascimento)
                    });
                    setEditando(true);
                  }}
                >
                  Editar Informações
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Perfil;