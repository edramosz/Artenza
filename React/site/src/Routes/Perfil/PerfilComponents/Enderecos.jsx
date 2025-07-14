import React, { useState, useEffect } from "react";

const Enderecos= () => {
  const idUsuario = localStorage.getItem("idUsuario");
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    id: null,
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  const [isEditando, setIsEditando] = useState(false);

  useEffect(() => {
    if (!idUsuario) {
      setErro("Usuário não logado");
      setLoading(false);
      return;
    }

    fetchEnderecos();
  }, [idUsuario]);

  async function fetchEnderecos() {
    setLoading(true);
    setErro("");

    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/por-usuario/${idUsuario}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar endereços");
      }
      const data = await response.json();
      setEnderecos(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  function limparFormulario() {
    setForm({ id: null, rua: "", numero: "", cidade: "", estado: "", cep: "" });
    setIsEditando(false);
    setErro("");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSalvar(e) {
    e.preventDefault();

    // Validação simples
    if (!form.rua || !form.numero || !form.cidade || !form.estado || !form.cep) {
      setErro("Preencha todos os campos.");
      return;
    }

    setErro("");

    try {
      let response;
      if (isEditando) {
        // Atualizar endereço
        response = await fetch(`https://artenza.onrender.com/Endereco/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // Criar novo endereço
        const novoEndereco = { ...form, usuarioId: idUsuario };
        response = await fetch(`https://artenza.onrender.com/Endereco`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(novoEndereco),
        });
      }

      if (!response.ok) {
        throw new Error("Erro ao salvar endereço");
      }

      limparFormulario();
      fetchEnderecos();

    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm("Deseja realmente excluir este endereço?")) return;

    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir endereço");
      }

      fetchEnderecos();

    } catch (err) {
      alert(err.message);
    }
  }

  function handleEditar(endereco) {
    setForm(endereco);
    setIsEditando(true);
    setErro("");
  }

  if (loading) return <p>Carregando endereços...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div>
      <h2>Meus Endereços</h2>

      {enderecos.length === 0 && <p>Nenhum endereço cadastrado.</p>}

      <ul>
        {enderecos.map((endereco) => (
          <li key={endereco.id} style={{ marginBottom: "10px" }}>
            <strong>{endereco.rua}, {endereco.numero}</strong><br />
            {endereco.cidade} - {endereco.estado}, CEP: {endereco.cep}
            <br />
            <button onClick={() => handleEditar(endereco)}>Editar</button>{" "}
            <button onClick={() => handleExcluir(endereco.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>{isEditando ? "Editar Endereço" : "Adicionar Novo Endereço"}</h3>

      <form onSubmit={handleSalvar} style={{ maxWidth: "400px" }}>
        <label>
          Rua:
          <input
            type="text"
            name="rua"
            value={form.rua}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Número:
          <input
            type="text"
            name="numero"
            value={form.numero}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Cidade:
          <input
            type="text"
            name="cidade"
            value={form.cidade}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Estado:
          <input
            type="text"
            name="estado"
            value={form.estado}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          CEP:
          <input
            type="text"
            name="cep"
            value={form.cep}
            onChange={handleChange}
          />
        </label>
        <br />

        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <button type="submit">{isEditando ? "Salvar Alterações" : "Adicionar Endereço"}</button>
        {isEditando && (
          <button type="button" onClick={limparFormulario} style={{ marginLeft: "10px" }}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};
export default Enderecos;
