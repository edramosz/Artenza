import React from 'react'
import Banner from '../../Components/Banner/Banner.jsx'
import PromotionalBanner from '../../Components/Banner/PromotionalBanner.jsx'
import Categories from '../../Components/Banner/Categories.jsx'
import Selection from '../../Components/Banner/Selection.jsx'
import InfoService from '../../Components/Banner/InfoService.jsx'
import HeroBanner from '../../Components/Banner/HeroBanner.jsx'

const Home = () => {
  return (
    <div>
      {/* <Banner />  */}
      <HeroBanner />
      <InfoService />
      <PromotionalBanner />
      <Categories />
      <Selection />
    </div>
  )
}

export default Home