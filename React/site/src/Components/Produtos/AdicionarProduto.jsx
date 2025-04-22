import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdicionarProduto = () => {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlImagem, setUrlImagem] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [material, setMaterial] = useState("");
  const [cor, setCor] = useState("");
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const [marca, setMarca] = useState("");

  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nome || !preco || !descricao) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    const novoProduto = {
      nome,
      preco: isNaN(parseFloat(preco)) ? 0 : parseFloat(preco),
      descricao,
      urlImagem,
      categoria,
      estoque: isNaN(parseInt(estoque)) ? 0 : parseInt(estoque),
      tamanho,
      material,
      cor,
      genero,
      tipo,
      marca
    };
  
    console.log("Enviando produto:", JSON.stringify(novoProduto, null, 2));
  
    try {
      const response = await fetch("https://localhost:7294/Produto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(novoProduto)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Erro ao adicionar produto: " + errorText);
      }
  
      alert("Produto adicionado com sucesso!");
      navigate("/Admin");
    } catch (error) {
      setErro("Erro ao adicionar o produto. Tente novamente.");
      console.error("Erro detalhado:", error.message);
    }
  };
  

  return (
    <div className="adicionar-produto">
      <h2>Adicionar Produto</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <label htmlFor="preco">Preço:</label>
        <input
          type="number"
          id="preco"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />

        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        ></textarea>

        <label htmlFor="urlImagem">URL da Imagem:</label>
        <input
          type="text"
          id="urlImagem"
          value={urlImagem}
          onChange={(e) => setUrlImagem(e.target.value)}
        />

        <label htmlFor="categoria">Categoria:</label>
        <input
          type="text"
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        <label htmlFor="estoque">Estoque:</label>
        <input
          type="number"
          id="estoque"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
        />

        <label htmlFor="tamanho">Tamanho:</label>
        <input
          type="text"
          id="tamanho"
          value={tamanho}
          onChange={(e) => setTamanho(e.target.value)}
        />

        <label htmlFor="material">Material:</label>
        <input
          type="text"
          id="material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        />

        <label htmlFor="cor">Cor:</label>
        <input
          type="text"
          id="cor"
          value={cor}
          onChange={(e) => setCor(e.target.value)}
        />

        <label htmlFor="genero">Gênero:</label>
        <input
          type="text"
          id="genero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />

        <label htmlFor="tipo">Tipo:</label>
        <input
          type="text"
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <label htmlFor="marca">Marca:</label>
        <input
          type="text"
          id="marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />

        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default AdicionarProduto;
