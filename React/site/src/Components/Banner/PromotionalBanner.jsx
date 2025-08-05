import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PromotionalBanner.css';

const PromotionalBanner = () => {
    const [current, setCurrent] = useState(0);
    
    const slides = [
        {
            title: 'ton ton ton sahur',
            subtitle: 'ton ton',
            image: './img/banner7.png',
        },
        {
            title: 'liliri lari laa',
            subtitle: 'elefante',
            image: './img/banner8.png',
        },
    ];

    const sidePromos = [
        {
            title: 'trala leiro lala',
            image: './img/banner.png',
        },
        {
            title: 'la vaca saturno',
            image: './img/banner6.png',
        },
    ];

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const goToPrevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="promotional-banner">
            {/* Main Carousel */}
            <div 
                className="main-carousel"
                style={{
                    backgroundImage: `url(${slides[current].image})`,
                }}
            >
                <button 
                    className="carousel-button prev"
                    onClick={goToPrevSlide}
                    aria-label="Previous slide"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                
                <div className="carousel-content">
                    <div className="text-content">
                        <p className="subtitle">{slides[current].subtitle}</p>
                        <h2 className="title">{slides[current].title}</h2>
                        <Link to="/Colecao" className="shop-button">
                            Ver Agora
                        </Link>
                    </div>
                </div>
                
                <button 
                    className="carousel-button next"
                    onClick={goToNextSlide}
                    aria-label="Next slide"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
                
                <div className="carousel-dots">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            className={`dot ${idx === current ? 'active' : ''}`}
                            onClick={() => setCurrent(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Side Promos */}
            <div className="side-promotions">
                {sidePromos.map((promo, index) => (
                    <div
                        key={index}
                        className="promo-card"
                        style={{
                            backgroundImage: `url(${promo.image})`,
                        }}
                    >
                        <div className="promo-overlay">
                            <div className="promo-content">
                                <p className="promo-title">{promo.title}</p>
                                <Link to="/Colecao" className="promo-button">
                                    SHOP NOW
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionalBanner;