import 'swiper/css';
import 'swiper/css/navigation';
import './Banner.css';
import React, { useRef, useEffect, useState } from 'react';

const slides = [
  {
    image: '././img/fundo.png',
    title: "Blusa da Bielv",
    subtitle: 'Novos lançamentos da marca',
  },
  {
    image: 'https://static.vecteezy.com/ti/fotos-gratis/p2/48987511-streetwear-conjunto-moda-modelo-na-moda.jpg',   
    title: "Blusa da Bielv",
    subtitle: 'Novos lançamentos da marca',
  },
  {
    image: 'https://static.vecteezy.com/ti/fotos-gratis/p2/48987511-streetwear-conjunto-moda-modelo-na-moda.jpg',    
    title: "Blusa da Bielv",
    subtitle: 'Novos lançamentos da marca',
  },
];

const Banner = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    const slideWidth = container.offsetWidth;
    container.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth',
    });
  };

  const scrollLeft = () => {
    const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const newIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 55000); // 5 segundos

    return () => clearInterval(interval);
  }, [currentIndex]); // Dependente do índice

  return (
    <div className="carousel-wrapper">
      <button className="carousel-button left" onClick={scrollLeft}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      <div className="carousel-container" ref={carouselRef}>
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img src={slide.image} alt={slide.title} />
            <div className="carousel-text">
              <h2 className='element-title'>{slide.title}</h2>
              <p className='element-text'>{slide.subtitle}</p>
              <button className='element-btn'>Saiba Mais</button>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-button right" onClick={scrollRight}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Banner;
