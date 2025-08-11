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
      navigate("/AdminEndereco");
    } catch (error) {
      console.error(error);
      setErro("Erro ao cadastrar endereço: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="form-button-back">
        Voltar
      </button>
      <h2 className="form-title">Adicionar Endereço</h2>
      {erro && <p className="form-error">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <label className="form-label">CEP:</label>
        <input
          className="form-input"
          type="text"
          name="cep"
          value={formDataEndereco.cep}
          onChange={(e) => {
            handleChangeEndereco(e);
            if (e.target.value.length === 8) {
              buscarEnderecoPorCEP(e.target.value);
            }
          }}
          required
        />

        <label className="form-label">Rua:</label>
        <input
          className="form-input"
          type="text"
          name="rua"
          value={formDataEndereco.rua}
          onChange={handleChangeEndereco}
          required
        />

        <label className="form-label">Número:</label>
        <input
          className="form-input"
          type="text"
          name="numero"
          value={formDataEndereco.numero}
          onChange={handleChangeEndereco}
          required
        />

        <label className="form-label">Bairro:</label>
        <input
          className="form-input"
          type="text"
          name="bairro"
          value={formDataEndereco.bairro}
          onChange={handleChangeEndereco}
          required
        />

        <label className="form-label">Cidade:</label>
        <input
          className="form-input"
          type="text"
          name="cidade"
          value={formDataEndereco.cidade}
          onChange={handleChangeEndereco}
          required
        />

        <label className="form-label">Estado:</label>
        <input
          className="form-input"
          type="text"
          name="estado"
          value={formDataEndereco.estado}
          onChange={handleChangeEndereco}
          required
        />

        <label className="form-label">Complemento:</label>
        <input
          className="form-input"
          type="text"
          name="complemento"
          value={formDataEndereco.complemento}
          onChange={handleChangeEndereco}
        />

        <button type="submit" className="form-button">
          Adicionar Endereço
        </button>
      </form>
    </div>
  );
};

export default AdicionarEndereco;
