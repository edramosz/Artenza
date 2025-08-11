import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../PaineisAdmin/AdminForms.css';

const AdicionarProduto = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [urlsImagem, setUrlsImagem] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [estoque, setEstoque] = useState("");
  const [tamanhos, setTamanhos] = useState([]);
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
      Nome: nome,
      Preco: isNaN(parseFloat(preco)) ? 0 : parseFloat(preco),
      Descricao: descricao,
      UrlImagens: urlsImagem,
      Categoria: categoria,
      Estoque: isNaN(parseInt(estoque)) ? 0 : parseInt(estoque),
      Tamanhos: tamanhos,
      Material: material,
      Cor: cor,
      Genero: genero,
      Tipo: tipo,
      Marca: marca
    };



    try {

      if (!nome || !descricao || !cor || !tipo || !marca || !genero || !material || !categoria || tamanhos.length === 0) {
        setErro("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const response = await fetch("https://artenza.onrender.com/Produto", {
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
    <div className="form-container">
      <button onClick={() => navigate(-1)} className="form-button-back">
        Voltar
      </button>
      <h2 className="form-title">Adicionar Produto</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="nome">Nome:</label>
        <input className="form-input" type="text" id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} />

        <label className="form-label" htmlFor="preco">Preço:</label>
        <input className="form-input" type="number" id="preco" required value={preco} onChange={(e) => setPreco(e.target.value)} />

        <label className="form-label" htmlFor="descricao">Descrição:</label>
        <textarea id="descricao" required value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <label className="form-label" htmlFor="imagem">Imagens:</label>
        <input className="form-input"
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

        <label className="form-label" htmlFor="categoria">Categoria:</label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className="form-input"
        >
          <option value="">Selecione</option>
          <option value="Blusa">Blusa</option>
          <option value="Calçado">Calçado</option>
          <option value="Acessórios">Acessórios</option>
          <option value="Calças">Calças</option>
          <option value="Short">Short</option>
        </select>


        <label className="form-label" htmlFor="estoque">Estoque:</label>
        <input className="form-input" type="number" required id="estoque" value={estoque} onChange={(e) => setEstoque(e.target.value)} />

        <label className="form-label" htmlFor="tamanhos">Tamanhos:</label>
        <input className="form-input" type="text" required id="tamanhos"
          value={tamanhos.join(", ")}
          onChange={(e) => setTamanhos(e.target.value.split(",").map(t => t.trim()))}
        />


        <label className="form-label" htmlFor="material">Material:</label>
        <input className="form-input" type="text" required id="material" value={material} onChange={(e) => setMaterial(e.target.value)} />

        <label className="form-label" htmlFor="cor">Cor:</label>
        <input className="form-input" type="text" required id="cor" value={cor} onChange={(e) => setCor(e.target.value)} />

        <label className="form-label" htmlFor="genero">Gênero:</label>
        <select
          id="genero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          required
          className="form-input"
        >
          <option value="">Selecione</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Unissex">Unissex</option>
        </select>
        
        <label className="form-label" htmlFor="tipo">Tipo:</label>
        <input className="form-input" type="text" required id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />

        <label className="form-label" htmlFor="marca">Marca:</label>
        <input className="form-input" type="text" required id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} />

        <button type="submit" className="form-button">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default AdicionarProduto;
