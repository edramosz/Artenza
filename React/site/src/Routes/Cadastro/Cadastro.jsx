import React, { useState } from 'react';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    NomeCompleto: '',
    Email: '',
    Telefone: '',
    DataNascimento: '',
    Senha: '',
    IdEndereco: 'string' // Você pode ajustar isso conforme sua lógica
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepara o payload sem incluir o campo Id
    const { NomeCompleto, Email, Telefone, DataNascimento, Senha, IdEndereco } = formData;
    const payload = {
      NomeCompleto,
      Email,
      Telefone,
      DataNascimento,
      Senha,
      IdEndereco
    };

    try {
      const response = await fetch('https://localhost:7294/Usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro do backend:', errorData);

        if (errorData.errors?.Id) {
          console.error('Erro no campo Id:', errorData.errors.Id[0]);
        }

        throw new Error('Erro ao cadastrar usuário');
      }

      const data = await response.json();
      console.log('Usuário cadastrado com sucesso:', data);
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro detalhado:', error);
      alert('Erro ao cadastrar usuário. Veja o console para mais detalhes.');
    }
  };

  return (
    <div className="form-container">
      <h2>Cadastre-se</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="NomeCompleto">Nome Completo:</label>
          <input
            type="text"
            name="NomeCompleto"
            id="NomeCompleto"
            value={formData.NomeCompleto}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            name="Email"
            id="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Telefone">Telefone:</label>
          <input
            type="tel"
            name="Telefone"
            id="Telefone"
            value={formData.Telefone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="DataNascimento">Data de Nascimento:</label>
          <input
            type="date"
            name="DataNascimento"
            id="DataNascimento"
            value={formData.DataNascimento}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Senha">Senha:</label>
          <input
            type="password"
            name="Senha"
            id="Senha"
            value={formData.Senha}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Cadastrar" className="form-button" />
        </div>
      </form>
    </div>
  );
}
