import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favoritos.css';
import NavProfile from '../NavProfile';
import { } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarFavoritosComProdutos = async () => {
      try {
        const usuarioId = localStorage.getItem('idUsuario');
        const resposta = await fetch(`https://artenza.onrender.com/Favorito/usuario/${usuarioId}`);

        if (!resposta.ok) throw new Error('Erro ao buscar favoritos');

        const favoritosData = await resposta.json();

        const promessas = favoritosData.map(async (fav) => {
          const res = await fetch(`https://artenza.onrender.com/Produto/${fav.produtoId}`);
          if (!res.ok) throw new Error('Erro ao buscar produto');
          const produto = await res.json();
          return { ...produto, favoritoId: fav.id };
        });

        const produtosComFavoritoId = await Promise.all(promessas);
        setFavoritos(produtosComFavoritoId);
      } catch (erro) {
        console.error('Erro ao carregar produtos dos favoritos:', erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarFavoritosComProdutos();
  }, []);

  const handleRemoverFavorito = async (favoritoId) => {
    try {
      const res = await fetch(`https://artenza.onrender.com/Favorito/${favoritoId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao remover favorito');

      setFavoritos(prev => prev.filter(prod => prod.favoritoId !== favoritoId));
    } catch (erro) {
      console.error('Erro ao excluir favorito:', erro);
    }
  };

  return (
    <div className='perfil-page'>
      <NavProfile />
      <div className="pagina-favoritos">
        {carregando ? (
          <p>Carregando...</p>
        ) : favoritos.length === 0 ? (
          <div className='sem-favoritos'>
            <span><FontAwesomeIcon icon={faHeart} /></span>
            <p>Você ainda não tem favoritos, procure em nossos produtos.</p>
            <button>Ver Produtos</button>
          </div>
        ) : (


          <div className="produtos-container-hero">
            <h1 className='favoritos-title'>Meus Favoritos</h1>
            <div className="produtos-container">
              {favoritos.map((prod) => (
                <div key={prod.id} className="card-prods">
                  <Link to={`/produto/${prod.id}`} className="link-produto">
                    <img
                      src={prod.urlImagens?.[0]}
                      alt={prod.nome}
                      onError={(e) => {
                        e.target.src = 'http://via.placeholder.com/300x200.png?text=Produto+sem+imagem';
                      }}
                    />

                  </Link>
                  <div className="text-card">
                    <div className="head-prod">
                      <p className="categoria">{prod.categoria}</p>
                      <button
                        className="favoritar-btn"
                        onClick={() => handleRemoverFavorito(prod.favoritoId)}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                    </div>
                    <Link to={`/produto/${prod.id}`} className="link-produto">
                      <h4 className="nome">{prod.nome}</h4>
                      <p className="preco">
                        {prod.preco?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
