import React from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';


const ListDropDown = ({ toggleModal, setEditListModal, listId, addListMethod, addTaskMethod  }) => {
    


    const updateLists = () => {
        const headers = {'x-access-token': localStorage.getItem("token")};
        axios.get("http://localhost:3002/lists/getAllLists", {headers} ).then((response)=> {
            addListMethod(response.data);
      });
    }



    const deleteList = (listId) => {
        if (listId!=null) {
            const headers = {'x-access-token': localStorage.getItem("token")};
            axios.delete(`http://localhost:3002/lists/deleteList/${listId}`, {headers}).then((response)=> {
                if (response.data.err) {
                    alert(response.data.err);
                } else {
                    toggleModal(false);
                    updateLists();
                    addTaskMethod([]);
                }
            })

        }
        
    }


    return (
        
        <motion.div 
        
        initial={{opacity: 0, y: "-50px"}}
        animate={{opacity: 1, y:"0px"}}
        exit={{opacity: 0, y: "-25px"}}
        className="flex flex-col listDropDown"
        >

            <ul className="flex flex-col -ap-4 ulList">
                <li className="editListButton" onClick={()=>{
                    if (listId!=null) {
                        toggleModal(false);
                        setEditListModal(true);
                    }
                    
                    
                }}>Edit</li>
                <li className="deleteListButton" onClick={()=>{deleteList(listId)}}>Delete</li>
            </ul>
        </motion.div>
    )

}


export default ListDropDown