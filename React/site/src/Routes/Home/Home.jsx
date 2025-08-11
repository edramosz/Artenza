import React from 'react'
import Banner from '../../Components/Banner/Banner.jsx'
import PromotionalBanner from '../../Components/Banner/PromotionalBanner.jsx'
import InfoService from '../../Components/Banner/InfoService.jsx'
import SecaoProdutos from '../../Components/SecaoProdutos.jsx'

const Home = () => {
  return (
    <div>
      <Banner />   
      <InfoService />
      <PromotionalBanner />

 
      <SecaoProdutos 
        titulo="Você pode gostar" 
        endpoint="https://artenza.onrender.com/Produto?genero=Masculino" 
      />
      
      <SecaoProdutos 
        titulo="Recomendados para você" 
        endpoint="https://artenza.onrender.com/Produto?genero=Feminino" 
      />
    </div>
  )
}

export default Home
