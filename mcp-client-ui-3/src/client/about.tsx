import React from "react";
import { Link } from 'react-router-dom';
//import Head from '../components/Head'
//
function About() {
  return (
  <div className="container mx-auto my-2 px-8 bg-white">
    <h1 className="text-4xl text-gray-700 font-bold my-2"
    >About!</h1>
    <hr />
    <Link to="/">[ home ]</Link>
  </div>
  );
}

export default About;