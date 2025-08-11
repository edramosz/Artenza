import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID do usuário

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

  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`https://localhost:7294/Usuario/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar usuário");

        const data = await response.json();

        setFormData({
          nomeCompleto: data.nomeCompleto,
          email: data.email,
          telefone: data.telefone,
          senhaHash: "", // nunca preencha a senha automaticamente
          isAdmin: data.isAdmin,
          dataNascimento: `${data.anoNascimento}-${String(data.mesNascimento).padStart(2, "0")}-${String(data.diaNascimento).padStart(2, "0")}`,
          diaNascimento: data.diaNascimento,
          mesNascimento: data.mesNascimento,
          anoNascimento: data.anoNascimento,
        });
      } catch (error) {
        setErro("Erro ao carregar dados do usuário.");
        console.error(error);
      }
    };

    fetchUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e) => {
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

    const usuarioAtualizado = {
      id,
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      telefone: formData.telefone,
      senhaHash: formData.senhaHash,
      isAdmin: formData.isAdmin,
      diaNascimento: formData.diaNascimento,
      mesNascimento: formData.mesNascimento,
      anoNascimento: formData.anoNascimento,
    };

    try {
      const response = await fetch(`https://localhost:7294/Usuario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioAtualizado),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      alert("Usuário atualizado com sucesso!");
      navigate("/AdminUsuario");
    } catch (error) {
      setErro("Erro ao atualizar usuário. " + error.message);
    }
  };

  return (
    <div className="form-container">
      <button className="form-button-back" onClick={() => navigate(-1)}>Voltar</button>
      <h2 className="form-title">Editar Usuário</h2>
      {erro && <p className="form-error">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <label className="form-label">Nome Completo:</label>
        <input className="form-input" type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} required />

        <label className="form-label">Email:</label>
        <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label className="form-label">Telefone:</label>
        <input className="form-input" type="text" name="telefone" value={formData.telefone} onChange={handleChange} required />

        <label className="form-label">Data de Nascimento:</label>
        <input className="form-input" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleDateChange} required />

        <label className="form-label">Senha (opcional):</label>
        <input className="form-input" type="password" name="senhaHash" value={formData.senhaHash} onChange={handleChange} />

        <label className="form-label form-checkbox">
          <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
          Usuário administrador
        </label>

        <button className="form-button" type="submit">Atualizar Usuário</button>
      </form>
    </div>

  );
};

export default EditarUsuario;
