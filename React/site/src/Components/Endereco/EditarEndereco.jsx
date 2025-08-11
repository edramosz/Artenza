import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarEndereco = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  });

  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchEndereco = async () => {
      try {
        const response = await fetch(`https://artenza.onrender.com/Endereco/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar endereço.");

        const data = await response.json();

        setFormData({
          cep: data.cep || "",
          estado: data.estado || "",
          cidade: data.cidade || "",
          bairro: data.bairro || "",
          rua: data.rua || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
        });
      } catch (error) {
        setErro("Erro ao carregar dados do endereço.");
        console.error(error);
      }
    };

    fetchEndereco();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...formData }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      alert("Endereço atualizado com sucesso!");
      navigate("/AdminEndereco");
    } catch (error) {
      setErro("Erro ao atualizar endereço. " + error.message);
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="form-button-back">Voltar</button>
      <h2 className="form-title">Editar Endereço</h2>
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

        <button type="submit" className="form-button">Atualizar Endereço</button>
      </form>
    </div>

  );
};

export default EditarEndereco;
