import 'swiper/css';
import 'swiper/css/navigation';
import './Banner.css';
import React, { useRef, useEffect } from 'react';

const slides = [
    {
        image: '././img/fundo.png',
        title: 'SS\'24',
        subtitle: 'Poppies on the sea',
    },
    {
        image: 'https://media.istockphoto.com/id/1682399954/pt/vetorial/dark-abstract-urban-style-hiphop-graffiti-street-art.jpg?s=612x612',
        title: 'FW\'24',
        subtitle: 'Autumn Breeze',
    },
    {
        image: 'https://static.vecteezy.com/ti/fotos-gratis/p2/48987511-streetwear-conjunto-moda-modelo-na-moda.jpg',
        title: 'SS\'25',
        subtitle: 'Sunset Glow',
    },
];

const Banner = () => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        const width = carouselRef.current.offsetWidth * 0.8;
        carouselRef.current.scrollBy({ left: -width, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const width = carouselRef.current.offsetWidth * 0.8;
        carouselRef.current.scrollBy({ left: width, behavior: 'smooth' });
    };

    // Autoplay effect
    useEffect(() => {
        const interval = setInterval(() => {
            scrollRight();
        }, 10000); // 4 segundos

        return () => clearInterval(interval); // limpa ao desmontar
    }, []);

    return (
        <div className="carousel-wrapper">
            <button className="carousel-button left" onClick={scrollLeft}><i class="fa-solid fa-chevron-left"></i></button>

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

            <button className="carousel-button right" onClick={scrollRight}><i class="fa-solid fa-chevron-right"></i></button>
        </div>
    );
};

export default Banner;
