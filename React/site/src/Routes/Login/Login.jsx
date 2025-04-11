import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Components/Db/FireBase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login feito com sucesso!");
      // redirecionar ou navegar após login
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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
  );
}
