import React, { useEffect, useState } from "react";
import './ModalEndereco.css'

const ModalEnderecos = ({ usuarioId, aberto, onFechar, onSelecionarEndereco }) => {
  const [enderecos, setEnderecos] = useState([]);
  const [enderecoAtivoId, setEnderecoAtivoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aberto) {
      carregarEnderecos();
    }
  }, [aberto]);

  const carregarEnderecos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://artenza.onrender.com/Endereco/por-usuario/${usuarioId}`);
      if (!res.ok) throw new Error("Erro ao buscar endereços");
      const dados = await res.json();
      setEnderecos(dados);
      const ativo = dados.find((e) => e.ativo);
      setEnderecoAtivoId(ativo ? ativo.id : null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ativarEndereco = async (id) => {
    if (id === enderecoAtivoId) return;

    try {
      // Atualiza endereços para marcar o selecionado como ativo
      await Promise.all(
        enderecos.map((end) =>
          fetch(`https://artenza.onrender.com/Endereco/${end.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...end, ativo: end.id === id, atualizadoEm: new Date().toISOString() }),
          })
        )
      );
      setEnderecoAtivoId(id);
      onSelecionarEndereco(enderecos.find(e => e.id === id));
      onFechar();
    } catch (e) {
      console.error("Erro ao ativar endereço", e);
      alert("Erro ao alterar endereço ativo.");
    }
  };

  if (!aberto) return null;

  return (
    <div className="modal-backdrop modal-backdrop-end">
      <div className="modal endereco-modal" style={{ maxWidth: 500, maxHeight: "70vh", overflowY: "auto", padding: 20 }}>
        <h3>Escolha um endereço</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          enderecos.length === 0 ? (
            <p>Nenhum endereço cadastrado.</p>
          ) : (
            enderecos.map((end) => (
              <div key={end.id} className={`endereco-card ${end.id === enderecoAtivoId ? "ativo" : ""}`} style={{ border: end.id === enderecoAtivoId ? "2px solid #007bff" : "1px solid #ccc", padding: 10, marginBottom: 10, borderRadius: 5, cursor: "pointer" }}
                onClick={() => ativarEndereco(end.id)}
              >
                <p><strong>{end.rua}, {end.numero}</strong></p>
                <p>{end.bairro} - {end.cidade} - {end.estado}</p>
                <p>CEP: {end.cep}</p>
                {end.complemento && <p>Complemento: {end.complemento}</p>}
                {end.id === enderecoAtivoId && <small style={{ color: "#007bff" }}>Endereço selecionado</small>}
              </div>
            ))
          )
        )}
        <button onClick={onFechar} style={{ marginTop: 10, padding: "8px 15px" }}>Fechar</button>
      </div>
    </div>
  );
};

export default ModalEnderecos;
