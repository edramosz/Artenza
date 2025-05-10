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
    DataNascimento: "", // Ainda usado no input, mas não será enviado
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

  const [ano, mes, dia] = formData.DataNascimento.split("-");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    setFormDataEndereco((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;

    if (name === "DataNascimento") {
      const [ano, mes, dia] = value.split("-");
      setFormData((prev) => ({
        ...prev,
        DataNascimento: value,
        DiaNascimento: dia,
        MesNascimento: mes,
        AnoNascimento: ano,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
      console.error("Erro ao buscar endereço pelo CEP:", error);
      alert("Erro ao buscar endereço. Tente novamente.");
    }
  };

  const handleSubmitCompleto = async (e) => {
    e.preventDefault();

    console.log("Enviando dados do usuário:", formData);
    console.log("Enviando dados do endereço:", formDataEndereco);

    try {
      // 1. Cadastro do endereço
      const responseEndereco = await fetch("https://localhost:7294/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataEndereco),
      });

      if (!responseEndereco.ok) {
        const error = await responseEndereco.text();
        console.error("Erro no cadastro de endereço:", error);
        throw new Error(`Erro ao cadastrar endereço: ${error}`);
      }

      const endereco = await responseEndereco.json();
      console.log("Endereço cadastrado com sucesso:", endereco);

      // 2. Cadastro do usuário na API
      const responseUsuario = await fetch("https://localhost:7294/Usuario", {
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
        }),
      });

      if (!responseUsuario.ok) {
        const error = await responseUsuario.text();
        console.error("Erro no cadastro de usuário:", error);
        throw new Error(`Erro ao cadastrar usuário: ${error}`);
      }

      const usuario = await responseUsuario.json();
      console.log("Usuário cadastrado com sucesso:", usuario);

      // 3. Cadastro do usuário no Firebase
      await createUserWithEmailAndPassword(auth, formData.Email, formData.SenhaHash);
      console.log("Usuário criado no Firebase.");

      // 4. Login automático no Firebase
      await signInWithEmailAndPassword(auth, formData.Email, formData.SenhaHash);
      console.log("Login automático realizado com sucesso.");

     
      alert("Cadastro completo realizado com sucesso!");

      // 5. Salva dados no localStorage ANTES de redirecionar
      localStorage.setItem("nomeUsuario", formData.NomeCompleto.split(" ")[0]);
      localStorage.setItem("email", formData.Email);
      localStorage.setItem("isAdmin", formData.isAdmin.toString());

      // Força o update da Navbar (caso esteja montada ainda)
      window.dispatchEvent(new Event("storage"));

      alert("Cadastro completo realizado com sucesso!");
      navigate('/')

    } catch (error) {
      console.error("Erro geral:", error?.message || error);
    
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
              id="NomeCompleto"
              placeholder="Digite seu nome completo"
              value={formData.NomeCompleto}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Email">Email:</label>
            <input
              type="email"
              name="Email"
              id="Email"
              placeholder="Digite seu email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Telefone">Telefone:</label>
            <input
              type="text"
              name="Telefone"
              id="Telefone"
              placeholder="Digite seu telefone"
              value={formData.Telefone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="DataNascimento">Data de Nascimento:</label>
            <input
              type="date"
              name="DataNascimento"
              id="DataNascimento"
              value={formData.DataNascimento}
              onChange={handleChangeDate}
            />
          </div>
          <div className="form-group">
            <label htmlFor="SenhaHash">Senha:</label>
            <input
              type="password"
              name="SenhaHash"
              id="SenhaHash"
              placeholder="Crie uma senha segura"
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
              id="CEP"
              placeholder="Digite o CEP"
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
              id="Estado"
              placeholder="Digite o estado"
              value={formDataEndereco.Estado}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Cidade">Cidade:</label>
            <input
              type="text"
              name="Cidade"
              id="Cidade"
              placeholder="Digite a cidade"
              value={formDataEndereco.Cidade}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Bairro">Bairro:</label>
            <input
              type="text"
              name="Bairro"
              id="Bairro"
              placeholder="Digite o bairro"
              value={formDataEndereco.Bairro}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Rua">Rua:</label>
            <input
              type="text"
              name="Rua"
              id="Rua"
              placeholder="Digite a rua"
              value={formDataEndereco.Rua}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Numero">Número:</label>
            <input
              type="text"
              name="Numero"
              id="Numero"
              placeholder="Digite o número"
              value={formDataEndereco.Numero}
              onChange={handleChangeEndereco}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Complemento">Complemento:</label>
            <textarea
              name="Complemento"
              id="Complemento"
              placeholder="Digite o complemento (opcional)"
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
