import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdicionarProduto.css';

const AdicionarProduto = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlsImagem, setUrlsImagem] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [material, setMaterial] = useState("");
  const [cor, setCor] = useState("");
  const [genero, setGenero] = useState("");
  const [tipo, setTipo] = useState("");
  const [marca, setMarca] = useState("");
  const [erro, setErro] = useState("");

  const handleMultipleImageUpload = async (files) => {
    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Artenza"); // seu upload preset
        formData.append("cloud_name", "drit350g5");

        const res = await fetch("https://api.cloudinary.com/v1_1/drit350g5/image/upload", {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      setUrlsImagem(uploadedUrls);
    } catch (err) {
      console.error("Erro ao fazer upload das imagens:", err);
      setErro("Erro ao fazer upload das imagens.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco || !descricao || urlsImagem.length === 0) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const novoProduto = {
      nome,
      preco: isNaN(parseFloat(preco)) ? 0 : parseFloat(preco),
      descricao,
      urlImagens: urlsImagem, // nome atualizado para bater com backend
      categoria,
      estoque: isNaN(parseInt(estoque)) ? 0 : parseInt(estoque),
      tamanho,
      material,
      cor,
      genero,
      tipo,
      marca
    };


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
      navigate(-1);
    } catch (error) {
      setErro("Erro ao adicionar o produto. Tente novamente.");
      console.error("Erro detalhado:", error.message);
    }
  };

  return (
    <div className="adicionar-produto">
      <h2>Adicionar Produto</h2>
      <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome:</label>
        <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label htmlFor="preco">Preço:</label>
        <input type="number" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} required />

        <label htmlFor="descricao">Descrição:</label>
        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />

        <label htmlFor="imagem">Imagens:</label>
        <input
          type="file"
          id="imagem"
          accept="image/*"
          multiple
          required
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
              handleMultipleImageUpload(files);
            }
          }}
        />
        {urlsImagem.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
            {urlsImagem.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index + 1}`} style={{ width: "100px", borderRadius: "4px", border: "1px solid #ccc" }} />
            ))}
          </div>
        )}

        <label htmlFor="categoria">Categoria:</label>
        <input type="text" id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />

        <label htmlFor="estoque">Estoque:</label>
        <input type="number" id="estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} />

        <label htmlFor="tamanho">Tamanho:</label>
        <input type="text" id="tamanho" value={tamanho} onChange={(e) => setTamanho(e.target.value)} />

        <label htmlFor="material">Material:</label>
        <input type="text" id="material" value={material} onChange={(e) => setMaterial(e.target.value)} />

        <label htmlFor="cor">Cor:</label>
        <input type="text" id="cor" value={cor} onChange={(e) => setCor(e.target.value)} />

        <label htmlFor="genero">Gênero:</label>
        <input type="text" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)} />

        <label htmlFor="tipo">Tipo:</label>
        <input type="text" id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />

        <label htmlFor="marca">Marca:</label>
        <input type="text" id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} />

        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default AdicionarProduto;
