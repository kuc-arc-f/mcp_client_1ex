

import React from "react";
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './client/home';
import About from './client/about';

export default function App(){
  return(
  <div className="App">
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  </div>
  )
}
