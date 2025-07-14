import React, { useEffect, useState } from "react";
import "./Enderecos.css";
import NavProfile from "../NavProfile";

const ModalConfirmacao = ({ visible, titulo, mensagem, onConfirm, onCancel }) => {
  if (!visible) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{titulo}</h3>
        <p>{mensagem}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn-confirm">
            Confirmar
          </button>
          <button onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalMensagem = ({ visible, tipo, mensagem, onClose }) => {
  if (!visible) return null;
  return (
    <div className="modal-backdrop">
      <div className={`modal mensagem ${tipo}`}>
        <p>{mensagem}</p>
        <button onClick={onClose} className="btn-close">
          &times;
        </button>
      </div>
    </div>
  );
};

const validarCEP = (cep) => {
  // Formato básico: 8 números (sem hífen)
  return /^[0-9]{8}$/.test(cep.replace(/\D/g, ""));
};

const validarNumero = (numero) => {
  return /^[0-9]+$/.test(numero);
};

const tiposEndereco = ["Residencial", "Comercial"];

const Enderecos = () => {
  const [enderecos, setEnderecos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [tipo, setTipo] = useState(tiposEndereco[0]);
  const [enderecoAtivoId, setEnderecoAtivoId] = useState("");
  const [editandoEnderecoId, setEditandoEnderecoId] = useState(null);

  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Filtro simples para busca
  const [filtroBusca, setFiltroBusca] = useState("");

  // Estados para modais
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalConfirmData, setModalConfirmData] = useState({});
  const [modalMensagemVisible, setModalMensagemVisible] = useState(false);
  const [modalMensagemData, setModalMensagemData] = useState({ tipo: "", mensagem: "" });

  // Para guardar id em ação de excluir/ativar
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [idParaAtivar, setIdParaAtivar] = useState(null);

  // Simula id do usuário (em produção vem do login)
  const usuarioId = localStorage.getItem("idUsuario") || "usuario123";

  // Carrega endereços (simulado com data criada/alterada)
  useEffect(() => {
    fetchEnderecos();
  }, []);

  // Simula fetch da API
  const fetchEnderecos = async () => {
    // Aqui substitua com fetch real
    // Por enquanto, simula dados
    const dadosSimulados = [
      {
        id: "1",
        usuarioId,
        cep: "01001000",
        estado: "SP",
        cidade: "São Paulo",
        bairro: "Sé",
        rua: "Praça da Sé",
        numero: "100",
        complemento: "Apto 10",
        ativo: true,
        tipo: "Residencial",
        criadoEm: "2024-07-14T12:00:00Z",
        atualizadoEm: "2024-07-14T12:00:00Z",
      },
      {
        id: "2",
        usuarioId,
        cep: "20040030",
        estado: "RJ",
        cidade: "Rio de Janeiro",
        bairro: "Centro",
        rua: "Rua da Assembleia",
        numero: "50",
        complemento: "",
        ativo: false,
        tipo: "Comercial",
        criadoEm: "2024-07-13T15:30:00Z",
        atualizadoEm: "2024-07-13T15:30:00Z",
      },
    ];
    setEnderecos(dadosSimulados);
    const ativo = dadosSimulados.find((e) => e.ativo);
    if (ativo) setEnderecoAtivoId(ativo.id);
  };

  // Auto completar endereço pelo CEP via ViaCEP
  const buscarEnderecoPorCEP = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (!validarCEP(cepLimpo)) {
      abrirModalMensagem("erro", "CEP inválido. Deve conter 8 números.");
      return;
    }

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!response.ok) throw new Error("Erro ao buscar CEP");
      const data = await response.json();
      if (data.erro) {
        abrirModalMensagem("erro", "CEP não encontrado.");
        return;
      }

      setEstado(data.uf || "");
      setCidade(data.localidade || "");
      setBairro(data.bairro || "");
      setRua(data.logradouro || "");
      abrirModalMensagem("sucesso", "Endereço carregado automaticamente.");
    } catch (error) {
      abrirModalMensagem("erro", "Erro ao buscar CEP.");
      console.error(error);
    } finally {
      setLoadingCep(false);
    }
  };

  const abrirFormularioEdicao = (endereco) => {
    setCep(endereco.cep);
    setEstado(endereco.estado);
    setCidade(endereco.cidade);
    setBairro(endereco.bairro);
    setRua(endereco.rua);
    setNumero(endereco.numero);
    setComplemento(endereco.complemento || "");
    setTipo(endereco.tipo || tiposEndereco[0]);
    setEditandoEnderecoId(endereco.id);
    setShowForm(true);
    fecharModalMensagem();
  };

  const limparFormulario = () => {
    setCep("");
    setEstado("");
    setCidade("");
    setBairro("");
    setRua("");
    setNumero("");
    setComplemento("");
    setTipo(tiposEndereco[0]);
    setEditandoEnderecoId(null);
    fecharModalMensagem();
  };

  const validarFormulario = () => {
    if (!validarCEP(cep.replace(/\D/g, ""))) {
      abrirModalMensagem("erro", "Por favor, informe um CEP válido.");
      return false;
    }
    if (!numero || !validarNumero(numero)) {
      abrirModalMensagem("erro", "Por favor, informe um número válido.");
      return false;
    }
    if (!estado || !cidade || !bairro || !rua) {
      abrirModalMensagem("erro", "Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoadingSalvar(true);
    fecharModalMensagem();

    const agora = new Date().toISOString();

    const enderecoData = {
      usuarioId,
      cep,
      estado,
      cidade,
      bairro,
      rua,
      numero,
      complemento,
      ativo: false,
      tipo,
      criadoEm: editandoEnderecoId ? undefined : agora,
      atualizadoEm: agora,
      id: editandoEnderecoId || Math.random().toString(36).slice(2), // Simula id
    };

    try {
      // Simular salvar via API
      await new Promise((r) => setTimeout(r, 1500));

      if (editandoEnderecoId) {
        setEnderecos(
          enderecos.map((e) => (e.id === editandoEnderecoId ? { ...e, ...enderecoData } : e))
        );
        abrirModalMensagem("sucesso", "Endereço atualizado com sucesso!");
      } else {
        setEnderecos([...enderecos, enderecoData]);
        abrirModalMensagem("sucesso", "Endereço criado com sucesso!");
      }

      limparFormulario();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      abrirModalMensagem("erro", "Erro ao salvar endereço.");
    } finally {
      setLoadingSalvar(false);
    }
  };

  // Modal de confirmação para excluir
  const solicitarExcluir = (id) => {
    setIdParaExcluir(id);
    setModalConfirmData({
      titulo: "Excluir Endereço",
      mensagem: "Tem certeza que deseja excluir este endereço?",
      onConfirm: confirmarExcluir,
    });
    setModalConfirmVisible(true);
  };

  const confirmarExcluir = async () => {
    setModalConfirmVisible(false);
    if (!idParaExcluir) return;

    try {
      // Simula delay/exclusão
      await new Promise((r) => setTimeout(r, 1000));
      setEnderecos(enderecos.filter((e) => e.id !== idParaExcluir));
      abrirModalMensagem("sucesso", "Endereço excluído com sucesso!");
    } catch (error) {
      console.error(error);
      abrirModalMensagem("erro", "Erro ao excluir endereço.");
    } finally {
      setIdParaExcluir(null);
    }
  };

  // Modal de confirmação para ativar endereço
  const solicitarAtivar = (id) => {
    if (id === enderecoAtivoId) return; // Já ativo

    setIdParaAtivar(id);
    setModalConfirmData({
      titulo: "Definir Endereço Principal",
      mensagem: "Deseja realmente tornar este o endereço principal?",
      onConfirm: confirmarAtivar,
    });
    setModalConfirmVisible(true);
  };

  const confirmarAtivar = async () => {
    setModalConfirmVisible(false);
    if (!idParaAtivar) return;

    try {
      // Simula ativação
      await new Promise((r) => setTimeout(r, 1000));

      const novaLista = enderecos.map((end) =>
        end.id === idParaAtivar ? { ...end, ativo: true } : { ...end, ativo: false }
      );

      setEnderecos(novaLista);
      setEnderecoAtivoId(idParaAtivar);
      abrirModalMensagem("sucesso", "Endereço principal atualizado!");
    } catch (error) {
      console.error(error);
      abrirModalMensagem("erro", "Erro ao atualizar endereço principal.");
    } finally {
      setIdParaAtivar(null);
    }
  };

  const abrirModalMensagem = (tipo, mensagem) => {
    setModalMensagemData({ tipo, mensagem });
    setModalMensagemVisible(true);
  };

  const fecharModalMensagem = () => {
    setModalMensagemVisible(false);
  };

  // Filtrar endereços com base na busca
  const enderecosFiltrados = enderecos
    .filter((e) =>
      filtroBusca
        ? e.cep.includes(filtroBusca) ||
          e.bairro.toLowerCase().includes(filtroBusca.toLowerCase()) ||
          e.cidade.toLowerCase().includes(filtroBusca.toLowerCase())
        : true
    )
    // Ordena para ativo primeiro
    .sort((a, b) => (a.ativo === b.ativo ? 0 : a.ativo ? -1 : 1));

  return (
    <div className="perfil-page">
      <NavProfile />
      <div className="enderecos-container">
        <h2>Meus Endereços</h2>

        {/* Modais */}
        <ModalConfirmacao
          visible={modalConfirmVisible}
          titulo={modalConfirmData.titulo}
          mensagem={modalConfirmData.mensagem}
          onConfirm={modalConfirmData.onConfirm}
          onCancel={() => setModalConfirmVisible(false)}
        />

        <ModalMensagem
          visible={modalMensagemVisible}
          tipo={modalMensagemData.tipo}
          mensagem={modalMensagemData.mensagem}
          onClose={fecharModalMensagem}
        />

        {/* Busca */}
        <div className="filtro-busca">
          <input
            type="text"
            placeholder="Buscar por CEP, bairro ou cidade"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
          />
          <button onClick={() => setFiltroBusca("")}>Limpar</button>
        </div>

        {/* Formulário */}
        {showForm && (
          <form onSubmit={handleSalvar} className="endereco-form" noValidate>
            <div className="form-group-endereco">
              <label htmlFor="cep">CEP:</label>
              <input
                id="cep"
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={() => buscarEnderecoPorCEP(cep)}
                placeholder="Digite o CEP (somente números)"
                required
                maxLength={8}
                disabled={loadingCep}
              />
              {loadingCep && <small>Buscando endereço...</small>}
            </div>

            <div className="form-group-endereco">
              <label htmlFor="estado">Estado:</label>
              <input
                id="estado"
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Digite o Estado"
                required
              />
            </div>

            <div className="form-group-endereco">
              <label htmlFor="cidade">Cidade:</label>
              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Digite a Cidade"
                required
              />
            </div>

            <div className="form-group-endereco">
              <label htmlFor="bairro">Bairro:</label>
              <input
                id="bairro"
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Digite o Bairro"
                required
              />
            </div>

            <div className="form-group-endereco">
              <label htmlFor="rua">Rua:</label>
              <input
                id="rua"
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Digite a Rua"
                required
              />
            </div>

            <div className="form-group-endereco">
              <label htmlFor="numero">Número:</label>
              <input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Digite o Número"
                required
                maxLength={6}
              />
            </div>

            <div className="form-group-endereco">
              <label htmlFor="complemento">Complemento:</label>
              <input
                id="complemento"
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Digite o Complemento (opcional)"
              />
            </div>

            <div className="form-group-endereco">
              <label htmlFor="tipo">Tipo de Endereço:</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                {tiposEndereco.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={loadingSalvar}>
              {loadingSalvar ? "Salvando..." : editandoEnderecoId ? "Salvar Alterações" : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => {
                limparFormulario();
                setShowForm(false);
              }}
              disabled={loadingSalvar}
            >
              Cancelar
            </button>
          </form>
        )}

        {!showForm && (
          <button
            onClick={() => {
              limparFormulario();
              setShowForm(true);
            }}
          >
            {editandoEnderecoId ? "Editar Endereço" : "Adicionar Novo Endereço"}
          </button>
        )}

        {/* Lista de endereços */}
        <div className="lista-enderecos">
          {enderecosFiltrados.length === 0 ? (
            <p>Nenhum endereço encontrado.</p>
          ) : (
            enderecosFiltrados
              .filter((e) => e.id !== editandoEnderecoId) // Não mostrar o que está editando
              .map((endereco) => (
                <div key={endereco.id} className={`endereco-card ${endereco.ativo ? "ativo" : ""}`}>
                  <label className="radio-endereco">
                    <input
                      type="radio"
                      name="enderecoAtivo"
                      checked={endereco.id === enderecoAtivoId}
                      onChange={() => solicitarAtivar(endereco.id)}
                    />
                    <span>Usar como endereço principal</span>
                  </label>

                  <p>
                    <strong>CEP:</strong> {endereco.cep}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {endereco.rua}, {endereco.numero} - {endereco.bairro},{" "}
                    {endereco.cidade} - {endereco.estado}
                  </p>
                  <p>
                    <strong>Tipo:</strong> {endereco.tipo}
                  </p>
                  {endereco.complemento && (
                    <p>
                      <strong>Complemento:</strong> {endereco.complemento}
                    </p>
                  )}
                  <p>
                    <small>
                      Criado em: {new Date(endereco.criadoEm).toLocaleDateString()} | Atualizado em:{" "}
                      {new Date(endereco.atualizadoEm).toLocaleDateString()}
                    </small>
                  </p>
                  <div className="botoes-endereco">
                    <button onClick={() => abrirFormularioEdicao(endereco)} disabled={loadingSalvar}>
                      Editar
                    </button>
                    <button onClick={() => solicitarExcluir(endereco.id)} disabled={loadingSalvar}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Enderecos;






























// import React, { useEffect, useState } from "react";
// import './Enderecos.css';
// import NavProfile from "../NavProfile";

// const ModalConfirmacao = ({ visible, titulo, mensagem, onConfirm, onCancel }) => {
//   if (!visible) return null;
//   return (
//     <div className="modal-backdrop">
//       <div className="modal">
//         <h3>{titulo}</h3>
//         <p>{mensagem}</p>
//         <div className="modal-buttons">
//           <button onClick={onConfirm} className="btn-confirm">Confirmar</button>
//           <button onClick={onCancel} className="btn-cancel">Cancelar</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ModalMensagem = ({ visible, tipo, mensagem, onClose }) => {
//   if (!visible) return null;
//   return (
//     <div className="modal-backdrop">
//       <div className={`modal mensagem ${tipo}`}>
//         <p>{mensagem}</p>
//         <button onClick={onClose} className="btn-close">&times;</button>
//       </div>
//     </div>
//   );
// };

// const Enderecos = () => {
//   const [enderecos, setEnderecos] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [cep, setCep] = useState("");
//   const [estado, setEstado] = useState("");
//   const [cidade, setCidade] = useState("");
//   const [bairro, setBairro] = useState("");
//   const [rua, setRua] = useState("");
//   const [numero, setNumero] = useState("");
//   const [complemento, setComplemento] = useState("");
//   const [enderecoAtivoId, setEnderecoAtivoId] = useState("");
//   const [editandoEnderecoId, setEditandoEnderecoId] = useState(null);

//   const [loadingSalvar, setLoadingSalvar] = useState(false);

//   // Estados para controlar os modais
//   const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
//   const [modalConfirmData, setModalConfirmData] = useState({}); // {titulo, mensagem, onConfirm}

//   const [modalMensagemVisible, setModalMensagemVisible] = useState(false);
//   const [modalMensagemData, setModalMensagemData] = useState({ tipo: "", mensagem: "" });

//   // Guarda o id para excluir ou ativar
//   const [idParaExcluir, setIdParaExcluir] = useState(null);
//   const [idParaAtivar, setIdParaAtivar] = useState(null);

//   const usuarioId = localStorage.getItem("idUsuario");

//   useEffect(() => {
//     fetchEnderecos();
//   }, []);

//   const fetchEnderecos = async () => {
//     try {
//       const response = await fetch(`https://artenza.onrender.com/Endereco/por-usuario/${usuarioId}`);
//       if (!response.ok) throw new Error("Erro ao buscar endereços");
//       const data = await response.json();
//       setEnderecos(data);
//       const ativo = data.find(e => e.ativo);
//       if (ativo) setEnderecoAtivoId(ativo.id);
//     } catch (error) {
//       console.error("Erro ao buscar endereços:", error);
//       abrirModalMensagem("erro", "Erro ao buscar endereços.");
//     }
//   };

//   const abrirFormularioEdicao = (endereco) => {
//     setCep(endereco.cep);
//     setEstado(endereco.estado);
//     setCidade(endereco.cidade);
//     setBairro(endereco.bairro);
//     setRua(endereco.rua);
//     setNumero(endereco.numero);
//     setComplemento(endereco.complemento || "");
//     setEditandoEnderecoId(endereco.id);
//     setShowForm(true);
//     fecharModalMensagem();
//   };

//   const limparFormulario = () => {
//     setCep(""); setEstado(""); setCidade(""); setBairro("");
//     setRua(""); setNumero(""); setComplemento("");
//     setEditandoEnderecoId(null);
//     fecharModalMensagem();
//   };

//   const handleSalvar = async (e) => {
//     e.preventDefault();
//     setLoadingSalvar(true);
//     fecharModalMensagem();

//     const enderecoData = {
//       usuarioId,
//       cep,
//       estado,
//       cidade,
//       bairro,
//       rua,
//       numero,
//       complemento,
//       ativo: false
//     };

//     try {
//       let response;
//       if (editandoEnderecoId) {
//         response = await fetch(`https://artenza.onrender.com/Endereco/${editandoEnderecoId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(enderecoData),
//         });
//       } else {
//         response = await fetch("https://artenza.onrender.com/Endereco", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(enderecoData),
//         });
//       }

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Erro ao salvar: ${response.status} - ${errorText}`);
//       }

//       let enderecoSalvo = null;
//       const contentType = response.headers.get("content-type");
//       if (contentType && contentType.indexOf("application/json") !== -1) {
//         enderecoSalvo = await response.json();
//       }

//       if (editandoEnderecoId) {
//         if (enderecoSalvo) {
//           setEnderecos(enderecos.map(e => e.id === editandoEnderecoId ? enderecoSalvo : e));
//         } else {
//           setEnderecos(enderecos.map(e =>
//             e.id === editandoEnderecoId
//               ? { ...e, ...enderecoData }
//               : e
//           ));
//         }
//         abrirModalMensagem("sucesso", "Endereço atualizado com sucesso!");
//       } else {
//         setEnderecos([...enderecos, enderecoSalvo]);
//         abrirModalMensagem("sucesso", "Endereço criado com sucesso!");
//       }

//       limparFormulario();
//       setShowForm(false);

//     } catch (error) {
//       console.error("Erro ao salvar endereço:", error.message);
//       abrirModalMensagem("erro", "Erro ao salvar. Verifique os campos.");
//     } finally {
//       setLoadingSalvar(false);
//     }
//   };

//   // Abrir modal de confirmação para excluir
//   const solicitarExcluir = (id) => {
//     setIdParaExcluir(id);
//     setModalConfirmData({
//       titulo: "Excluir Endereço",
//       mensagem: "Tem certeza que deseja excluir este endereço?",
//       onConfirm: confirmarExcluir
//     });
//     setModalConfirmVisible(true);
//   };

//   // Confirmar exclusão
//   const confirmarExcluir = async () => {
//     setModalConfirmVisible(false);
//     if (!idParaExcluir) return;
//     try {
//       const response = await fetch(`https://artenza.onrender.com/Endereco/${idParaExcluir}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) throw new Error("Erro ao excluir");

//       setEnderecos(enderecos.filter((e) => e.id !== idParaExcluir));
//       abrirModalMensagem("sucesso", "Endereço excluído com sucesso!");
//     } catch (error) {
//       console.error("Erro ao excluir endereço:", error.message);
//       abrirModalMensagem("erro", "Erro ao excluir endereço.");
//     } finally {
//       setIdParaExcluir(null);
//     }
//   };

//   // Abrir modal de confirmação para ativar endereço
//   const solicitarAtivar = (id) => {
//     if (id === enderecoAtivoId) return; // Já ativo

//     setIdParaAtivar(id);
//     setModalConfirmData({
//       titulo: "Definir Endereço Principal",
//       mensagem: "Deseja realmente tornar este o endereço principal?",
//       onConfirm: confirmarAtivar
//     });
//     setModalConfirmVisible(true);
//   };

//   // Confirmar ativação
//   const confirmarAtivar = async () => {
//     setModalConfirmVisible(false);
//     if (!idParaAtivar) return;
//     try {
//       const response = await fetch(`https://artenza.onrender.com/Endereco/ativar/${idParaAtivar}`, {
//         method: "PUT",
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Erro ao ativar endereço: ${errorText}`);
//       }

//       const novaLista = enderecos.map((end) =>
//         end.id === idParaAtivar ? { ...end, ativo: true } : { ...end, ativo: false }
//       );

//       setEnderecos(novaLista);
//       setEnderecoAtivoId(idParaAtivar);
//       abrirModalMensagem("sucesso", "Endereço principal atualizado!");
//     } catch (error) {
//       console.error("Erro ao marcar como ativo:", error.message);
//       abrirModalMensagem("erro", "Erro ao atualizar endereço principal.");
//     } finally {
//       setIdParaAtivar(null);
//     }
//   };

//   const abrirModalMensagem = (tipo, mensagem) => {
//     setModalMensagemData({ tipo, mensagem });
//     setModalMensagemVisible(true);
//   };

//   const fecharModalMensagem = () => {
//     setModalMensagemVisible(false);
//   };

//   return (
//     <div className="perfil-page">
//       <NavProfile />
//       <div className="enderecos-container">
//         <h2>Meus Endereços</h2>

//         {/* Modal de confirmação */}
//         <ModalConfirmacao
//           visible={modalConfirmVisible}
//           titulo={modalConfirmData.titulo}
//           mensagem={modalConfirmData.mensagem}
//           onConfirm={modalConfirmData.onConfirm}
//           onCancel={() => setModalConfirmVisible(false)}
//         />

//         {/* Modal de mensagens */}
//         <ModalMensagem
//           visible={modalMensagemVisible}
//           tipo={modalMensagemData.tipo}
//           mensagem={modalMensagemData.mensagem}
//           onClose={fecharModalMensagem}
//         />

//         {showForm && (
//           <form onSubmit={handleSalvar} className="endereco-form" noValidate>
//             {/* Campos do formulário */}
//             <div className="form-group-endereco">
//               <label htmlFor="cep">CEP:</label>
//               <input
//                 id="cep"
//                 type="text"
//                 value={cep}
//                 onChange={(e) => setCep(e.target.value)}
//                 placeholder="Digite o CEP"
//                 required
//               />
//             </div>

//             <div className="form-group-endereco">
//               <label htmlFor="estado">Estado:</label>
//               <input
//                 id="estado"
//                 type="text"
//                 value={estado}
//                 onChange={(e) => setEstado(e.target.value)}
//                 placeholder="Digite o Estado"
//                 required
//               />
//             </div>

//             <div className="form-group-endereco">
//               <label htmlFor="cidade">Cidade:</label>
//               <input
//                 id="cidade"
//                 type="text"
//                 value={cidade}
//                 onChange={(e) => setCidade(e.target.value)}
//                 placeholder="Digite a Cidade"
//                 required
//               />
//             </div>

//             <div className="form-group-endereco">
//               <label htmlFor="bairro">Bairro:</label>
//               <input
//                 id="bairro"
//                 type="text"
//                 value={bairro}
//                 onChange={(e) => setBairro(e.target.value)}
//                 placeholder="Digite o Bairro"
//                 required
//               />
//             </div>

//             <div className="form-group-endereco">
//               <label htmlFor="rua">Rua:</label>
//               <input
//                 id="rua"
//                 type="text"
//                 value={rua}
//                 onChange={(e) => setRua(e.target.value)}
//                 placeholder="Digite a Rua"
//                 required
//               />
//             </div>

//             <div className="form-group-endereco">
//               <label htmlFor="numero">Número:</label>
//               <input
//                 id="numero"
//                 type="text"
//                 value={numero}
//                 onChange={(e) => setNumero(e.target.value)}
//                 placeholder="Digite o Número"
//                 required
//               />
//             </div>

//             <div className="form-group-endereco">
//               <label htmlFor="complemento">Complemento:</label>
//               <input
//                 id="complemento"
//                 type="text"
//                 value={complemento}
//                 onChange={(e) => setComplemento(e.target.value)}
//                 placeholder="Digite o Complemento (opcional)"
//               />
//             </div>

//             <div className="botoes-form">
//               <button type="submit" disabled={loadingSalvar}>
//                 {loadingSalvar ? (editandoEnderecoId ? "Salvando..." : "Salvando...") : (editandoEnderecoId ? "Salvar Alterações" : "Salvar")}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   limparFormulario();
//                   setShowForm(false);
//                   fecharModalMensagem();
//                 }}
//                 disabled={loadingSalvar}
//               >
//                 Cancelar
//               </button>
//             </div>
//           </form>
//         )}

//         {!showForm && (
//           <button onClick={() => {
//             limparFormulario();
//             setShowForm(true);
//             fecharModalMensagem();
//           }}>
//             {editandoEnderecoId ? "Editar Endereço" : "Adicionar Novo Endereço"}
//           </button>
//         )}

//         <div className="lista-enderecos">
//           {enderecos.length === 0 ? (
//             <p>Nenhum endereço cadastrado.</p>
//           ) : (
//             (enderecos
//               .filter(e => e.id !== editandoEnderecoId)
//               .map((endereco) => (
//                 <div key={endereco.id} className={`endereco-card ${endereco.ativo ? "ativo" : ""}`}>
//                   <label className="radio-endereco">
//                     <input
//                       type="radio"
//                       name="enderecoAtivo"
//                       checked={endereco.id === enderecoAtivoId}
//                       onChange={() => solicitarAtivar(endereco.id)}
//                     />
//                     <span>Usar como endereço principal</span>
//                   </label>

//                   <p><strong>CEP:</strong> {endereco.cep}</p>
//                   <p><strong>Endereço:</strong> {endereco.rua}, {endereco.numero} - {endereco.bairro}, {endereco.cidade} - {endereco.estado}</p>
//                   {endereco.complemento && <p><strong>Complemento:</strong> {endereco.complemento}</p>}
//                   <div className="botoes-endereco">
//                     <button onClick={() => abrirFormularioEdicao(endereco)}>Editar</button>
//                     <button onClick={() => solicitarExcluir(endereco.id)}>Excluir</button>
//                   </div>
//                 </div>
//               ))
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Enderecos;
