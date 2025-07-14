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

      // Consulta na sua API
      const response = await fetch(`https://artenza.onrender.com/Usuario/por-email/${email}`);

      if (!response.ok) {
        throw new Error("Usuário não encontrado na API");
      }

      const usuario = await response.json();
      console.log("Usuário retornado da API:", usuario); // Veja se "telefone" aparece aqui


      // Salva os dados no localStorage

      const { diaNascimento, mesNascimento, anoNascimento } = usuario;

      // Cria uma string no formato ISO: "1988-03-02"
      const dataNascimentoCompleta = `${anoNascimento}-${String(mesNascimento).padStart(2, '0')}-${String(diaNascimento).padStart(2, '0')}`;

      localStorage.setItem("dataNascimento", dataNascimentoCompleta);


      const nomes = usuario.nomeCompleto.trim().split(" ");
      const primeiroNome = nomes.length >= 2 ? `${nomes[0]} ${nomes[1]}` : nomes[0];

      const emailMaiusculo = email;

      // const firebaseEmail = userCredential.user.email;  --- CÓDIGO ANTIGO COM ERRO NAS MAIÚSCULAS

      localStorage.setItem("idUsuario", usuario.id);
      localStorage.setItem("idEndereco", usuario.idEndereco);
      localStorage.setItem("nomeUsuario", primeiroNome);
      localStorage.setItem("nomeCompletoUser", usuario.nomeCompleto);
      localStorage.setItem("isAdmin", usuario.isAdmin);
      localStorage.setItem("email", emailMaiusculo);
      localStorage.setItem("telefone", usuario.telefone);
      localStorage.setItem("dataCadastro", usuario.dataCadastro);
      localStorage.setItem("perfilUrl", usuario.perfilUrl || "");




      console.log(emailMaiusculo);
      window.dispatchEvent(new Event("storage")); // ← dispara atualização da navbar
      alert("Login feito com sucesso!");
      window.location.href = "/"; // recarrega a página para garantir que localStorage esteja disponível

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
