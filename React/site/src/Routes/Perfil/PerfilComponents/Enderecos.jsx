import React, { useEffect, useState } from "react";
import './Enderecos.css';

export default function Enderecos() {
  const [enderecos, setEnderecos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [enderecoAtivoId, setEnderecoAtivoId] = useState("");

  const usuarioId = localStorage.getItem("idUsuario");

  useEffect(() => {
    fetchEnderecos();
  }, []);

  const fetchEnderecos = async () => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/por-usuario/${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao buscar endereços");
      const data = await response.json();
      setEnderecos(data);

      const ativo = data.find(e => e.ativo);
      if (ativo) setEnderecoAtivoId(ativo.id);

    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    const novoEndereco = {
      usuarioId,
      cep,
      estado,
      cidade,
      bairro,
      rua,
      numero,
      complemento,
      ativo: false
    };

    try {
      const response = await fetch("https://artenza.onrender.com/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEndereco),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao salvar: ${response.status} - ${errorText}`);
      }

      const enderecoCriado = await response.json();
      setEnderecos([...enderecos, enderecoCriado]);
      setShowForm(false);

      setCep(""); setEstado(""); setCidade(""); setBairro("");
      setRua(""); setNumero(""); setComplemento("");

    } catch (error) {
      console.error("Erro ao salvar endereço:", error.message);
      alert("Erro ao salvar. Verifique os campos.");
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este endereço?")) return;

    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir");

      setEnderecos(enderecos.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Erro ao excluir endereço:", error.message);
    }
  };

  const handleSelecionarAtivo = async (id) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/ativar/${id}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao ativar endereço: ${errorText}`);
      }

      // Atualiza lista
      const novaLista = enderecos.map((end) =>
        end.id === id ? { ...end, ativo: true } : { ...end, ativo: false }
      );

      setEnderecos(novaLista);
      setEnderecoAtivoId(id);
    } catch (error) {
      console.error("Erro ao marcar como ativo:", error.message);
    }
  };

  return (
    <div className="enderecos-container">
      <h2>Meus Endereços</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancelar" : "Adicionar Novo Endereço"}
      </button>

      {showForm && (
        <form onSubmit={handleSalvar} className="endereco-form">
          <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" required />
          <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" required />
          <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" required />
          <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" required />
          <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" required />
          <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" required />
          <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Complemento" />
          <button type="submit">Salvar</button>
        </form>
      )}

      <div className="lista-enderecos">
        {enderecos.length === 0 ? (
          <p>Nenhum endereço cadastrado.</p>
        ) : (
          enderecos.map((endereco) => (
            <div key={endereco.id} className={`endereco-card ${endereco.ativo ? "ativo" : ""}`}>
              <label className="radio-endereco">
                <input
                  type="radio"
                  name="enderecoAtivo"
                  checked={endereco.id === enderecoAtivoId}
                  onChange={() => handleSelecionarAtivo(endereco.id)}
                />
                <span>Usar como endereço principal</span>
              </label>

              <p><strong>CEP:</strong> {endereco.cep}</p>
              <p><strong>Endereço:</strong> {endereco.rua}, {endereco.numero} - {endereco.bairro}, {endereco.cidade} - {endereco.estado}</p>
              {endereco.complemento && <p><strong>Complemento:</strong> {endereco.complemento}</p>}
              <div className="botoes-endereco">
                <button onClick={() => handleExcluir(endereco.id)}>Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
