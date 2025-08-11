import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EsqueceuSenha = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [idUsuario, setIdUsuario] = useState(null);

    const navigate = useNavigate()

    // STEP 1 → enviar email com código
    const handleEnviarEmail = async () => {
        setErro("");

          if (!email) {
            setErro("Por favor, digite seu email.");
            return;
        }
        const novoCodigo = {
            Email: email
        }
        try {
            // 🔹 CONSUMIR SEU ENDPOINT DE ENVIO DE EMAIL AQUI:
             await fetch("https://artenza.onrender.com/Email/recuperar-senha", 
                { 
                    method: "POST", 
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify( novoCodigo ) 
                    
                })
            console.log(novoCodigo);
            setStep(2); // Avança para inserir código
        } catch (err) {
            setErro("Erro ao enviar email. Tente novamente.");
        }
    };

    // STEP 2 → validar código
    const handleValidarCodigo = async () => {
        setErro("");

        try {
            // 🔹 CONSUMIR SEU ENDPOINT DE VALIDAÇÃO DE CÓDIGO AQUI:
            // const resp = await fetch(`/api/validar-codigo?email=${email}&codigo=${codigo}`)
            // if (!resp.ok) throw new Error();

            // 🔹 Se precisar do idUsuario para trocar a senha, busque agora:
            // const userResp = await fetch(`/api/usuario/por-email/${email}`);
            // const usuario = await userResp.json();
            // setIdUsuario(usuario.id);

            setStep(3); // Avança para redefinição de senha
        } catch (err) {
            setErro("Código inválido ou expirado.");
        }
    };

    // STEP 3 → trocar senha
    const handleTrocarSenha = async () => {
        setErro("");

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        try {
            // 🔹 PATCH PARA ALTERAR SENHA
            // await fetch(`/api/usuario/${idUsuario}/senha`, {
            //   method: "PATCH",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ senha: novaSenha })
            // });

            alert("Senha alterada com sucesso!");
            setStep(4);

            // 🔹 Aguarda 3 segundos e redireciona para login
            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            setErro("Erro ao alterar senha. Tente novamente.");
        }
    };

    return (
        <div className="container-senha">
            <h2>Redefinir senha</h2>

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            {step === 1 && (
                <>
                    <p>Digite seu email para receber o código de redefinição:</p>
                    <input
                        type="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleEnviarEmail}>Enviar código</button>
                </>
            )}

            {step === 2 && (
                <>
                    <p>Digite o código recebido no seu email:</p>
                    <input
                        type="text"
                        placeholder="Código"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    <button onClick={handleValidarCodigo}>Validar código</button>
                </>
            )}

            {step === 3 && (
                <>
                    <p>Digite sua nova senha:</p>
                    <input
                        type="password"
                        placeholder="Nova senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                    <button onClick={handleTrocarSenha}>Salvar nova senha</button>
                </>
            )}

            {step === 4 && (
                <>
                    <p>Senha alterada com sucesso! Você já pode fazer login.</p>
                </>
            )}

            {step !== 4 && (
                <button onClick={() => window.history.back()}>Voltar ao Login</button>
            )}
        </div>
    );
};

export default EsqueceuSenha;
