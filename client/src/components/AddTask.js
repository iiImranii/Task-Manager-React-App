import React from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import "../App.css";
import { motion } from 'framer-motion';


function AddTaskModal({ closeModal, mode, modeInfo, addTaskMethod }) {

    const navigate = useNavigate();
    const initVals = {
        taskname: "",
        timespan: 0,
        tasknote: "",
 
    };

   
    if (mode=="edit" && modeInfo.listId && modeInfo.taskId) {
      const headers = {'x-access-token': localStorage.getItem("token")};
      axios.get(`http://localhost:3002/tasks/getTask/${modeInfo.taskId}/list/${modeInfo.listId}`, {headers}).then((response)=>{
          if (response.data.err) {
              alert(response.err);
          } else {
            console.log(response.data)
              initVals.taskname = response.data.taskname;
              initVals.timespan = response.data.taskduration;
              initVals.tasknote = response.data.tasknote;
            
          }
      })
  }

    const validSchema = Yup.object().shape({
        taskname: Yup.string().min(1).max(15).required("Enter a valid task name"),
        timespan: Yup.string().min(1).max(15).required("Enter a valid task duration"),
        tasknote: Yup.string().min(3).max(200, "To many characters").nullable(),
       
    });


    const updateTasks = (listId) => {
      const headers = {'x-access-token': localStorage.getItem("token")};
      axios.get("http://localhost:3002/tasks/getAllTasks/list/"+listId, { headers }).then((response)=> {
        if (!response.data.err) {
          addTaskMethod(response.data);
        }          
      })
    }

    const onSubmit = (data) => {
      console.log("clicked submit")
      const headers = {'x-access-token': localStorage.getItem("token")};
        if (mode=="add" && modeInfo.listId) {
 
                axios.post("http://localhost:3002/tasks/createTask/list/"+modeInfo.listId, data, {headers}).then((response) => {
                  if (response.data.err) {
                    alert(response.data.err)

                  } else {
                    closeModal(false);
                    updateTasks(modeInfo.listId);
                  }
                   
                })
      
        } else if (mode=="edit" && modeInfo.taskId && modeInfo.listId) {
          console.log("in edit submit")
          console.log(data);
            axios.put(`http://localhost:3002/tasks/editTask/${modeInfo.taskId}/list/${modeInfo.listId}`, data, {headers}).then((response)=> {
              
              if (response.data.err) {
                alert(response.data.err);
              } else {
                closeModal(false);
                updateTasks(modeInfo.listId);
              };
             
              
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
    className="add-task-back-container"
    >

       <motion.div 
       initial={{ y: "-100vh"}}
       animate={{ y: "0px"}}
       exit={{ y: "-100vh"}}
       className="add-task-info-container"
       > 


         <div className="add-task-header-container">  
           <p className="add-task-text-header">
           {mode === 'edit' ? 'EDIT EXISTING TASK' : 'CREATE A NEW TASK'}
            </p>
         </div>      
         <div className="task-creation-input-container">  
           
        <Formik initialValues={initVals} onSubmit={onSubmit} validationSchema={validSchema}> 
        <Form>
        <div className="add-task-name-container"> 
            <p className="form-text-display">Enter task name: </p>
            <ErrorMessage name="taskname" component="p" className="error-text" />
        </div>
        <Field 
                    className="add-task-name-input"
                    autoComplete="off"
                    id="add-task-name-input"
                    name="taskname"
                    placeholder="Enter your task name..."
                    />


        <div className="add-task-time-span-container"> 
            <p className="form-text-display">Enter time span: </p>
            <ErrorMessage name="firstname" component="p" className="error-text" />
        </div>

        <Field 
                    className="add-task-time-span-input"
                    autoComplete="off"
                    id="add-task-time-span-input"
                    name="timespan"
                    placeholder="Enter a time duration for your task..."
                    type="number"
                    min="0"
                     pattern="[0-9]*"
                    />

        <div className="add-task-notes-container"> 
            <p className="form-text-display">Enter task notes: </p>
            <ErrorMessage name="tasknote" component="p" className="error-text" />
        </div>

        <Field 
                    className="add-task-notes-input"
                    autoComplete="off"
                    id="add-task-notes-input"
                    name="tasknote"
                    placeholder="Enter your task notes..."
                    />

        <div className="add-task-save-task-buttons-container">
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


export default AddTaskModal;