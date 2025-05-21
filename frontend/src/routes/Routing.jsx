import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PageUser from '../pages/user/PageUser'
import PageHomeAdmin from '../pages/homeAdmin/PageHomeAdmin'
import PageLogin from '../pages/login/PageLogin'

const Routing = () => {
  return (
    <>
        <Routes>
            <Route path="/user" element={<PageUser />} />
            <Route path="/" element={<PageHomeAdmin/>} />
            <Route path="/login" element={<PageLogin />} />
        </Routes>
    </>
  )
}

export default Routing