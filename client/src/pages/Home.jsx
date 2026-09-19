import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import RecentItems from '../components/RecentItems'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner/>
      {/* <Categories/> */}
      <RecentItems/>
       
    </div>
  )
}

export default Home
