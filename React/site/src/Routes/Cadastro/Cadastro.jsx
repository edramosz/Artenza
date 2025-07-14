import React, { useState } from "react";
import './CadastroForm.css';
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";

const Cadastro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    NomeCompleto: "",
    Email: "",
    Telefone: "",
    SenhaHash: "",
    IdEndereco: "",
    isAdmin: false,
    DiaNascimento: "",
    MesNascimento: "",
    AnoNascimento: "",
    DataNascimento: "",
    PerfilUrl: "",
  });

  const [formDataEndereco, setFormDataEndereco] = useState({
    CEP: "",
    Estado: "",
    Cidade: "",
    Bairro: "",
    Rua: "",
    Numero: "",
    Complemento: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    setFormDataEndereco((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDate = (e) => {
    const value = e.target.value;

    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        DataNascimento: "",
        DiaNascimento: "",
        MesNascimento: "",
        AnoNascimento: "",
      }));
      return;
    }

    const [ano, mes, dia] = value.split("-");
    setFormData((prev) => ({
      ...prev,
      DataNascimento: value,
      DiaNascimento: parseInt(dia, 10),
      MesNascimento: parseInt(mes, 10),
      AnoNascimento: parseInt(ano, 10),
    }));
  };

  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado. Verifique e tente novamente.");
        return;
      }

      setFormDataEndereco((prev) => ({
        ...prev,
        Estado: data.uf,
        Cidade: data.localidade,
        Bairro: data.bairro,
        Rua: data.logradouro,
      }));
    } catch (error) {
      alert("Erro ao buscar endereço. Tente novamente.");
    }
  };

const handleSubmitCompleto = async (e) => {
  e.preventDefault();

  if (!formData.DiaNascimento || !formData.MesNascimento || !formData.AnoNascimento) {
    alert("Por favor, selecione uma data de nascimento válida.");
    return;
  }

  try {
    // 1. Criar usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.Email,
      formData.SenhaHash
    );
    const firebaseUserId = userCredential.user.uid;

    // 2. Criar endereço com UsuarioId
    const responseEndereco = await fetch("https://localhost:7294/Endereco", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formDataEndereco,
        UsuarioId: firebaseUserId, //necessário para o backend
      }),
    });

    if (!responseEndereco.ok) {
      const error = await responseEndereco.text();
      throw new Error(`Erro ao cadastrar endereço: ${error}`);
    }

    try {
      const responseEndereco = await fetch("https://artenza.onrender.com/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataEndereco),
      });

    // 3. Criar usuário no backend



      const endereco = await responseEndereco.json();

      const responseUsuario = await fetch("https://artenza.onrender.com/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NomeCompleto: formData.NomeCompleto,
          Email: formData.Email,
          Telefone: formData.Telefone,
          SenhaHash: formData.SenhaHash,
          IdEndereco: endereco.id,
          isAdmin: formData.isAdmin,
          DiaNascimento: formData.DiaNascimento,
          MesNascimento: formData.MesNascimento,
          AnoNascimento: formData.AnoNascimento,
          PerfilUrl: formData.PerfilUrl || "https://exemplo.com/default-profile.png",
        }),
      });

      if (!responseUsuario.ok) {
        const error = await responseUsuario.text();
        throw new Error(`Erro ao cadastrar usuário: ${error}`);
      }

      await createUserWithEmailAndPassword(auth, formData.Email, formData.SenhaHash);
      await signInWithEmailAndPassword(auth, formData.Email, formData.SenhaHash);

      alert("Cadastro completo realizado com sucesso!");

      localStorage.setItem("nomeUsuario", formData.NomeCompleto);
      localStorage.setItem("email", formData.Email);
      localStorage.setItem("isAdmin", formData.isAdmin.toString());
      localStorage.setItem("perfilUrl", formData.PerfilUrl || "");
      window.dispatchEvent(new Event("storage"));

      setFormData({
        NomeCompleto: "",
        Email: "",
        Telefone: "",
        SenhaHash: "",
        IdEndereco: "",
        isAdmin: false,
        DiaNascimento: "",
        MesNascimento: "",
        AnoNascimento: "",
        DataNascimento: "",
        PerfilUrl: "",
      });

      setFormDataEndereco({
        CEP: "",
        Estado: "",
        Cidade: "",
        Bairro: "",
        Rua: "",
        Numero: "",
        Complemento: "",
      });

      navigate('/');
    } catch (error) {
      console.error("Erro:", error.message || error);
      if (error.code === "auth/email-already-in-use") {
        alert("Este email já está em uso. Tente outro ou recupere sua senha.");
      } else {
        alert("Erro ao realizar cadastro completo.\n" + (error?.message || error));
      }
    }

    // 4. Autenticar usuário após cadastro
    await signInWithEmailAndPassword(auth, formData.Email, formData.SenhaHash);

    alert("Cadastro completo realizado com sucesso!");

    // 5. Salvar dados no localStorage
    localStorage.setItem("nomeUsuario", formData.NomeCompleto);
    localStorage.setItem("email", formData.Email);
    localStorage.setItem("isAdmin", formData.isAdmin.toString());
    localStorage.setItem("perfilUrl", formData.PerfilUrl || "");
    window.dispatchEvent(new Event("storage"));

    // 6. Limpar formulários
    setFormData({
      NomeCompleto: "",
      Email: "",
      Telefone: "",
      SenhaHash: "",
      IdEndereco: "",
      isAdmin: false,
      DiaNascimento: "",
      MesNascimento: "",
      AnoNascimento: "",
      DataNascimento: "",
      PerfilUrl: "",
    });

    setFormDataEndereco({
      CEP: "",
      Estado: "",
      Cidade: "",
      Bairro: "",
      Rua: "",
      Numero: "",
      Complemento: "",
    });

    navigate('/');
  } catch (error) {
    console.error("Erro:", error.message || error);
    if (error.code === "auth/email-already-in-use") {
      alert("Este email já está em uso. Tente outro ou recupere sua senha.");
    } else {
      alert("Erro ao realizar cadastro completo.\n" + (error?.message || error));
    }
  }
};


  return (
    <div className="form-container">
      <h2 className="title">Cadastre-se</h2>
      <form onSubmit={handleSubmitCompleto} className="form">
        <div className="form-user">
          <div className="form-group">
            <label htmlFor="NomeCompleto">Nome Completo:</label>
            <input
              type="text"
              name="NomeCompleto"
              value={formData.NomeCompleto}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Telefone">Telefone:</label>
            <input
              type="text"
              name="Telefone"
              value={formData.Telefone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="DataNascimento">Data de Nascimento:</label>
            <input
              type="date"
              name="DataNascimento"
              value={formData.DataNascimento}
              onChange={handleChangeDate}
            />
          </div>
          <div className="form-group">
            <label htmlFor="SenhaHash">Senha:</label>
            <input
              type="password"
              name="SenhaHash"
              value={formData.SenhaHash}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-address">
          <div className="form-group">
            <label htmlFor="CEP">CEP:</label>
            <input
              type="text"
              name="CEP"
              value={formDataEndereco.CEP}
              onChange={handleChangeEndereco}
              onBlur={() => buscarEnderecoPorCEP(formDataEndereco.CEP)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Estado">Estado:</label>
            <input
              type="text"
              name="Estado"
              value={formDataEndereco.Estado}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Cidade">Cidade:</label>
            <input
              type="text"
              name="Cidade"
              value={formDataEndereco.Cidade}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Bairro">Bairro:</label>
            <input
              type="text"
              name="Bairro"
              value={formDataEndereco.Bairro}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Rua">Rua:</label>
            <input
              type="text"
              name="Rua"
              value={formDataEndereco.Rua}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Numero">Número:</label>
            <input
              type="text"
              name="Numero"
              value={formDataEndereco.Numero}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Complemento">Complemento:</label>
            <textarea
              name="Complemento"
              value={formDataEndereco.Complemento}
              onChange={handleChangeEndereco}
            />
          </div>
        </div>

        <div className="form-group">
          <input type="submit" value="Cadastrar-se" className="form-button" />
        </div>
      </form>
    </div>
  );
};

export default Cadastro;
