import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import BrowseItem from './pages/BrowseItem'
import ItemDetails from './pages/ItemDetails'
import ReportItem from './pages/ReportItem'
import Login from './pages/Login'
import UserDashboard from './pages/UserDashboard'
import Footer from './components/Footer'
import MyReport from './pages/MyReport';
import Message from './pages/Message';

const App = () => {
  return (
    <>
      <Navbar/>

      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
         <Route path="/browseitem" element={<BrowseItem />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-report" element={<MyReport />} />
          <Route path="/message" element={<Message/>} />

        </Routes>
      </div>
 

      <Footer/>
       <ToastContainer />
    </>
  )
}

export default App
