import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdicionarEndereco = () => {
  const navigate = useNavigate();

  const [formDataEndereco, setFormDataEndereco] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  });

  const [erro, setErro] = useState("");

  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;
    setFormDataEndereco((prev) => ({ ...prev, [name]: value }));
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
      const response = await fetch("https://artenza.onrender.com/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataEndereco),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error("Erro ao cadastrar endereço: " + err);
      }

      alert("Endereço cadastrado com sucesso!");
      navigate("/AdminEndereco"); // ajuste conforme sua rota
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar endereço: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="form-button-back">Voltar</button>
      <h2 className="form-title">Adicionar Endereço</h2>
      {erro && <p className="form-error">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <label className="form-label">CEP:</label>
        <input className="form-input" type="text" name="cep" value={formData.cep} onChange={handleChange} required />

        <label className="form-label">Rua:</label>
        <input className="form-input" type="text" name="rua" value={formData.rua} onChange={handleChange} required />

        <label className="form-label">Número:</label>
        <input className="form-input" type="text" name="numero" value={formData.numero} onChange={handleChange} required />

        <label className="form-label">Bairro:</label>
        <input className="form-input" type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />

        <label className="form-label">Cidade:</label>
        <input className="form-input" type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />

        <label className="form-label">Estado:</label>
        <input className="form-input" type="text" name="estado" value={formData.estado} onChange={handleChange} required />

        <button type="submit" className="form-button">Adicionar Endereço</button>
      </form>
    </div>

  );
};

export default AdicionarEndereco;
