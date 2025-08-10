import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";
import './Login.css';
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [animarOlho, setAnimarOlho] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      await buscarUsuarioEArmazenar(email);

    } catch (error) {
      console.error("Erro no login:", error);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setErro("Email ou senha inválidos.");
      } else {
        setErro("Erro ao tentar logar. Tente novamente.");
      }
    }
  };

  // Função para buscar usuário na API e salvar no localStorage
  const buscarUsuarioEArmazenar = async (emailUsuario) => {
    try {
      const response = await fetch(`https://artenza.onrender.com/Usuario/por-email/${emailUsuario}`);
      if (!response.ok) throw new Error("Usuário não encontrado na API");
      const usuario = await response.json();

      const { diaNascimento, mesNascimento, anoNascimento } = usuario;
      const dataNascimentoCompleta = `${anoNascimento}-${String(mesNascimento).padStart(2, '0')}-${String(diaNascimento).padStart(2, '0')}`;
      localStorage.setItem("dataNascimento", dataNascimentoCompleta);

      const nomes = usuario.nomeCompleto.trim().split(" ");
      const primeiroNome = nomes.length >= 2 ? `${nomes[0]} ${nomes[1]}` : nomes[0];

      localStorage.setItem("idUsuario", usuario.id);
      localStorage.setItem("idEndereco", usuario.idEndereco);
      localStorage.setItem("nomeUsuario", primeiroNome);
      localStorage.setItem("nomeCompletoUser", usuario.nomeCompleto);
      localStorage.setItem("isAdmin", usuario.isAdmin);
      localStorage.setItem("email", emailUsuario);
      localStorage.setItem("telefone", usuario.telefone);
      localStorage.setItem("dataCadastro", usuario.dataCadastro);
      localStorage.setItem("perfilUrl", usuario.perfilUrl || "");

      window.dispatchEvent(new Event("storage"));
      setSuccessMessage("Login feito com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error) {
      console.error("Erro ao buscar usuário na API:", error);
      setErro("Erro ao buscar dados do usuário. Tente novamente.");
    }
  };

  // Login com Google
  const handleLoginGoogle = async () => {
    setErro("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // O usuário autenticado
      const user = result.user;

      // Buscar dados do usuário na API pelo email do Google
      await buscarUsuarioEArmazenar(user.email);
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setErro("Erro ao tentar logar com Google. Tente novamente.");
    }
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
    setAnimarOlho(true);
    setTimeout(() => setAnimarOlho(false), 300);
  };

  return (
    <div className="login-container-hero">
      <div className="login-banner"></div>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h2 className="title">Login</h2>

          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="Senha">Senha:</label>
          <div className="input-senha-container">
            <input
              className="input-senha"
              type={mostrarSenha ? "password" : "text"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              className={`btn-olho ${animarOlho ? "animar" : ""}`}
              onClick={toggleMostrarSenha}
            >
              <FontAwesomeIcon icon={mostrarSenha ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className="esqueceu-senha">
            <Link to="/esqueceu-senha">Esqueceu sua senha?</Link>
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {successMessage && (
            <div className="mensagem-sucesso">
              <p>{successMessage}</p>
            </div>
          )}

          <button type="submit" className="logar-btn">Entrar</button>

          <div className="login-google">
            <div className="ou">
              <label></label>
              <p>ou</p>
              <label></label>
            </div>
            <button
              type="button"
              className="logar-google"
              onClick={handleLoginGoogle}
            >
              <img src='../../../public/img/logo-google.png' alt="Google" />
              Continuar com o Google
            </button>
          </div>

          <div className="termo-link">
            <Link to="/termos-de-servico">Termos de Serviços</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
