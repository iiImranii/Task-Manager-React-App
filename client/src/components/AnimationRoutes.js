import React from 'react';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import Home from '../pages/Home';

import { AnimatePresence, AnimationPresence } from 'framer-motion'

function AnimationRoutes() {
    const location = useLocation();
    return (
    <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Registration/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </AnimatePresence>
);

}

export default AnimationRoutes;