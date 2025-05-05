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
        const response = await fetch(`https://localhost:7294/Endereco/${id}`);
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
      const response = await fetch(`https://localhost:7294/Endereco/${id}`, {
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
    <div className="editar-endereco">
      <button onClick={() => navigate(-1)}>Voltar</button>
      <h2>Editar Endereço</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label>CEP:</label>
        <input
          type="text"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          required
        />

        <label>Estado:</label>
        <input
          type="text"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
        />

        <label>Cidade:</label>
        <input
          type="text"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          required
        />

        <label>Bairro:</label>
        <input
          type="text"
          name="bairro"
          value={formData.bairro}
          onChange={handleChange}
          required
        />

        <label>Rua:</label>
        <input
          type="text"
          name="rua"
          value={formData.rua}
          onChange={handleChange}
          required
        />

        <label>Número:</label>
        <input
          type="text"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          required
        />

        <label>Complemento:</label>
        <input
          type="text"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
        />

        <button type="submit">Atualizar Endereço</button>
      </form>
    </div>
  );
};

export default EditarEndereco;
