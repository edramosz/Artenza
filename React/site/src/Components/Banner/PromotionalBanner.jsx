import React from 'react';
import './PromotionalBanner.css';
import { Link } from 'react-router-dom'

const slides = [
    {
        title: 'ton ton ton sahur',
        subtitle: 'ton ton ',
        image: '././img/fundo.png',
    },
    {
        title: 'liliri lari laa',
        subtitle: 'elefante',
        image: '././img/fundo.png',
    },
];

const sidePromos = [
    {
        title: 'trala leiro lala',
        image: '././img/fundo.png',
    },
    {
        title: 'la vaca saturno',
        image: 'https://i.imgur.com/voHf9HP.png',
    },
];

const PromotionalBanner = () => {
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentSlide = slides[current];

    return (
        <div className="hero-layout">
            <div
                className="carousel"
                style={{
                    backgroundImage: `url(${currentSlide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <button className="btn-caroussel" onClick={() => setCurrent((current - 1 + slides.length) % slides.length)}>
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <div className="carousel-slide">
                    <div className="text-content">
                        <p>{currentSlide.subtitle}</p>
                        <h2>{currentSlide.title}</h2>
                        <Link to='/' className="shop-btn">SHOP kkk</Link>
                    </div>
                </div>
                <button onClick={() => setCurrent((current + 1) % slides.length)}>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
                <div className="dots">
                    {slides.map((_, idx) => (
                        <span
                            key={idx}
                            className={`dot ${idx === current ? 'active' : ''}`}
                            onClick={() => setCurrent(idx)}
                        ></span>
                    ))}
                </div>
            </div>

            <div className="sidebar" >
                {sidePromos.map((promo, index) => (
                    <div
                        className="promo-box"
                        key={index}
                        style={{
                            backgroundImage: `url(${promo.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="promo-overlay">
                            <div className="promo-text">
                                <p>{promo.title}</p>
                                <a href="#" className="shop-link">SHOP NOW</a>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default PromotionalBanner;
