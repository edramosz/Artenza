import React, { useState } from "react";

const AdicionarUsuario = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    idEndereco: null,
    senhaHash: "",
    isAdmin: false,
    dataNascimento: "",
    diaNascimento: "",
    mesNascimento: "",
    anoNascimento: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      telefone: formData.telefone,      
      IdEndereco: null,
      senhaHash: formData.senhaHash,
      isAdmin: formData.isAdmin,
      diaNascimento: formData.diaNascimento,
      mesNascimento: formData.mesNascimento,
      anoNascimento: formData.anoNascimento,
    };

    try {
      const response = await fetch("https://localhost:7294/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Erro ao cadastrar usuário: " + errorText);
      }

      alert("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="form-container">
      <h2>Adicionar Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome Completo:</label>
        <input
          type="text"
          name="nomeCompleto"
          value={formData.nomeCompleto}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Telefone:</label>
        <input
          type="text"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          required
        />

        <label>Data de Nascimento:</label>
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChangeDate}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          name="senhaHash"
          value={formData.senhaHash}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isAdmin: e.target.checked,
              }))
            }
          />
          Usuário administrador
        </label>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default AdicionarUsuario;
