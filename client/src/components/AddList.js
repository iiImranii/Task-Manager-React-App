import React, {useState} from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Yup from 'yup';
import axios from 'axios';
import "../App.css"


function AddListModal({ closeModal, mode, modeInfo, addListMethod}) {
    const [listInfo, setListInfo] = useState({});
    const navigate = useNavigate();
    
   
    const initVals = {
        listname: "",
    };


    const updateLists = () => {
        const headers = {'x-access-token': localStorage.getItem("token")};
        axios.get("http://localhost:3002/lists/getAllLists", {headers} ).then((response)=> {
            addListMethod(response.data);
      });
    }

    if (mode=="edit" && modeInfo.listId) {
        const headers = {'x-access-token': localStorage.getItem("token")};
        axios.get(`http://localhost:3002/lists/getList/${modeInfo.listId}`, {headers}).then((response)=>{
            if (response.data.err) {
                alert(response.err);
            } else {
                initVals.listname = response.data.listname
                setListInfo(response.data);
            }
        })
    }



    const validSchema = Yup.object().shape({
        listname: Yup.string().min(3).max(30).required("Enter a valid list name"),
    });
    
    const onSubmit = (data) => {
        const headers = {'x-access-token': localStorage.getItem("token")};
       if (mode=="add") {
            
            axios.post("http://localhost:3002/lists/createList", data, {headers}).then((response) => {
                if (response.data.err) {
                    alert(response.data.err);
                } else {
                    closeModal(false);
                    updateLists();
                }
            })

       } else if (mode=="edit"  && modeInfo.listId) {
            axios.put(`http://localhost:3002/lists/editList/${modeInfo.listId}`, data, {headers}).then((response) => {
                if (response.data.err) {
                    alert(response.data.err)
                } else {
                    closeModal(false);
                    updateLists();
                }
            })


       }
    }

    const onCancel = () => {

    }

    return (
   
    <motion.div 
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    exit={{opacity: 0}}
    className="add-list-back-container">

       <motion.div 
       initial={{y: "-50px"}}
       animate={{y: "0px"}}
       exit={{y: "-50px", opacity: 0}}
       className="add-list-info-container"> 
       
         <div className="add-list-header-container">  
         
           <p className="add-list-text-header">
                {mode === 'edit' ? 'EDIT EXISTING LIST' : 'CREATE A NEW LIST'}
            </p>
         </div>      
         <div className="task-creation-input-container">  
           
        <Formik initialValues={initVals} onSubmit={onSubmit} validationSchema={validSchema}> 
        <Form>
        <div className="add-list-name-container"> 
            <ErrorMessage name="taskname" component="p" className="error-text" />
        </div>


        <Field 
                    className="add-list-name-input"
                    autoComplete="off"
                    id="add-list-name-input"
                    name="listname"
                    placeholder="Enter list name..."
                
                    />

    <div className="add-list-save-task-buttons-container">
           <button className="cancel-edit-task-button" onClick={(()=> closeModal(false))}>
             Cancel
           </button>
     
           <button type="submit" className="save-add-task-button">
             Save
           </button>
         </div>
        </Form>
        </Formik>

      
         </div>
        
         
  </motion.div>
</motion.div>

    );

}


export default AddListModal;