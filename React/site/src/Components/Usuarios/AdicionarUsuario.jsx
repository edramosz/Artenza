import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdicionarUsuario = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    senhaHash: "",
    isAdmin: false,
    dataNascimento: "",
    diaNascimento: "",
    mesNascimento: "",
    anoNascimento: "",
  });

  const [formDataEndereco, setFormDataEndereco] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
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
    const { value } = e.target;
    const [ano, mes, dia] = value.split("-");
    setFormData((prev) => ({
      ...prev,
      dataNascimento: value,
      diaNascimento: dia,
      mesNascimento: mes,
      anoNascimento: ano,
    }));
  };

  const buscarEnderecoPorCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setFormDataEndereco((prev) => ({
        ...prev,
        estado: data.uf,
        cidade: data.localidade,
        bairro: data.bairro,
        rua: data.logradouro,
      }));
    } catch (error) {
      alert("Erro ao buscar CEP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Cadastrar endereço
      const responseEndereco = await fetch("https://localhost:7294/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataEndereco),
      });

      if (!responseEndereco.ok) {
        const err = await responseEndereco.text();
        throw new Error("Erro ao cadastrar endereço: " + err);
      }

      const endereco = await responseEndereco.json();

      // 2. Cadastrar usuário
      const usuario = {
        nomeCompleto: formData.nomeCompleto,
        email: formData.email,
        telefone: formData.telefone,
        idEndereco: endereco.id,
        senhaHash: formData.senhaHash,
        isAdmin: formData.isAdmin,
        diaNascimento: formData.diaNascimento,
        mesNascimento: formData.mesNascimento,
        anoNascimento: formData.anoNascimento,
      };

      const responseUsuario = await fetch("https://localhost:7294/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (!responseUsuario.ok) {
        const errorText = await responseUsuario.text();
        throw new Error("Erro ao cadastrar usuário: " + errorText);
      }
      alert("Usuário cadastrado com sucesso!");
      navigate('/AdminUsuario');
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Adicionar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <h3>Dados do Usuário</h3>
        <label>Nome Completo:</label>
        <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Telefone:</label>
        <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />

        <label>Data de Nascimento:</label>
        <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChangeDate} required />

        <label>Senha:</label>
        <input type="password" name="senhaHash" value={formData.senhaHash} onChange={handleChange} required />

        <label>
          <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={(e) =>
            setFormData((prev) => ({ ...prev, isAdmin: e.target.checked }))
          } />
          Usuário administrador
        </label>

        <h3>Endereço</h3>
        <label>CEP:</label>
        <input type="text" name="cep" value={formDataEndereco.cep} onChange={handleChangeEndereco} onBlur={() => buscarEnderecoPorCEP(formDataEndereco.cep)} required />

        <label>Estado:</label>
        <input type="text" name="estado" value={formDataEndereco.estado} onChange={handleChangeEndereco} required />

        <label>Cidade:</label>
        <input type="text" name="cidade" value={formDataEndereco.cidade} onChange={handleChangeEndereco} required />

        <label>Bairro:</label>
        <input type="text" name="bairro" value={formDataEndereco.bairro} onChange={handleChangeEndereco} required />

        <label>Rua:</label>
        <input type="text" name="rua" value={formDataEndereco.rua} onChange={handleChangeEndereco} required />

        <label>Número:</label>
        <input type="text" name="numero" value={formDataEndereco.numero} onChange={handleChangeEndereco} required />

        <label>Complemento:</label>
        <input type="text" name="complemento" value={formDataEndereco.complemento} onChange={handleChangeEndereco} />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default AdicionarUsuario;
