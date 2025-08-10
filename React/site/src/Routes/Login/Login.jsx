import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";
import './Login.css';
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

 function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false); // controle de visibilidade
  const [animarOlho, setAnimarOlho] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const response = await fetch(`https://artenza.onrender.com/Usuario/por-email/${email}`);

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
      localStorage.setItem("email", email);
      localStorage.setItem("telefone", usuario.telefone);
      localStorage.setItem("dataCadastro", usuario.dataCadastro);
      localStorage.setItem("perfilUrl", usuario.perfilUrl || "");

      window.dispatchEvent(new Event("storage"));
      alert("Login feito com sucesso!");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro no login:", error);
      if (error.code === "auth/invalid-credential") {
        setErro("Email ou senha inválidos.");
      } else {
        setErro("Erro ao tentar logar. Tente novamente.");
      }
    }
  };



  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
    setAnimarOlho(true);

    // Remove a classe de animação após o tempo da transição
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
            <Link>Esqueceu sua senha?</Link>
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          <button type="submit" className="logar-btn">Entrar</button>

          <div className="login-google">
            <div className="ou">
              <label></label>
              <p>ou</p>
              <label></label>
            </div>
            <button className="logar-google">
              <img src='../../../public/img/logo-google.png' alt="" />
              Continuar com o Google
            </button>
          </div>

          <div className="termo-link">
            <Link>Temos de Serviços</Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
