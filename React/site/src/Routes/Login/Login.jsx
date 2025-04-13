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
      // 🔹 Faz login com Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);

      // 🔹 Consulta a sua API para obter os dados do usuário pelo e-mail
      const response = await fetch(`https://localhost:7294/Usuario/por-email/${email}`);
      if (!response.ok) {
        throw new Error("Usuário não encontrado na API");
      }

      const usuario = await response.json();
      
      // 🔹 Salva o nome no localStorage
      localStorage.setItem("nomeUsuario", usuario.NomeCompleto); // ← ATENÇÃO ao nome da propriedade que vem da API

      alert("Login feito com sucesso!");
      navigate("/"); // Redireciona para home ou dashboard

    } catch (error) {
      console.error("Erro no login:", error.message);
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
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
