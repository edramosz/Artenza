import { useEffect, useState, Link } from "react";
import "./Masculino.css";


const Masculino = () => {
    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const buscarProdMasc = async () => {
            try {
                const response = await fetch("colocar endpoint");

                if (!response.ok) {
                    throw new Error(" colocar o erro" + response.status);
                }

                const data = await response.json();

                const dataComImagem = data.map(produto => ({
                    ...produto,
                    urlImagens: Array.isArray(produto.urlImagens) && produto.urlImagens.length > 0 && produto.urlImagens[0] !== "string"
                        ? produto.urlImagens
                        : ["http://via.placeholder.com/300x200.png?text=Produto+sem+imagem"]
                }));

                setProdutos(dataComImagem);
            }

            catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setErro("Não foi possível carregar os produtos.");
            }
        };
        buscarProdMasc();
    }, []);

    return (
        <div className="masc-container">
            <div className="masc-content">
                <h1>Roupas Masculinas</h1>
                <h3>Encontre as melhores vestimentas para o dia a dia. </h3>
            </div>
            <div className="masc-img">
                <div className="content-img">
                    <h3>Nossa coleção</h3>
                    <button>Saiba mais</button>
                </div>
            </div>
            <div className="masc-produtos">
                {produtos.map(prods, index => (
                    <div className="card-prods" key={index}>
                        <div>
                            <img
                                src={prod.urlImagens[0]}
                                alt={prod.nome}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "http://via.placeholder.com/300x200.png?text=Produto+sem+imagem";
                                }} />
                        </div>
                        <div>
                            <h4>{prod.nome}</h4>
                            <p>{prod.categoria}</p>
                            <p>{prod.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                        <div className="btns-actions">
                            <button>Adicione ao Carrinho</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Masculino;
