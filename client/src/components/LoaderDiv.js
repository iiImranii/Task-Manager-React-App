import React from "react";
import { useState, useEffect } from 'react';
import "../App.css";
import { motion } from 'framer-motion';


function LoaderDiv ({ loadType }) {
  const [text, setText] = useState("");
  

 
  useEffect(() => {
    // Define the text based on the loadType
    if (loadType === "register") {
      setText("Creating your account");
    } else if (loadType === "login") {
      setText("Logging you in");
    }

    const interval = setInterval(() => {
      setText((prevText) =>
        prevText === `${text}...` ? text : prevText + '.'
      );
    }, 500);

    return () => clearInterval(interval);
  }, []); // Add loadType and text as dependencies


  

    return (

      <motion.div 
      initial={{ y: "-100vh"}}
      animate={{ y: "0px", transition: { duration: 0.8 }}}
      exit={{opacity: 0, y: "-100vh", transition: { duration: 0.8 }}}
      className="loader-wrapper"
     
      >

        <span className="loader"><span className="loader-inner"></span></span>
        <p className="loading-text">{text}</p>
      </motion.div>


    );



}


export default LoaderDiv;