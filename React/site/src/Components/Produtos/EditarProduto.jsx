import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarProduto = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtém o id do produto da URL

  // Estados para armazenar os dados do produto
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

  // Carregar o produto existente ao montar o componente
  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`https://localhost:7294/Produto/${id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar produto.");
        }
        const data = await response.json();
        setNome(data.nome);
        setPreco(data.preco);
        setDescricao(data.descricao);
        setUrlImagem(data.urlImagem);
        setCategoria(data.categoria);
        setEstoque(data.estoque);
        setTamanho(data.tamanho);
        setMaterial(data.material);
        setCor(data.cor);
        setGenero(data.genero);
        setTipo(data.tipo);
        setMarca(data.marca);
      } catch (error) {
        setErro("Erro ao carregar o produto.");
        console.error(error);
      }
    };

    fetchProduto();
  }, [id]);

  // Função para enviar os dados atualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nome || !preco || !descricao) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
  
    const produtoAtualizado = {
      id, // Adiciona o id no corpo da requisição
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
  
    try {
      const response = await fetch(`https://localhost:7294/Produto/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(produtoAtualizado)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Erro ao atualizar produto: " + errorText);
      }
  
      alert("Produto atualizado com sucesso!");
      navigate("/Admin"); // Redireciona para o painel de administração
    } catch (error) {
      setErro("Erro ao atualizar o produto. Tente novamente.");
      console.error("Erro detalhado:", error.message);
    }
  };
  

  return (
    <div className="editar-produto">
      
      <button onClick={() => navigate(-1)} className="btn-voltar">Voltar</button>
      <h2>Editar Produto</h2>
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

        <button type="submit">Atualizar Produto</button>
      </form>
    </div>
  );
};

export default EditarProduto;
