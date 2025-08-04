import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../NavBar/SideBar";

const AdicionarCupom = () => {
  const [codigo, setCodigo] = useState("");
  const [desconto, setDesconto] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoCupom = {
      Codigo: codigo,               // Maiúscula no início
      Valor: parseFloat(desconto),  // Maiúscula no início
      Ativo: ativo                  // Maiúscula no início
    };

    try {
      const response = await fetch("https://artenza.onrender.com/Cupom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoCupom)
      });

      if (!response.ok) {
        throw new Error("Erro ao criar cupom.");
      }

      setMensagem("Cupom cadastrado com sucesso!");
      setTimeout(() => {
        navigate("/AdminCupons");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar o cupom.");
    }
  };

  return (
    <div className="container-dashboard">
      <SideBar />
      <div className="admin-painel">
        <h2 className="title">Adicionar Novo Cupom</h2>

        {mensagem && (
          <p style={{ color: mensagem.includes("sucesso") ? "green" : "red" }}>
            {mensagem}
          </p>
        )}

        <form className="form-endereco" onSubmit={handleSubmit}>
          <div className="form-group-endereco">
            <label htmlFor="codigo">Código do Cupom:</label>
            <input
              type="text"
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              placeholder="EXEMPLO10"
            />
          </div>

          <div className="form-group-endereco">
            <label htmlFor="desconto">Desconto (%):</label>
            <input
              type="number"
              id="desconto"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              required
              min="1"
              max="100"
              step="0.01"
              placeholder="Ex: 10"
            />
          </div>

          <div className="form-group-endereco">
            <label>Status:</label>
            <div>
              <label>
                <input
                  type="radio"
                  value={true}
                  checked={ativo === true}
                  onChange={() => setAtivo(true)}
                />
                Ativo
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  value={false}
                  checked={ativo === false}
                  onChange={() => setAtivo(false)}
                />
                Inativo
              </label>
            </div>
          </div>

          <button type="submit" className="btn-salvar">
            Salvar Cupom
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdicionarCupom;
