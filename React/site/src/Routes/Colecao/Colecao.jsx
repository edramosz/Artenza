import React, { useEffect, useState } from 'react';
import './Colecao.css';
import { Link } from 'react-router-dom';

const Colecao = () => {
     // Cria um estado 'produtos' para armazenar os produtos que virão da API
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        const buscarProdutos = async () => {
            try {
                // Requisição GET para buscar os produtos da API
                const resposta = await fetch('https://localhost:7294/Produto');
                const dados = await resposta.json();
                setProdutos(dados); // Atualiza o estado com os dados recebidos
            } catch (erro) {
                console.error('Erro ao buscar produtos:', erro);
            }
        };

        buscarProdutos(); // Executa a função assim que o componente monta
    }, []);

    return (
        <div className="colecao-container">
            <aside className="filtro-lateral">
                {/* Filtros visuais estáticos para futuras interações */}
                <h3>Cores</h3>
                <ul className="filtro-lista">
                    <li><span className="cor cor-amarelo" /> Amarelo</li>
                    <li><span className="cor cor-azul" /> Azul</li>
                    <li><span className="cor cor-bege" /> Bege</li>
                    <li><span className="cor cor-preto" /> Preto</li>
                </ul>

                <h3>Tamanho</h3>
                <div className="filtro-tamanhos">
                    {/* Botões de tamanho sem funcionalidade no momento */}
                    {['26', '28', '30', '32', '34', '36'].map(tam => (
                        <button key={tam}>{tam}</button>
                    ))}
                </div>
            </aside>

            <main className="lista-produtos">
                {/* Geração dinâmica dos cards de produto com base no estado */}
                {produtos.map(prod => (
                    <Link to={`/produto/${prod.id}`} key={prod.id}>
                        <div className="card-produto">
                            <img src={prod.urlImagem} alt={prod.nome} />
                            <h4>{prod.nome}</h4>
                            <p>{prod.categoria}</p>
                            {/* Formata o preço para padrão brasileiro (R$ 0.000,00) */}
                            <p>{prod.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </Link>
                ))}
            </main>
        </div>
    );
};

export default Colecao;
