import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './CadastroForm.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const initialFormData = {
  NomeCompleto: "",
  Email: "",
  Telefone: "",
  SenhaHash: "",
  IdEndereco: "",
  isAdmin: false,
  DiaNascimento: "",
  MesNascimento: "",
  AnoNascimento: "",
  DataNascimento: "",
  PerfilUrl: "",
};

const initialAddress = {
  CEP: "",
  Estado: "",
  Cidade: "",
  Bairro: "",
  Rua: "",
  Numero: "",
  Complemento: "",
};

const Cadastro = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [formDataEndereco, setFormDataEndereco] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Erros Step 1
  const [errorNome, setErrorNome] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorTelefone, setErrorTelefone] = useState("");
  const [errorDataNascimento, setErrorDataNascimento] = useState("");
  const [errorSenha, setErrorSenha] = useState("");

  // Erros Step 2
  const [errorCEP, setErrorCEP] = useState("");
  const [errorEstado, setErrorEstado] = useState("");
  const [errorCidade, setErrorCidade] = useState("");
  const [errorBairro, setErrorBairro] = useState("");
  const [errorRua, setErrorRua] = useState("");
  const [errorNumero, setErrorNumero] = useState("");
  const [errorEnderecoGeral, setErrorEnderecoGeral] = useState("");

  const [cepValido, setCepValido] = useState(false);

  // ====== Máscaras e Handlers ======
  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  };
  const formatCEP = (value) => {
    // Remove tudo que não for número
    const onlyNumbers = value.replace(/\D/g, "");

    // Limita a 8 dígitos
    const limited = onlyNumbers.slice(0, 8);

    // Formata como 00000-000
    if (limited.length > 5) {
      return limited.slice(0, 5) + "-" + limited.slice(5);
    } else {
      return limited;
    }
  };

  const checarTelefoneExistente = async (telefone) => {
    const telefoneLimpo = telefone.replace(/\D/g, "");
    const response = await fetch(`https://artenza.onrender.com/Usuario/exists-telefone?telefone=${telefoneLimpo}`);
    if (!response.ok) {
      throw new Error("Erro ao verificar telefone");
    }
    const existe = await response.json();
    return existe;
  };


  const handleChangeCEP = (e) => {
    const formattedCEP = formatCEP(e.target.value);
    setFormDataEndereco((prev) => ({ ...prev, CEP: formattedCEP }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove números no nome completo
    if (name === "NomeCompleto") {
      const onlyLetters = value.replace(/[0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyLetters }));
      if (onlyLetters.trim() !== "") setErrorNome("");
      return;
    }

    // Máscara telefone
    if (name === "Telefone") {
      const masked = formatTelefone(value);
      setFormData((prev) => ({ ...prev, [name]: masked }));
      if (masked.replace(/\D/g, "").length >= 10) setErrorTelefone("");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Zera erros específicos ao digitar
    if (name === "Email") setErrorEmail("");
    if (name === "SenhaHash") setErrorSenha("");
    if (name === "DataNascimento") setErrorDataNascimento("");
  };

  useEffect(() => {
    // Extrai só os números do CEP
    const cepNumeros = formDataEndereco.CEP.replace(/\D/g, "");
    if (cepNumeros.length === 8) {
      buscarEnderecoPorCEP(cepNumeros);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDataEndereco.CEP]);



  const handleChangeEndereco = (e) => {
    const { name, value } = e.target;

    if (name === "CEP") {
      const masked = formatCEP(value);
      setFormDataEndereco((prev) => ({ ...prev, [name]: masked }));
      setCepValido(false);
      setErrorCEP("");
      setErrorEnderecoGeral("");
      return;
    }

    // Não permite números em Cidade e Estado
    if (name === "Cidade" || name === "Estado") {
      const onlyLettersSpaces = value.replace(/[0-9]/g, "");
      setFormDataEndereco((prev) => ({ ...prev, [name]: onlyLettersSpaces }));
      if (onlyLettersSpaces.trim() !== "") {
        if (name === "Cidade") setErrorCidade("");
        if (name === "Estado") setErrorEstado("");
      }
      return;
    }

    setFormDataEndereco((prev) => ({ ...prev, [name]: value }));

    // Limpa erros ao digitar
    if (name === "Bairro" && value.trim() !== "") setErrorBairro("");
    if (name === "Rua" && value.trim() !== "") setErrorRua("");
    if (name === "Numero" && value.trim() !== "") setErrorNumero("");
  };

  function handleChangeDate(e) {
    const valor = e.target.value;
    const maxDate = new Date("2010-12-31");
    const inputDate = new Date(valor);

    if (inputDate > maxDate) {
      setErrorDataNascimento("Data máxima permitida é 31/12/2010");
      // Opcional: limpar campo ou não atualizar o estado
    } else {
      setErrorDataNascimento("");
      setFormData(prev => ({ ...prev, DataNascimento: valor }));
    }
  }


  // Busca endereço por CEP e valida
  const buscarEnderecoPorCEP = async (cep) => {
    if (cep.length !== 8) {
      setErrorCEP("CEP inválido. Deve conter 9 dígitos.");
      setCepValido(false);
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setErrorCEP("CEP não encontrado. Verifique e tente novamente.");
        setCepValido(false);
        return;
      }
      setErrorCEP("");
      setCepValido(true);
      setFormDataEndereco((prev) => ({
        ...prev,
        Estado: data.uf || prev.Estado,
        Cidade: data.localidade || prev.Cidade,
        Bairro: data.bairro || prev.Bairro,
        Rua: data.logradouro || prev.Rua,
      }));
    } catch {
      setErrorCEP("Erro ao buscar endereço. Tente novamente.");
      setCepValido(false);
    }
  };


  // Funções para verificar campos obrigatórios preenchidos (para habilitar botões)
  const isStep1Filled = () => {
    return (
      formData.NomeCompleto.trim() !== "" &&
      formData.Email.trim() !== "" &&
      formData.Telefone.replace(/\D/g, "").length >= 10 &&
      formData.DataNascimento.trim() !== "" &&
      formData.SenhaHash.trim() !== ""
    );
  };

  const isStep2Filled = () => {
    return (
      formDataEndereco.CEP.replace(/\D/g, "").length === 8 &&
      formDataEndereco.Estado.trim() !== "" &&
      formDataEndereco.Cidade.trim() !== "" &&
      formDataEndereco.Bairro.trim() !== "" &&
      formDataEndereco.Rua.trim() !== "" &&
      formDataEndereco.Numero.trim() !== ""
    );
  };


  // Validações específicas ao tentar avançar para o próximo step
  const validarStep1 = () => {
    let valido = true;

    if (formData.NomeCompleto.trim() === "") {
      setErrorNome("Nome Completo é obrigatório.");
      valido = false;
    }
    if (!formData.Email.toLowerCase().endsWith(".com")) {
      setErrorEmail("O email deve terminar com '.com'.");
      valido = false;
    }
    if (formData.Telefone.replace(/\D/g, "").length < 10) {
      setErrorTelefone("Digite um telefone válido.");
      valido = false;
    }
    if (formData.DataNascimento.trim() === "") {
      setErrorDataNascimento("Data de nascimento é obrigatória.");
      valido = false;
    }
    if (formData.SenhaHash.length < 6) {
      setErrorSenha("A senha deve ter pelo menos 6 caracteres.");
      valido = false;
    }

    return valido;
  };

  // Validações específicas ao tentar submeter o form completo
  const validarStep2 = () => {
    let valido = true;

    if (formDataEndereco.CEP.replace(/\D/g, "").length !== 8) {
      setErrorCEP("CEP inválido. Deve conter 8 dígitos.");
      valido = false;
    } else if (!cepValido) {
      setErrorCEP("CEP não validado ou inválido.");
      valido = false;
    }

    if (formDataEndereco.Estado.trim() === "") {
      setErrorEstado("Estado é obrigatório.");
      valido = false;
    }
    if (/[0-9]/.test(formDataEndereco.Estado)) {
      setErrorEstado("Estado não pode conter números.");
      valido = false;
    }

    if (formDataEndereco.Cidade.trim() === "") {
      setErrorCidade("Cidade é obrigatória.");
      valido = false;
    }
    if (/[0-9]/.test(formDataEndereco.Cidade)) {
      setErrorCidade("Cidade não pode conter números.");
      valido = false;
    }

    if (formDataEndereco.Bairro.trim() === "") {
      setErrorBairro("Bairro é obrigatório.");
      valido = false;
    }
    if (formDataEndereco.Rua.trim() === "") {
      setErrorRua("Rua é obrigatória.");
      valido = false;
    }
    if (formDataEndereco.Numero.trim() === "") {
      setErrorNumero("Número é obrigatório.");
      valido = false;
    }

    return valido;
  };

  const handleNext = () => {
    // limpa erros antigos
    setErrorNome("");
    setErrorEmail("");
    setErrorTelefone("");
    setErrorDataNascimento("");
    setErrorSenha("");

    if (!isStep1Filled()) {
      // Não deixa avançar e alerta que faltam campos
      alert("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    if (!validarStep1()) {
      // Erros detalhados aparecerão nos parágrafos
      return;
    }

    setStep(2);
  };

  const handlePrev = () => {
    // limpa erros do endereço quando volta para o primeiro step
    setErrorCEP("");
    setErrorEstado("");
    setErrorCidade("");
    setErrorBairro("");
    setErrorRua("");
    setErrorNumero("");
    setErrorEnderecoGeral("");
    setStep(1);
  };

  const handleSubmitCompleto = async (e) => {
    e.preventDefault();
    if (loading) return;

    // limpa erros anteriores
    setErrorEnderecoGeral("");
    setErrorCEP("");
    setErrorEstado("");
    setErrorCidade("");
    setErrorBairro("");
    setErrorRua("");
    setErrorNumero("");
    setErrorTelefone("");
    setErrorEmail("");  // Limpa o erro de email também


    if (!isStep2Filled()) {
      alert("Preencha todos os campos obrigatórios do endereço.");
      return;
    }

    if (!validarStep2()) {
      return;
    }

    setLoading(true);

    let createdFirebaseUser = null;

    try {
      // VALIDAÇÃO TELEFONE ANTES DO CADASTRO
      const telefoneExiste = await checarTelefoneExistente(formData.Telefone);
      if (telefoneExiste) {
        setErrorTelefone("Este telefone já está cadastrado.");
        setLoading(false);
        return; // Interrompe cadastro se telefone existir
      }

      // Criar usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.Email,
        formData.SenhaHash
      );
      createdFirebaseUser = userCredential.user;
      const firebaseUserId = createdFirebaseUser.uid;

      const enderecoPayload = {
        ...formDataEndereco,
        CEP: formDataEndereco.CEP.replace(/\D/g, ""),
        UsuarioId: firebaseUserId,
      };

      const responseEndereco = await fetch("https://artenza.onrender.com/Endereco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enderecoPayload),
      });

      if (!responseEndereco.ok) {
        throw new Error(await responseEndereco.text());
      }

      const endereco = await responseEndereco.json();

      const usuarioPayload = {
        NomeCompleto: formData.NomeCompleto,
        Email: formData.Email,
        Telefone: formData.Telefone.replace(/\D/g, ""),
        SenhaHash: formData.SenhaHash,
        IdEndereco: endereco.id ?? endereco.Id,
        isAdmin: false,
        DiaNascimento: parseInt(formData.DiaNascimento, 10) || 0,
        MesNascimento: parseInt(formData.MesNascimento, 10) || 0,
        AnoNascimento: parseInt(formData.AnoNascimento, 10) || 0,
        PerfilUrl: formData.PerfilUrl || "https://exemplo.com/default-profile.png",
      };

      const responseUsuario = await fetch("https://artenza.onrender.com/Usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioPayload),
      });

      if (!responseUsuario.ok) {
        throw new Error(await responseUsuario.text());
      }

      localStorage.setItem("nomeUsuario", formData.NomeCompleto);
      localStorage.setItem("email", formData.Email);
      localStorage.setItem("isAdmin", "false");
      localStorage.setItem("perfilUrl", formData.PerfilUrl || "");
      window.dispatchEvent(new Event("storage"));

      alert("Cadastro realizado com sucesso!");
      setFormData(initialFormData);
      setFormDataEndereco(initialAddress);
      setStep(1);
      navigate("/Login");
    } catch (error) {
      console.error(error);

      // Tratamento específico para email já cadastrado
      if (error.code === "auth/email-already-in-use") {
        setErrorEmail("Este email já está cadastrado. Faça login ou use outro email.");
      } else {
        setErrorEnderecoGeral("Erro ao realizar cadastro. " + (error?.message || error));
      }

      if (createdFirebaseUser) {
        try {
          await createdFirebaseUser.delete();
        } catch { }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container-hero">
      <div className="form-container">
        <h2 className="title">Cadastre-se</h2>
        <form onSubmit={handleSubmitCompleto} className="form">
          <div className="steps-indicator">Passo {step} de 2</div>

          {step === 1 && (
            <div className="form-user">
              <div className="form-group-cadastro">
                <label htmlFor="NomeCompleto">Nome Completo:</label>
                <input
                  type="text"
                  name="NomeCompleto"
                  value={formData.NomeCompleto}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                />
                {errorNome && <p className="error-message">{errorNome}</p>}
              </div>

              <div className="form-group-cadastro">
                <label htmlFor="Email">Email:</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="exemplo@dominio.com"
                />
                {errorEmail && <p className="error-message">{errorEmail}</p>}
              </div>

              <div className="form-group-cadastro">
                <label htmlFor="Telefone">Telefone:</label>
                <input
                  type="text"
                  name="Telefone"
                  value={formData.Telefone}
                  onChange={handleChange}
                  maxLength={15}
                  placeholder="(99) 99999-9999"
                />
                {errorTelefone && <p className="error-message">{errorTelefone}</p>}
              </div>

              <div className="form-group-cadastro">
                <label htmlFor="DataNascimento">Data de Nascimento:</label>
                {/* no input data de nascimento */}
                <input
                  type="date"
                  name="DataNascimento"
                  value={formData.DataNascimento}
                  onChange={handleChangeDate}
                  max="2010-12-31"
                  placeholder="Selecione sua data de nascimento"
                />

                {errorDataNascimento && <p className="error-message">{errorDataNascimento}</p>}
              </div>

              <div className="form-group-cadastro">
                <label htmlFor="SenhaHash">Senha:</label>
                <div className="input-senha-container">
                  <input
                    type={mostrarSenha ? "password" : "text"}
                    name="SenhaHash"
                    value={formData.SenhaHash}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                  />
                  <button
                    type="button"
                    className="btn-olho"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errorSenha && <p className="error-message">{errorSenha}</p>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleNext}
                  className="form-button"
                  style={{ marginTop: 10 }}
                  disabled={
                    !formData.NomeCompleto.trim() ||
                    !formData.Email.trim() ||
                    !formData.Telefone.trim() ||
                    !formData.DataNascimento.trim() ||
                    !formData.SenhaHash.trim()
                  }
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-address">
              {errorEnderecoGeral && <p className="error-message">{errorEnderecoGeral}</p>}

              <div className="form-group-cadastro">
                <label htmlFor="CEP">CEP:</label>
                <input
                  type="text"
                  name="CEP"
                  value={formDataEndereco.CEP}
                  onChange={handleChangeCEP}
                  maxLength={9} // 8 números + 1 hífen
                  placeholder="00000-000"
                />
                {errorCEP && <p className="error-message">{errorCEP}</p>}
              </div>

              <div className="cidade-estado">
                <div className="form-group-cadastro">
                  <label htmlFor="Estado">Estado:</label>
                  <input
                    type="text"
                    name="Estado"
                    value={formDataEndereco.Estado}
                    onChange={handleChangeEndereco}
                    placeholder="Ex: SP"
                  />
                  {errorEstado && <p className="error-message">{errorEstado}</p>}
                </div>

                <div className="form-group-cadastro">
                  <label htmlFor="Cidade">Cidade:</label>
                  <input
                    type="text"
                    name="Cidade"
                    value={formDataEndereco.Cidade}
                    onChange={handleChangeEndereco}
                    placeholder="Ex: São Paulo"
                  />
                  {errorCidade && <p className="error-message">{errorCidade}</p>}
                </div>
              </div>

              <div className="form-group-cadastro">
                <label htmlFor="Bairro">Bairro:</label>
                <input
                  type="text"
                  name="Bairro"
                  value={formDataEndereco.Bairro}
                  onChange={handleChangeEndereco}
                  placeholder="Ex: Centro"
                />
                {errorBairro && <p className="error-message">{errorBairro}</p>}
              </div>

              <div className="rua-numero">
                <div className="form-group-cadastro">
                  <label htmlFor="Rua">Rua:</label>
                  <input
                    type="text"
                    name="Rua"
                    value={formDataEndereco.Rua}
                    onChange={handleChangeEndereco}
                    placeholder="Nome da rua"
                  />
                  {errorRua && <p className="error-message">{errorRua}</p>}
                </div>

                <div className="form-group-cadastro">
                  <label htmlFor="Numero">Número:</label>
                  <input
                    type="text"
                    name="Numero"
                    value={formDataEndereco.Numero}
                    onChange={handleChangeEndereco}
                    placeholder="Número"
                  />
                  {errorNumero && <p className="error-message">{errorNumero}</p>}
                </div>
              </div>

              <div className="form-group-cadastro">
                <label htmlFor="Complemento">Complemento:</label>
                <textarea
                  name="Complemento"
                  value={formDataEndereco.Complemento}
                  onChange={handleChangeEndereco}
                  placeholder="Apartamento, bloco, informações adicionais"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handlePrev} className="form-button secondary">
                  Voltar
                </button>
                <button
                  type="submit"
                  className="form-button"
                  disabled={
                    !formDataEndereco.CEP ||
                    !formDataEndereco.Estado ||
                    !formDataEndereco.Cidade ||
                    !formDataEndereco.Bairro ||
                    !formDataEndereco.Rua ||
                    !formDataEndereco.Numero ||
                    loading
                  }
                >
                  {loading ? "Enviando..." : "Cadastrar-se"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="cadastro-banner">
      </div>
    </div>
  );
};

export default Cadastro;
