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
      const response = await fetch("https://localhost:7294/Endereco", {
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
      <h2>Adicionar Endereço</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label>CEP:</label>
        <input
          type="text"
          name="cep"
          value={formDataEndereco.cep}
          onChange={handleChangeEndereco}
          onBlur={() => buscarEnderecoPorCEP(formDataEndereco.cep)}
          required
        />

        <label>Estado:</label>
        <input
          type="text"
          name="estado"
          value={formDataEndereco.estado}
          onChange={handleChangeEndereco}
          required
        />

        <label>Cidade:</label>
        <input
          type="text"
          name="cidade"
          value={formDataEndereco.cidade}
          onChange={handleChangeEndereco}
          required
        />

        <label>Bairro:</label>
        <input
          type="text"
          name="bairro"
          value={formDataEndereco.bairro}
          onChange={handleChangeEndereco}
          required
        />

        <label>Rua:</label>
        <input
          type="text"
          name="rua"
          value={formDataEndereco.rua}
          onChange={handleChangeEndereco}
          required
        />

        <label>Número:</label>
        <input
          type="text"
          name="numero"
          value={formDataEndereco.numero}
          onChange={handleChangeEndereco}
          required
        />

        <label>Complemento:</label>
        <input
          type="text"
          name="complemento"
          value={formDataEndereco.complemento}
          onChange={handleChangeEndereco}
        />

        <button type="submit">Cadastrar Endereço</button>
      </form>
    </div>
  );
};

export default AdicionarEndereco;
