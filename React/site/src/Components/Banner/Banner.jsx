import 'swiper/css';
import 'swiper/css/navigation';
import './Banner.css';
import React, { useRef, useEffect, useState } from 'react';

const slides = [
  {
    image: '././img/fundo.png',
    title: "SS'24",
    subtitle: 'Poppies on the sea',
  },
  {
    image: 'https://media.istockphoto.com/id/1682399954/pt/vetorial/dark-abstract-urban-style-hiphop-graffiti-street-art.jpg?s=612x612',
    title: "FW'24",
    subtitle: 'Autumn Breeze',
  },
  {
    image: 'https://static.vecteezy.com/ti/fotos-gratis/p2/48987511-streetwear-conjunto-moda-modelo-na-moda.jpg',
    title: "SS'25",
    subtitle: 'Sunset Glow',
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
    }, 5000); // 5 segundos

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
              <h2>{slide.title}</h2>
              <p>{slide.subtitle}</p>
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
