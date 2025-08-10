import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './CadastroForm.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";

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
  const [successMessage, setSuccessMessage] = useState("");

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
    const onlyNumbers = value.replace(/\D/g, "");
    const limited = onlyNumbers.slice(0, 8);
    if (limited.length > 5) {
      return limited.slice(0, 5) + "-" + limited.slice(5);
    } else {
      return limited;
    }
  };

  const checarTelefoneExistente = async (telefone) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Usuario/exists-telefone?telefone=${telefone}`);

      if (!response.ok) {
        throw new Error(`Erro ao verificar telefone: ${response.status}`);
      }

      const data = await response.json();
      console.log("Resposta da API existe telefone:", data);

      // Se data for booleano, retorne direto, senão ajuste aqui:
      if (typeof data === "boolean") {
        return data;
      } else if (data.existe !== undefined) {
        return data.existe;
      }

      // Caso resposta inesperada
      return false;

    } catch (error) {
      console.error("Erro ao verificar telefone:", error);
      setErrorTelefone("Não foi possível verificar o telefone. Tente novamente.");
      return true; // Bloqueia cadastro em caso de erro
    }
  };



  const handleChangeCEP = (e) => {
    const formattedCEP = formatCEP(e.target.value);
    setFormDataEndereco((prev) => ({ ...prev, CEP: formattedCEP }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "NomeCompleto") {
      const onlyLetters = value.replace(/[0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: onlyLetters }));
      if (onlyLetters.trim() !== "") setErrorNome("");
      return;
    }

    if (name === "Telefone") {
      const masked = formatTelefone(value);
      setFormData((prev) => ({ ...prev, [name]: masked }));
      if (masked.replace(/\D/g, "").length >= 10) setErrorTelefone("");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "Email") setErrorEmail("");
    if (name === "SenhaHash") setErrorSenha("");
    if (name === "DataNascimento") setErrorDataNascimento("");
  };

  // onBlur para validar telefone
  const handleBlurTelefone = async () => {
    const telNumeros = formData.Telefone.replace(/\D/g, "");
    if (telNumeros.length >= 10) {
      const existe = await checarTelefoneExistente(telNumeros);
      if (existe) {
        setErrorTelefone("Este telefone já está cadastrado.");
      } else {
        setErrorTelefone("");
      }
    }
  };

  useEffect(() => {
    const cepNumeros = formDataEndereco.CEP.replace(/\D/g, "");
    if (cepNumeros.length === 8) {
      buscarEnderecoPorCEP(cepNumeros);
    }
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
    } else {
      setErrorDataNascimento("");
      setFormData(prev => ({ ...prev, DataNascimento: valor }));
    }
  }

  const buscarEnderecoPorCEP = async (cep) => {
    if (cep.length !== 8) {
      setErrorCEP("CEP inválido. Deve conter 8 dígitos.");
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
    setErrorNome("");
    setErrorEmail("");
    setErrorTelefone("");
    setErrorDataNascimento("");
    setErrorSenha("");

    if (!isStep1Filled()) {
      alert("Preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    if (!validarStep1()) {
      return;
    }

    setStep(2);
  };

  const handlePrev = () => {
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

    // Limpa erros antes de validar tudo
    setErrorTelefone("");
    setErrorEnderecoGeral("");
    setErrorCEP("");
    setErrorEstado("");
    setErrorCidade("");
    setErrorBairro("");
    setErrorRua("");
    setErrorNumero("");
    setErrorEmail("");
    setErrorNome("");
    setErrorDataNascimento("");
    setErrorSenha("");

    // Valida Step 1 antes de qualquer coisa:
    const step1Valido = validarStep1();
    if (!step1Valido) {
      alert("Existem erros no primeiro passo. Você será redirecionado para corrigi-los.");
      setStep(1);
      return;
    }

    // Verifica se telefone já existe
    const telefoneSemMascara = formData.Telefone.replace(/\D/g, "");
    const telefoneJaExiste = await checarTelefoneExistente(telefoneSemMascara);

    if (telefoneJaExiste) {
      setErrorTelefone("Este telefone já está cadastrado.");
      setStep(1);
      return;
    }

    // Valida endereço e Step 2
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
      // Cria usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.Email,
        formData.SenhaHash
      );
      createdFirebaseUser = userCredential.user;
      const firebaseUserId = createdFirebaseUser.uid;

      // Prepara payload do endereço
      const enderecoPayload = {
        ...formDataEndereco,
        CEP: formDataEndereco.CEP.replace(/\D/g, ""),
        UsuarioId: firebaseUserId,
      };

      // Cria endereço na API
      const responseEndereco = await fetch(
        "https://artenza.onrender.com/Endereco",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enderecoPayload),
        }
      );

      if (!responseEndereco.ok) {
        throw new Error(await responseEndereco.text());
      }
      const endereco = await responseEndereco.json();

      // Prepara payload do usuário
      const usuarioPayload = {
        NomeCompleto: formData.NomeCompleto,
        Email: formData.Email,
        Telefone: telefoneSemMascara,
        SenhaHash: formData.SenhaHash,
        IdEndereco: endereco.id ?? endereco.Id,
        isAdmin: false,
        DiaNascimento: parseInt(formData.DiaNascimento, 10) || 0,
        MesNascimento: parseInt(formData.MesNascimento, 10) || 0,
        AnoNascimento: parseInt(formData.AnoNascimento, 10) || 0,
        PerfilUrl:
          formData.PerfilUrl || "https://exemplo.com/default-profile.png",
      };

      // Cria usuário na API
      const responseUsuario = await fetch(
        "https://artenza.onrender.com/Usuario",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioPayload),
        }
      );

      if (!responseUsuario.ok) {
        throw new Error(await responseUsuario.text());
      }

      // Salva dados no localStorage
      localStorage.setItem("nomeUsuario", formData.NomeCompleto);
      localStorage.setItem("email", formData.Email);
      localStorage.setItem("isAdmin", "false");
      localStorage.setItem("perfilUrl", formData.PerfilUrl || "");
      window.dispatchEvent(new Event("storage"));

      setSuccessMessage("Cadastro realizado com sucesso!");
      setFormData(initialFormData);
      setFormDataEndereco(initialAddress);
      setStep(1);
      setTimeout(() => {
        navigate("/Login");
      }, 3000);

    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setErrorEmail("Este email já está cadastrado. Faça login ou use outro email.");
        setStep(1);
      } else if (error.code === "auth/invalid-email") {
        setErrorEmail("O formato do email é inválido.");
        setStep(1);
      } else {
        setErrorEnderecoGeral(
          "Erro ao realizar cadastro. " + (error?.message || error)
        );
      }

      // Se criou no Firebase, mas API falhou → apaga o usuário Firebase criado
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
          {step === 1 && (
            <>
              {/* <div className="steps-indicator">
                <div className="completo">
                  <span>1</span>
                  <FontAwesomeIcon icon={faUser} />
                  <p>Dados</p>
                </div>
                <div className="icompleto">
                  <span>2</span>
                  <FontAwesomeIcon icon={faHouse} />
                  <p>Endereço</p>
                </div>
              </div> */}
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

                <div className="data-telefone">
                  <div className="form-group-cadastro">
                    <label htmlFor="Telefone">Telefone:</label>
                    <input
                      type="text"
                      name="Telefone"
                      value={formData.Telefone}
                      onChange={handleChange}
                      onBlur={handleBlurTelefone}  // dispara a checagem ao perder o foco
                      maxLength={15}
                      placeholder="(99) 99999-9999"
                    />
                  </div>

                  <div className="form-group-cadastro">
                    <label htmlFor="DataNascimento">Data de Nascimento:</label>
                    <input
                      type="date"
                      name="DataNascimento"
                      value={formData.DataNascimento}
                      onChange={handleChangeDate}
                      max="2010-12-31"
                      placeholder="Selecione sua data de nascimento"
                    />
                  </div>
                </div>

                <div className="erros-tel-data">
                  {errorTelefone && <p className="error-message">{errorTelefone}</p>}
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
                {successMessage && (
                  <div className="mensagem-sucesso">
                    <p>{successMessage}</p>
                  </div>
                )}
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
            </>
          )}

          {step === 2 && (
            <>
              <div className="steps-indicator">endereco</div>
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
            </>
          )}
        </form>
      </div>
      <div className="cadastro-banner">
      </div>
    </div>
  );
};

export default Cadastro;
