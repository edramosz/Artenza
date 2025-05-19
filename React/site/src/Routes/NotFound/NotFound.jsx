import React from 'react';
import { Link } from 'react-router-dom';

export const isNotFoundPage = true;

const NotFound = () => {
  return (
    <div className='not-found'>
      <div className="not-found-card">
        <span>não encontramos</span>
        <h1>404 - Página Não Encontrada</h1>
        <h3>A página que você tentou acessar não existe.</h3>
        <p>Parece que não conseguimos encontrar a página da sua procura. Talvez seja melhor verificar o endereço novamente,
          tentar fazer <Link to='/Login'>Login</Link> primeiro ou nos avisar sobre o problema.</p>
      </div>
    </div>
  );
};

export default NotFound;
