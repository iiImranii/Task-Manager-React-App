import React from 'react';
import { useState } from 'react';
import axios from "axios"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LoaderDiv from "../components/LoaderDiv";
import userIcon from "../img/user-icon.png";
import passIcon from "../img/password-icon.png"
import { AnimatePresence, motion } from 'framer-motion';
//import 'bootstrap/dist/css/bootstrap.css';

function Login () {
    const [ usernameTyped, setUserNameTyped ] = useState("");
    const [ passTyped, setPassTyped ] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState("");
    const navigate = useNavigate();
    
    const login = () => {
        const data = {username: usernameTyped, password: passTyped};
        const signinButton = document.querySelector(".login-button");
        const errorText = document.querySelector(".login-error-text");
        axios.post("http://localhost:3002/auth/login", data).then((response) => {
        if (response.data.auth) {
                errorText.textContent = "";
                signinButton.textContent = "SIGNING IN..";
                localStorage.setItem("token", response.data.token);
                setLoading(true);
                setTimeout(() => {
                    
                    setLoading(false);
                    setTimeout(() => {
                        navigate("/home");
                    }, 700)
                },8000)
                //8000
            } else {
                if (response.data.err) {
                    errorText.textContent = response.data.err;
                } else {
                    errorText.textContent = "Failed to log in";
                }
            };
        });
    }

    return (
        <motion.div 
        
        initial={{opacity: 0}}
        animate={{opacity: 1, transition: {duration: .6}}}
        exit={{y: "-100vh", opacity: 0, transition: {duration:.6}}}
        className="login-back-container"
        >

            <AnimatePresence mode="wait">
                { loading && <LoaderDiv loadType="login"/>}
            </AnimatePresence>
            
            <div className="login-container">

                <div className="back-sign-in-container">

                    <p className="sign-in-text-header"> 
                        SIGN IN
                    </p>
                </div>

                <div className="login-credentials-container"> 

                    <div className="login-user-input-container">
                        <img src={userIcon} alt="E" class="username-icon-img"/>

                        <input className="login-user-input" placeholder='Username'
                        type="text" onChange={(eventInfo) => {
                            setUserNameTyped(eventInfo.target.value);
                        }}/>
                    </div>
                    

                    <div className="login-pass-input-container">
                        <img src={passIcon} alt="" class="password-icon-img"/>

                        <input className="login-pass-input" placeholder="Password"
                        type="password" onChange={(eventInfo) => {
                            setPassTyped(eventInfo.target.value);
                        }}/>
                    </div>
                   
                   <div className="login-submit-container">
                        <label className="login-error-text">
                         

                            </label>

                   <button className="login-button" onClick={login}> SIGN IN </button>
                    </div>

                    
                </div>
                <p className="register-help-text">
                    Dont have an account? <Link to="/register" className="register-text-link">Register</Link> now!
                </p>


            </div>

        </motion.div>
    ) 

}

export default Login