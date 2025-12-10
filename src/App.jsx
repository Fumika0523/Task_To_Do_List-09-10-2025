import React from 'react'
import HomePage from './Components/HomePage'
import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from './Components/Signin/Signin'
import Signup from './Components/Signup/Signup'
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <>
      <Routes>
      <Route path='/sign-up' element={<Signup/>} />
      <Route path='/sign-in' element={<Signin/>} />
      <Route path="/homepage" element={<HomePage/>}/>
      </Routes>
    </>
  )
}

export default App