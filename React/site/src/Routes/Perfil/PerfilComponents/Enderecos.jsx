import React, { useEffect, useState } from 'react';
import './PerfilComponents.css';
import NavProfile from '../NavProfile';

const Enderecos = () => {
  const [usuario, setUsuario] = useState(null);
  const [endereco, setEndereco] = useState(null);

  const email = localStorage.getItem("email");
  const nomeCompleto = localStorage.getItem("nomeCompletoUser");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca o usuário pelo e-mail
        const resUsuario = await fetch(`https://artenza.onrender.com/Usuario/por-email/${email}`);
        const usuarioData = await resUsuario.json();
        setUsuario(usuarioData);

        // Busca o endereço usando o idEndereco do usuário
        const resEndereco = await fetch(`https://artenza.onrender.com/Endereco/${usuarioData.idEndereco}`);
        const enderecoData = await resEndereco.json();
        setEndereco(enderecoData);
      } catch (error) {
        console.error("Erro ao carregar dados do endereço:", error);
      }
    };

    if (email) {
      carregarDados();
    }
  }, [email]);

  return (
    <div className='perfil-page'>
      <NavProfile />
      <div className='enderecos-container'>
        <h2>Meus Endereços</h2>
        {!usuario || !endereco ? (
          <p>Carregando endereço...</p>
        ) : (
          <div className="dados-endereco">
            <p><strong>Nome:</strong> {nomeCompleto}</p>
            <p><strong>Rua:</strong> {endereco.rua}</p>
            <p><strong>Número:</strong> {endereco.numero}</p>
            <p><strong>Bairro:</strong> {endereco.bairro}</p>
            <p><strong>Cidade:</strong> {endereco.cidade}</p>
            <p><strong>CEP:</strong> {endereco.cep}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enderecos;
