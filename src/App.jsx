import React from 'react'
import HomePage from './HomePage'
import { Navigate, Route, Routes } from 'react-router-dom';
import Signin from './Components/Signin/Signin'
import Signup from './Components/Signup/Signup'



const App = () => {
  return (
    <>
      <Routes>
      <Route path='/signup' element={<Signup/>} />
      <Route path='/signin' element={<Signin/>} />
      <Route path="/homepage" element={<HomePage/>}/>
      </Routes>
    </>
  )
}

export default App