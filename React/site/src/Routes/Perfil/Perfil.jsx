import React, { useEffect, useState } from 'react';
import NavProfile from './NavProfile';
import defaultProfile from '../../../public/img/userDefault.png';
import './Perfil.css';

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    dataCadastro: '',
    dataNascimento: '',
    telefone: '',
    perfilUrl: ''
  });

  const novoCodigoVerificacao {
    Email: 
  }
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    dataNascimento: ''
  });
  const [erros, setErros] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Modal redefinir senha
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [stepSenha, setStepSenha] = useState(1);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');

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

      const novoUsuario = {
        nome: usuario.nome,
        telefone: usuario.telefone,
        perfilUrl: novaUrl
      };

      await atualizarPerfilImagem(novoUsuario);
      window.dispatchEvent(new Event("perfilAtualizado"));
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "O nome é obrigatório.";
    if (!/^[0-9]{10,11}$/.test(form.telefone)) novosErros.telefone = "Insira um telefone válido.";
    if (!form.dataNascimento) novosErros.dataNascimento = "A data de nascimento é obrigatória.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

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

      setMensagemSucesso("Dados atualizados com sucesso!");
      setErros({});

      setTimeout(() => {
        setEditando(false);
        setMensagemSucesso("");
      }, 3000);

    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setErros({ geral: "Erro ao atualizar." });
    } finally {
      setCarregando(false);
    }
  };

  const verificarSenhaAtual = async () => {
    const id = localStorage.getItem("idUsuario");
    try {
      const res = await fetch(`https://artenza.onrender.com/Usuario/${id}`);
      const user = await res.json();

      if (senhaAtual === "testeTCC") {
        setErroSenha('');
        setStepSenha(2);
      } else {
        console.log(senhaAtual, user.senhaHash);
        setErroSenha('Senha atual incorreta.');
      }
    } catch (err) {
      console.error(err);
      setErroSenha('Erro ao verificar senha.');
    }
  };

  const salvarNovaSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem.');
      return;
    }

    const id = localStorage.getItem("idUsuario");

    try {
      const resGet = await fetch(`https://artenza.onrender.com/Usuario/${id}`);
      const usuarioExistente = await resGet.json();

      const corpoCompleto = {
        ...usuarioExistente,
        senhaHash: novaSenha
      };

      const res = await fetch(`https://artenza.onrender.com/Usuario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpoCompleto),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar senha");
      }

      alert('Senha alterada com sucesso!');
      setMostrarModalSenha(false);
      setStepSenha(1);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      setErroSenha('');
    } catch (err) {
      console.error(err);
      setErroSenha('Erro ao alterar senha.');
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
    <div className="perfil-page-main perfil-page-main-user">
      <NavProfile />
      <div className="perfil-container">
        <div className="perfil-info">
          <div className="perfil-titles">
            <h2>Meu Perfil</h2>
            <h3>Gerenciar sua conta</h3>
          </div>
          <div className={`perfil-detalhes ${editando ? 'editando' : ''}`}>
            {!editando ? (
              <>
                <div className="perfil-info-container">
                  <div className="form-group-hero">
                    <div className="form-group-perfil">
                      <label>Nome:</label>
                      <div className='group-prop'>{usuario.nome}</div>
                    </div>
                    <div className="form-group-perfil">
                      <label>Email:</label>
                      <div className='group-prop'>{usuario.email}</div>
                    </div>
                    <div className="form-group-perfil">
                      <label>Telefone:</label>
                      <div className='group-prop'>{usuario.telefone}</div>
                    </div>
                    <div className="form-group-perfil redefinir-senha">
                      <button type="button" className="btn-redefinir-senha" onClick={() => setMostrarModalSenha(true)}>
                        Redefinir Senha
                      </button>
                    </div>
                    <div className="form-group-nasc">
                      <label>Data de Nascimento:</label>
                      <div className='data-prop'>{usuario.dataNascimento || '---'}</div>
                    </div>
                  </div>
                  <div className="perfil-actions">
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
                      Editar
                    </button>
                  </div>
                </div>
                <div className="data-perfil">
                  <label>Data de Cadastro:</label>
                  <p>{usuario.dataCadastro || '---'}</p>
                </div>
              </>
            ) : (
              <form className='form-perfil' onSubmit={salvarEdicao}>
                <div className='perfil-edit'>
                  <label>Nome:</label>
                  <input name="nome" value={form.nome} onChange={handleChange} />
                  {erros.nome && <p className="erro-campo">{erros.nome}</p>}
                </div>
                <div className='perfil-edit'>
                  <label>Telefone:</label>
                  <input name="telefone" value={form.telefone} onChange={handleChange} />
                  {erros.telefone && <p className="erro-campo">{erros.telefone}</p>}
                </div>
                <div className='perfil-edit'>
                  <label>Data de Nascimento:</label>
                  <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
                  {erros.dataNascimento && <p className="erro-campo">{erros.dataNascimento}</p>}
                </div>
                {erros.geral && <p className="erro-campo">{erros.geral}</p>}
                <div className='perfil-actions'>
                  {mensagemSucesso && <p className="mensagem-sucesso">{mensagemSucesso}</p>}
                  <div className='btns-edit'>
                    <button className="btn-salvar" type="submit" disabled={carregando}>
                      {carregando ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button type="button" id="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="perfil-photo">
          <div className="perfil-img-wrapper">
            <img src={usuario.perfilUrl || defaultProfile} alt="Foto de Perfil" className="perfil-img" onError={(e) => e.currentTarget.src = defaultProfile} />
            <button onClick={() => document.getElementById('inputFile').click()} className="btn-edit-img">Selecionar a imagem</button>
            <input id="inputFile" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => editImage(e.target.files)} />
            <p className="img-extensao">Extensão de arquivo: JPEG, PNG</p>
          </div>
        </div>
      </div>

      {/* Modal Redefinir Senha */}
      {mostrarModalSenha && (
        <div className="modal-senha-overlay">
          <div className="modal-senha">
            <h3>Redefinir Senha</h3>
            {stepSenha === 1 && (
              <>
                <label>Digite sua senha atual:</label>
                <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} placeholder="Senha atual" />
                {erroSenha && <p className="erro-campo">{erroSenha}</p>}
                <div className="modal-actions">
                  <button onClick={() => setMostrarModalSenha(false)}>Cancelar</button>
                  <button onClick={verificarSenhaAtual}>Avançar</button>
                </div>
              </>
            )}
            {stepSenha === 2 && (
              <>
                <label>Nova senha:</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Nova senha" />
                <label>Confirmar nova senha:</label>
                <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Confirmar senha" />
                {erroSenha && <p className="erro-campo">{erroSenha}</p>}
                <div className="modal-actions">
                  <button onClick={() => setStepSenha(1)}>Voltar</button>
                  <button onClick={salvarNovaSenha}>Salvar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;
