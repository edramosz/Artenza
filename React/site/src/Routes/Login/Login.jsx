import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";
import './Login.css';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log("Usuário autenticado no Firebase:", userCredential.user);

      // Consulta na sua API
      const response = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);

      if (!response.ok) {
        throw new Error("Usuário não encontrado na API");
      }

      const usuario = await response.json();
      console.log("Dados do usuário na API:", usuario);

      // Salva os dados no localStorage

      //const primeiroNome = usuario.nomeCompleto.split(" ")[0];

      const nomes = usuario.nomeCompleto.trim().split(" ");
      const primeiroNome = nomes.length >= 2 ? `${nomes[0]} ${nomes[1]}` : nomes[0];

      localStorage.setItem("nomeUsuario", primeiroNome);
      localStorage.setItem("isAdmin", usuario.isAdmin); // <-- salva aqui como string
      window.dispatchEvent(new Event("storage")); // ← dispara atualização da navbar

      alert("Login feito com sucesso!");
      navigate("/"); // redireciona usando o React Router

    } catch (error) {
      console.error("Erro no login:", error);
      if (error.code === "auth/invalid-credential") {
        setErro("Email ou senha inválidos.");
      } else {
        setErro("Erro ao tentar logar. Tente novamente.");
      }
    }
  };

  return (
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
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
