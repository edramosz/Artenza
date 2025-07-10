import React, { useEffect, useState } from 'react';
import './Enderecos.css';
import NavProfile from '../NavProfile';

const Enderecos = () => {
  const [usuario, setUsuario] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [enderecoEditando, setEnderecoEditando] = useState(null);
  const [novoEndereco, setNovoEndereco] = useState({
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    cep: '',
    ativo: false
  });

  const email = localStorage.getItem("email");
  const nomeCompleto = localStorage.getItem("nomeCompletoUser");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resUsuario = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);

        const resEnderecos = await fetch(`https://localhost:7294/Endereco/   ${usuarioData.id}`);
        if (resEnderecos.ok) {
          const listaEnderecos = await resEnderecos.json();
          setEnderecos(listaEnderecos);
        } else {
          setEnderecos([]); // nenhum endereço cadastrado
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    if (email) carregarDados();
  }, [email]);

  const handleSalvarEndereco = async (e) => {
    e.preventDefault();
    try {
      if (enderecoEditando) {
        await fetch(`https://localhost:7294/Endereco/${enderecoEditando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...novoEndereco, usuarioId: usuario.id }),
        });
      } else {
        await fetch(`https://localhost:7294/Endereco`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...novoEndereco, usuarioId: usuario.id }),
        });
      }

      setModoEdicao(false);
      setEnderecoEditando(null);
      setNovoEndereco({ rua: '', numero: '', bairro: '', cidade: '', cep: '', ativo: false });
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    }
  };

  const handleExcluirEndereco = async (id) => {
    try {
      await fetch(`https://localhost:7294/Endereco/${id}`, { method: "DELETE" });
      setEnderecos(enderecos.filter(e => e.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const handleSelecionarAtivo = async (idSelecionado) => {
    try {
      for (const endereco of enderecos) {
        await fetch(`https://localhost:7294/Endereco/${endereco.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...endereco, ativo: endereco.id === idSelecionado })
        });
      }
      window.location.reload();
    } catch (error) {
      console.error("Erro ao definir endereço ativo:", error);
    }
  };

  const iniciarEdicao = (endereco) => {
    setEnderecoEditando(endereco);
    setNovoEndereco(endereco);
    setModoEdicao(true);
  };

  return (
    <div className='perfil-page'>
      <NavProfile />
      <div className='enderecos-container'>
        <h2>Meus Endereços</h2>

        {!usuario ? (
          <p>Carregando dados...</p>
        ) : (
          <>
            {enderecos.length === 0 && !modoEdicao && (
              <div className="aviso-sem-endereco">
                <p>Nenhum endereço cadastrado.</p>
                <button onClick={() => setModoEdicao(true)}>Adicionar Endereço</button>
              </div>
            )}

            {enderecos.length > 0 && (
              <>
                {enderecos.map(end => (
                  <div className="dados-endereco" key={end.id}>
                    <input
                      type="radio"
                      name="enderecoPrincipal"
                      checked={end.ativo}
                      onChange={() => handleSelecionarAtivo(end.id)}
                    />
                    <label>Endereço principal</label>
                    <p><strong>Rua:</strong> {end.rua}</p>
                    <p><strong>Número:</strong> {end.numero}</p>
                    <p><strong>Bairro:</strong> {end.bairro}</p>
                    <p><strong>Cidade:</strong> {end.cidade}</p>
                    <p><strong>CEP:</strong> {end.cep}</p>
                    <div className="botoes-endereco">
                      <button onClick={() => iniciarEdicao(end)}>Editar</button>
                      <button onClick={() => handleExcluirEndereco(end.id)} className="excluir">Excluir</button>
                    </div>
                  </div>
                ))}
                {!modoEdicao && (
                  <button onClick={() => { setModoEdicao(true); setEnderecoEditando(null); setNovoEndereco({ rua: '', numero: '', bairro: '', cidade: '', cep: '', ativo: false }); }}>
                    ➕ Adicionar Novo Endereço
                  </button>
                )}
              </>
            )}

            {modoEdicao && (
              <form className="form-endereco" onSubmit={handleSalvarEndereco}>
                <label>Rua:</label>
                <input
                  type="text"
                  value={novoEndereco.rua}
                  onChange={(e) => setNovoEndereco({ ...novoEndereco, rua: e.target.value })}
                  required
                />
                <label>Número:</label>
                <input
                  type="text"
                  value={novoEndereco.numero}
                  onChange={(e) => setNovoEndereco({ ...novoEndereco, numero: e.target.value })}
                  required
                />
                <label>Bairro:</label>
                <input
                  type="text"
                  value={novoEndereco.bairro}
                  onChange={(e) => setNovoEndereco({ ...novoEndereco, bairro: e.target.value })}
                  required
                />
                <label>Cidade:</label>
                <input
                  type="text"
                  value={novoEndereco.cidade}
                  onChange={(e) => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })}
                  required
                />
                <label>CEP:</label>
                <input
                  type="text"
                  value={novoEndereco.cep}
                  onChange={(e) => setNovoEndereco({ ...novoEndereco, cep: e.target.value })}
                  required
                />
                <div className="form-botoes">
                  <button type="submit">Salvar Endereço</button>
                  <button type="button" onClick={() => setModoEdicao(false)}>Cancelar</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Enderecos;
