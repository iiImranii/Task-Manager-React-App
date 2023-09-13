import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoaderDiv from "../components/LoaderDiv";


function Registration () {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const initVals = {
        password: "",
        firstname: "",
        lastname: "",
        gender: "",
    };

    const validSchema = Yup.object().shape({
        firstname: Yup.string().min(2).max(15).required("You must enter a valid first name"),
        lastname: Yup.string().min(2).max(15).required("You must enter a valid last name"),
        username: Yup.string().min(3).max(15).required("You must enter a valid username"),
        password: Yup.string().required("You must enter a valid password"),
        gender: Yup.string().required("Please choose a gender!")
    });

    const onSubmit = (data) => {
        const errorText = document.querySelector(".login-error-text");
        axios.post("http://localhost:3002/auth/register", data).then((response) => {
            if (response.data.err) {
                errorText.textContent = response.data.err;
            } else {
                errorText.textContent = "";
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    setTimeout(() => {
                        navigate("/");
                    }, 700)
                },8000)
            }
        })
    }
    return (

        <motion.div 
        initial={{opacity: 0, y: "-100vh"}}
        animate={{opacity: 1, y: "0px", transition: {duration: .6}}}
        exit={{opacity: 0, y: "-100vh", transition: {duration: .6}}}
        className="register-back-container"
        >


        <div className="register-container">
            <AnimatePresence mode="wait">
                { loading && <LoaderDiv loadType="register"/>}
            </AnimatePresence>
            <div className="back-register-container">
                <p className="register-text-header"> 
                    REGISTER
                </p>
            </div>

            <div className="register-credentials-container"> 
            <Formik initialValues={initVals} onSubmit={onSubmit} validationSchema={validSchema}> 
                <Form>
                    <div className="first-name-container"> 
                    
                        <p className="user-register-first-name-text">Enter your first name: </p>
                        <ErrorMessage name="firstname" component="p" className="first-name-error-text" />
                    </div>
                    <Field 
                    className="register-first-name-input"
                    autoComplete="off"
                    id="register-first-name-input"
                    name="firstname"
                    placeholder="First Name"
                    />


                    <div className="last-name-container"> 
                    
                        <p className="user-register-last-name-text">Enter your last name: </p>
                        <ErrorMessage name="lastname" component="p" className="last-name-error-text"/>
                    </div>

                    <Field 
                        className="register-last-name-input"
                        autoComplete="off"
                        id="register-last-name-input"
                        name="lastname"
                        placeholder="Last Name"
                    />

                    <div className="username-container">
                        <p className="user-register-text">Enter your username: </p>
                        <ErrorMessage name="username" component="p" className="username-error-text"/>
                    </div>
                    <Field 
                        className="register-user-input"
                        autoComplete="off"
                        id="register-user-input"
                        name="username"
                        placeholder="Username"
                    />
                    
                    <div className="pass-container">
                        <p className="pass-register-text">Enter your password: </p>
                        <ErrorMessage name="password" component="p" className="pass-error-text"/>
                    </div>
                    <Field 
                        className="register-pass-input"
                        autoComplete="off"
                        id="register-pass-input"
                        name="password"
                        placeholder="Password"
                        type="password"
                    />

                <div className="gender-container"> 
                <Field
                    type="radio"
                    className="male-checkbox"
                    name="gender"
                    value="male"
                />
                
                  <p className="male-text">Male</p> 
                  

                  <Field
                    type="radio"
                    className="female-checkbox"
                    name="gender"
                    value="female"
                />
                  <p className="female-text">Female</p>
              </div>
              
              <p className="register-policy-text">
              Already have an account? Sign in <Link to="/" className="register-text-link">here</Link> now!
            </p>
            <div className="register-submit-container">
            <label className="login-error-text"></label>
                <button className="register-button" type="submit">REGISTER</button>
            </div>
            
                </Form>
            </Formik>
             
            </div>
        </div>
    
    </motion.div>
        
    )

};

export default Registration;