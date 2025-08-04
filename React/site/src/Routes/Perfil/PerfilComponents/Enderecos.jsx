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


const ModalFormularioEndereco = ({
  visible, onClose, onSubmit, loadingSalvar, editandoEnderecoId, cep, setCep, estado, setEstado, cidade, setCidade, bairro,
  setBairro, rua, setRua, numero, setNumero, complemento, setComplemento, buscarEnderecoPorCEP, loadingCep,
}) => {
  if (!visible) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal endereco-modal-form">
        <h3>Editar Endereço</h3>
        <form onSubmit={onSubmit} className="endereco-form" noValidate>
          <div className="forms-groups">
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

            <div className="rua-numero">
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
            </div>

            <div className="form-group-endereco">
              <label htmlFor="complemento">Complemento:</label>
              <input
                id="complemento"
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Digite o Complemento (opcional)"
                maxLength={20}
              />
            </div>
          </div>

          <div className="btns-form">
            <button type="submit" disabled={loadingSalvar}>
              {loadingSalvar ? "Salvando..." : editandoEnderecoId ? "Salvar Alterações" : "Salvar"}
            </button>
            <button type="button" onClick={onClose} disabled={loadingSalvar} className="cancelar-btn">
              Cancelar
            </button>
          </div>


        </form>
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
  const [enderecoAtivoId, setEnderecoAtivoId] = useState("");
  const [editandoEnderecoId, setEditandoEnderecoId] = useState(null);

  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Estados para modais
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalConfirmData, setModalConfirmData] = useState({});
  const [modalMensagemVisible, setModalMensagemVisible] = useState(false);
  const [modalMensagemData, setModalMensagemData] = useState({ tipo: "", mensagem: "" });

  // Para guardar id em ação de excluir/ativar
  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [idParaAtivar, setIdParaAtivar] = useState(null);

  const usuarioId = localStorage.getItem("idUsuario");

  useEffect(() => {
    fetchEnderecos();
  }, []);

  const fetchEnderecos = async () => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Endereco/por-usuario/${usuarioId}`);
      if (!response.ok) throw new Error("Erro ao buscar endereços.");
      const dados = await response.json();

      setEnderecos(dados);
      const ativo = dados.find((e) => e.ativo);
      if (ativo) setEnderecoAtivoId(ativo.id);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      abrirModalMensagem("erro", "Erro ao carregar endereços. Tente novamente.");
    }
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
      atualizadoEm: agora,
    };

    try {
      let response;
      if (editandoEnderecoId) {
        response = await fetch(`https://artenza.onrender.com/Endereco/${editandoEnderecoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enderecoData),
        });
      } else {
        enderecoData.criadoEm = agora;
        response = await fetch("https://artenza.onrender.com/Endereco", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enderecoData),
        });
      }

      if (!response.ok) throw new Error("Erro na operação.");

      abrirModalMensagem("sucesso", editandoEnderecoId ? "Endereço atualizado!" : "Endereço criado!");
      limparFormulario();
      setShowForm(false);
      fetchEnderecos(); // Recarrega os dados
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
      const response = await fetch(`https://artenza.onrender.com/Endereco/${idParaExcluir}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir.");

      abrirModalMensagem("sucesso", "Endereço excluído com sucesso!");
      fetchEnderecos(); // Recarrega a lista
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
      // Desativa todos os endereços do usuário
      const atualizacoes = enderecos.map((end) => {
        return fetch(`https://artenza.onrender.com/Endereco/${end.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...end,
            ativo: end.id === idParaAtivar,
            atualizadoEm: new Date().toISOString(),
          }),
        });
      });

      await Promise.all(atualizacoes);
      fetchEnderecos();
    } catch (error) {
      console.error(error);
      abrirModalMensagem("erro", "Erro ao ativar endereço.");
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

  const enderecosFiltrados = enderecos
    .sort((a, b) => (a.ativo === b.ativo ? 0 : a.ativo ? -1 : 1));


  return (
    <div className="perfil-page">
      <NavProfile />
      <div className="enderecos-container">
        <div className="top-endereco">
          <h2>Meus Endereços</h2>
          {!showForm && (
            <button
              onClick={() => {
                limparFormulario();
                setShowForm(true);
              }}
            >
              Adicionar Novo Endereço
            </button>

          )}
        </div>

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

        <ModalFormularioEndereco
          visible={showForm}
          onClose={() => {
            limparFormulario();
            setShowForm(false);
          }}
          onSubmit={handleSalvar}
          loadingSalvar={loadingSalvar}
          editandoEnderecoId={editandoEnderecoId}
          cep={cep}
          setCep={setCep}
          estado={estado}
          setEstado={setEstado}
          cidade={cidade}
          setCidade={setCidade}
          bairro={bairro}
          setBairro={setBairro}
          rua={rua}
          setRua={setRua}
          numero={numero}
          setNumero={setNumero}
          complemento={complemento}
          setComplemento={setComplemento}
          buscarEnderecoPorCEP={buscarEnderecoPorCEP}
          loadingCep={loadingCep}
        />




        {/* Lista de endereços */}
        <div className="lista-enderecos">
          {enderecosFiltrados.length === 0 ? (
            <p>Nenhum endereço encontrado.</p>
          ) : (
            enderecosFiltrados
              .map((endereco) => (
                <div key={endereco.id} className={`endereco-card ${endereco.ativo ? "ativo" : ""}`}>

                  <div className="card-content">
                    <div className="ativo-div">
                      <label className="radio-endereco">
                        <input
                          type="radio"
                          name="enderecoAtivo"
                          checked={endereco.id === enderecoAtivoId}
                          onChange={() => solicitarAtivar(endereco.id)}
                        />
                        {/* <span>Usar como endereço principal</span> */}
                      </label>
                    </div>

                    <div className="endereco-container">
                      <div className="endereco-header">
                        <h4>{endereco.cidade}</h4>
                      </div>
                      <div className="endereco-hero">
                        <p>{endereco.rua}, {endereco.numero} - {endereco.bairro}</p>
                        <p>{endereco.estado} - {endereco.cep} - {endereco.complemento}</p>
                      </div>
                      {/* <p>
                    <small>
                      Criado em: {new Date(endereco.criadoEm).toLocaleDateString()} | Atualizado em:{" "}
                      {new Date(endereco.atualizadoEm).toLocaleDateString()}
                    </small>
                  </p> */}
                    </div>
                  </div>

                  <div className="botoes-endereco">
                    <button onClick={() => abrirFormularioEdicao(endereco)} disabled={loadingSalvar}>
                      <span className="icons-btn"><i class="fa-solid fa-pencil"></i></span> Editar
                    </button>
                    <button onClick={() => solicitarExcluir(endereco.id)} disabled={loadingSalvar} className="btn-excluir">
                      <span className="icons-btn"><i class="fa-solid fa-xmark"></i></span> Excluir
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