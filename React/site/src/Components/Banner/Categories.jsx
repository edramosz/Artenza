import React from 'react'
import { Link } from 'react-router-dom'
import './Categories.css'

const Categories = () => {

    const cards = [
        {
            img: '././img/blusa.jpg',
            alt: 'Blusas femininas e masculinas',
            link: '/categoria/blusas',
            title: 'Blusas'
        },
        {
            img: '././img/calcas.jpg',
            alt: 'Calças jeans, sociais e esportivas',
            link: '/categoria/calcas',
            title: 'Calças'
        },
        {
            img: '././img/tenis.jpg',
            alt: 'Tênis esportivos e casuais',
            link: '/categoria/tenis',
            title: 'Tênis'
        },
        {
            img: '././img/acessorios.jpg',
            alt: 'Bolsas, cintos, óculos e mais',
            link: '/categoria/acessorios',
            title: 'Acessórios'
        },
        {
            img: '././img/vestidos.jpg',
            alt: 'Vestidos casuais e sociais',
            link: '/categoria/vestidos',
            title: 'Vestidos'
        },
        {
            img: '././img/camisetas.jpg',
            alt: 'Camisetas básicas e estampadas',
            link: '/categoria/camisetas',
            title: 'Camisetas'
        },
        {
            img: '././img/jaquetas.jpg',
            alt: 'Jaquetas e casacos',
            link: '/categoria/jaquetas',
            title: 'Jaquetas'
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
