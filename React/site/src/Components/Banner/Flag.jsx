import React from 'react';
import { useLocation } from 'react-router-dom';
import './Flag.css';

const Flag = () => {
  const location = useLocation();

  let bgImage = 'url("/img/fundo-default.png")';
  if (location.pathname.includes('masculino')) {
    bgImage = ' url("../../../public/img/banner-masc5.png")';

  } else if (location.pathname.includes('feminino')) {
    bgImage = 'url("/img/feminino.jpg")';
  }

  return (
    <div 
      className="flag-container"
      style={{ backgroundImage: bgImage }}
    >
    </div>
  );
};

export default Flag;
