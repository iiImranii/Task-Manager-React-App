import React from 'react'
import logoutIcon from '../img/logout-icon.png'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function LogOutReminderModal({ modalToggle, modalState }) {

    const navigate = useNavigate();
    const logout = () => {
        document.querySelector(".logout-reminder-logout-button").textContent = "LOGGING OUT.."
        setTimeout(()=>{
            modalToggle(false);
            localStorage.removeItem("token");
            navigate('/')
        }, 150)
        
      }

    const closeModalFunc = () => {
        modalToggle(false);
    }

    return (
        


     
            <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        className="logout-reminder-container"
        >
            <motion.div 
            initial={{y: "-100px"}}
            animate={{y: "0px"}}
            exit={{y: "-40vh", opacity: 0}}
            className="logout-reminder-back"
            >
                <button className="modal-exit-btn" onClick={()=>{closeModalFunc()}}>X</button>
                <div className="logout-reminder-img-back">
                    <img className="logout-reminder-img" src={logoutIcon}></img>
                </div>
                
                <p className="logout-reminder-header">LOGOUT</p>
                <p className="logout-reminder-text">Are you sure you want to log out?</p>
                <div className="logout-reminder-buttons-container">
                    <button className="logout-reminder-cancel-button" onClick={()=>{closeModalFunc()}}>CANCEL</button>
                    <button className="logout-reminder-logout-button" onClick={()=>{logout()}}>LOG ME OUT</button>
                </div>
                
            </motion.div>
        </motion.div>

       
        
      
    );
}

export default LogOutReminderModal;