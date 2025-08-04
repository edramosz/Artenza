

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favoritos.css';
import NavProfile from '../NavProfile';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarFavoritos = async () => {
      try {
        const usuarioId = localStorage.getItem('idUsuario');
        const resposta = await fetch(`https://artenza.onrender.com/Favorito/${usuarioId}`);
        if (!resposta.ok) throw new Error('Erro ao buscar favoritos');

        const dados = await resposta.json();
        setFavoritos(dados);
      } catch (erro) {
        console.error('Erro ao carregar favoritos:', erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarFavoritos();
  }, []);

  return (

    <div className='perfil-page'>
      <NavProfile />
      <div className="pagina-favoritos">
        <h1>Meus Favoritos</h1>
        {carregando ? (
          <p>Carregando...</p>
        ) : favoritos.length === 0 ? (
          <p>Você ainda não tem favoritos.</p>
        ) : (
          <div className="produtos-container">
            {favoritos.map((prod) => (
              <Link to={`/produto/${prod.id}`} key={prod.id} className="link-produto">
                <div className="card-prods">
                  <img
                    src={prod.urlImagens?.[0]}
                    alt={prod.nome}
                    onError={(e) => {
                      e.target.src =
                        'http://via.placeholder.com/300x200.png?text=Produto+sem+imagem';
                    }}
                  />
                  <div className="text-card">
                    <h4 className="nome">{prod.nome}</h4>
                    <p className="categoria">{prod.categoria}</p>
                    <p className="preco">
                      {prod.preco?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
