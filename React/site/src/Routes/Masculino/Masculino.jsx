import { useEffect, useState, Link } from "react";
import "./Masculino.css";


const Masculino = () => {
    const [produtos, setProdutos] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        const buscarProdMasc = async () => {
            try {
                const response = await fetch("colocar o endpoint");

                if (!response.ok) {
                    throw new Error(" colocar o erro" + response.status);
                }

                const data = await response.json();
                setProdutos(data);
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
                    <h3>Nossa coleçao</h3>
                    <button>Saiba mais</button>
                </div>
            </div>
            <div className="masc-produtos">


            </div>
        </div>
    );
};

export default Masculino;
