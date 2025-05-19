import React from 'react'
import { Link } from 'react-router-dom'
import './Categories.css'

const Categories = () => {

    const cards = [
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        },
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        },
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        },
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        },
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        },
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        },
        {
            img: '././img/fundo.png',
            alt: 'bla bla',
            link: '/',
            title: 'blusas'
        }
    ];

    return (
        <div className="container-categories">
            <div className="cards">
                {cards.map((card, index) => (
                    <div className="card" key={index}>
                        <Link to={card.link}>
                            <img src={card.img} alt={card.alt} />
                            <p className="legenda">{card.title}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories