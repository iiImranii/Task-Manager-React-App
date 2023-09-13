import React, {useState, useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import "../App.css"
import LoaderDiv from "../components/LoaderDiv";
import AddTaskModal from '../components/AddTask';
import ListDropDown from '../components/ListDropDown'
import AddListModal from '../components/AddList'
import LogOutReminderModal from '../components/LogOutReminder';
import botIcon from '../img/bot-icon.png';
import clockIcon from '../img/clock-icon.png';
import deleteIcon from '../img/delete-icon.png';
import editIcon from '../img/edit-icon.png';
import editListIcon from '../img/full-settings-icon.png';
import addIcon from '../img/add-icon.png';
import settingIcon from '../img/setting-icon.png'
import infoIcon from '../img/info-icon.png'
import circleIcon from '../img/circle-icon.png'
import patternImage from '../img/pattern-background.png'
import helpIcon from '../img/help-icon.png'

const api = {
  key: "d69a689196f801af6369b291dd47b68e",
  base: "http://api.openweathermap.org/data/2.5/"

}



function Home() {
    const [loading, setLoading] = useState(false);
    const [lists, addList] = useState([]);
    const [tasks, addTask] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null)
    const [taskCompleteness, setTaskCompleteness] = useState(null);
    const [listInfo, setListInfo] = useState(null)
    const [fullName, setFullName] = useState("");
    const [totalTasks, setTotalTasks] = useState(0);
    const [clickedTask, setClickedTask] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [weatherInfo, setWeatherInfo] = useState({});
    const [ listOptionToggle, setListOptionToggle] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModelOpen] = useState(false);
    const [isEditTaskModalOpen, setEditTaskModelOpen]  = useState(false);
    const [isAddListModalOpen, setAddListModalOpen] = useState(false);
    const [isEditListModalOpen, setEditListModalOpen] = useState(false);
    const [isLogoutModalOpen, setLogoutModal] = useState(false);
     const navigate = useNavigate();

    const root = document.getElementById('root');
    const images = [patternImage, patternImage, patternImage]; // Replace with your image URLs
    let currentIndex = 0;

    function changeBackgroundImage() {
      root.style.backgroundImage = `url(${images[currentIndex]})`;
      currentIndex = (currentIndex + 1) % images.length;
    }

    // Preload all images to prevent breaks
    images.forEach((imageUrl) => {
      const img = new Image();
      img.src = imageUrl;
    });

// Change background image every 5 seconds (adjust as needed)
setInterval(changeBackgroundImage, 5000);



    useEffect(() => {
      fetch(`${api.base}weather?q=London,uk&APPID=${api.key}`)
      .then((res)=> res.json())
      .then((result)=> {
        setWeatherInfo(result);
      })
      const headers = {'x-access-token': localStorage.getItem("token") };
      axios.get("http://localhost:3002/auth/getUser", {headers}).then((response)=>{
      if (response.data.err) {
          navigate("/")
        }
      })
      
      axios.get("http://localhost:3002/lists/getAllLists", {headers} ).then((response)=> {
        addList(response.data);
      });


      axios.get("http://localhost:3002/auth/getUser", {headers}).then((response)=>{
        setFullName(response.data.firstname+" "+response.data.lastname)
      })
    }, []);


    
    //Functions

    const logout = () => {
      localStorage.removeItem("token");
      navigate('/')
    }
    
    const updateListInfo = () => {
      if (selectedList!=null) {
        const headers = {'x-access-token': localStorage.getItem("token")};

        if (selectedTask!=null) {
          const taskNoteEl = document.querySelector('.task-note-text')
                if (taskNoteEl) {
                  taskNoteEl.textContent = "N/A"
                } 
           
        }
        
        axios.get("http://localhost:3002/lists/getCompleted/list/"+selectedList, {headers}).then((response)=> {
            if (response && response.data.completedTasks!=null) {
              setCompletedTasks(response.data.completedTasks);
              setTotalTasks(response.data.totalTasks)
          }
      })
      }
    }


    const listClicked = (listId, listDate) => {
      setSelectedList(listId);
      const headers = {'x-access-token': localStorage.getItem("token") };
      updateListInfo();

      axios.get("http://localhost:3002/tasks/getAllTasks/list/"+listId, { headers }).then((response)=> {
        if (!response.data.err) {
          addTask(response.data);
        } else {
          //Error
          alert(response.data.err)
        }
        

      })};

    const taskClicked = (taskId) => {
      if (selectedList!=null) {
        const headers = {'x-access-token': localStorage.getItem("token")};
        //Check what completeness task is on then use that to decide what to switch to
        //Then let data be what you want to set it to and it will update accordin
        axios.get("http://localhost:3002/tasks/getTask/"+taskId+"/list/"+selectedList, {headers}).then((response)=> {
          if (!response.data.err) {
            const data = {bool: !response.data.taskcomplete};
            setSelectedTask(taskId);

            axios.post("http://localhost:3002/tasks/task-complete/"+taskId+"/list/"+selectedList, data ,{ headers })
            .then((resp)=>{
              if (resp.data.taskComplete!=null) {
                updateListInfo();
                setTaskCompleteness(resp.data.taskComplete)
                const updatedTasks = tasks.map((task) => (
                  task.id === taskId ? { ...task, taskcomplete: resp.data.taskComplete } : task
                ));
                addTask(updatedTasks)
              }
            })
          }
        })
      }
    }


    const deleteTask = (event,taskId) => {
      event.stopPropagation();
      const headers = {'x-access-token': localStorage.getItem("token")};
      if (selectedList!=null) {
        axios.delete(`http://localhost:3002/tasks/deleteTask/list/${selectedList}/${taskId}`, {headers}).then((response)=> {
          if (response.data.err) {
            alert(response.data.err);
          }
        })

        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        addTask(updatedTasks);

        updateListInfo();
        setSelectedTask(null);
      }
     
    }


    const taskInfoClicked = (event, taskId) => {
      event.stopPropagation();
      setSelectedTask(taskId);
      setClickedTask(!clickedTask);
      updateListInfo();
   
        if (selectedList!=null) {
          const headers = {'x-access-token': localStorage.getItem("token")};
          axios.get(`http://localhost:3002/tasks/getTask/${taskId}/list/${selectedList}`, {headers}).then((response)=> {
            if (response && response.data.tasknote) {
                const taskNoteEl = document.querySelector('.task-note-text')
                if (taskNoteEl) {
                  taskNoteEl.textContent = response.data.tasknote
                } 
            }
            if (response && response.data.createdAt) {
              const createdAtText = document.querySelector('.task-info-created-text')
              const date = new Date(response.data.createdAt);
                if (createdAtText) {
                  createdAtText.textContent = `Created at: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` 
                } 
            }
          })
        } else {
          alert("Select a list first!");
        }
      
      
    }



    return (

          
 <motion.div 
    initial={{opacity: 0, y: "100vh"}}
    animate={{opacity: 1, transition: { duration: 1.2 }, y: "0px"}}
    exit={{opacity:0}}
 className="home-page-back"
 >

 <div className="home-side-bar">
   <div className="profile-info-container">
     <img className="home-user-image" src={botIcon} alt="Example Image"/>
     <p className="home-username-text">
       {fullName}
     </p>
     <div className="home-underline">
       
     </div>
   </div>
   

   <div class="user-panel-container"> 
       <button class="setting-panel">
         <img className="setting-icon-img" src={settingIcon} alt=""/>
         Settings
       </button>

       <button class="setting-panel">
         <img className="setting-icon-img" src={helpIcon} alt=""/>
         Help
       </button>
       
     </div>

   <button className="home-logout-button" onClick={()=>{setLogoutModal(true)}}>
     LOG OUT
   </button>
   
 </div>
 
 <div className="main-home-body-back">
   <div className="main-home-container">
     
     <div className="home-list-container">
       <div className="list-header-container">
         <p className="list-header-text"> LISTS </p>
         <button className="edit-list-button" onClick={()=> {if (selectedList) {setListOptionToggle(!listOptionToggle)} else {alert("Select a list!")} }}>
          <img className="edit-list-img" src={editListIcon}></img>


         </button>
         <AnimatePresence mode='wait' >
            {listOptionToggle && <ListDropDown  toggleModal={setListOptionToggle} setEditListModal={setEditListModalOpen} listId={selectedList} addListMethod={addList} addTaskMethod={addTask}/>}
         </AnimatePresence>            
 
        </div>
      

       <div className="home-list-body"> 

        {lists.map((value, key) => {

          return (
            
              <div className={`list-div ${value.id === selectedList ? 'selected-list-div' : ''}`} onClick={()=>listClicked(value.id, value.createdAt)}>
                {value.listname} 
              </div>

          );
        })}
         
         
       </div>
       <div className="list-footer-container">
         <button className="home-add-list-button" onClick={()=> {setAddListModalOpen(true)}}>+ NEW LIST</button>
       </div>
     </div>
              
     <div className="home-task-container">
     
     <p className="task-header-text"> TASKS </p>
      {(!selectedList || selectedList) && tasks.length <=0 ? (
          <div class="task-reminder-container"> 
            <p class="task-reminder-text"> Please select a list from the sidebar! </p>
          </div>
      ) : (
        
        <div className="task-lists-back">
        {tasks.map((value, key) => {
          
            return (
          <div className="task-div"
           onClick={()=>taskClicked(value.id)}
           > 
            <div className="task-div-name" style={{textDecoration: value.taskcomplete? 'line-through' : 'none'}}> 
                {value.taskname}
            </div>
            <div className="task-div-duration">
              <img className="clock-icon" src={clockIcon} alt=""/>
              {value.taskduration < 60 ? (
              `${value.taskduration} min`
              ) : (
              `${Math.floor(value.taskduration / 60)} hours ${value.taskduration % 60} minutes`
              )}
            </div>
            <div className="task-edit-container"> 
            <button className="task-div-info" onClick={(event)=>taskInfoClicked(event, value.id)}>
              <img className="info-icon-img" src={infoIcon} alt=""/>
            </button>
              <button className="task-div-edit" onClick={(event)=>{
                event.stopPropagation();
                 setSelectedTask(value.id);
                setEditTaskModelOpen(true)}}> 

              <img className="edit-icon-img" src={editIcon} alt=""/>
              </button>
              <button className="task-div-delete" onClick={(event)=>deleteTask(event, value.id)}>
              <img className="delete-icon-img" src={deleteIcon} alt=""/>
                  </button>
            </div>
          </div>

            )
          })}
        </div>
      )}

       {selectedList && (
        <div className="task-footer"> 
         <button className="add-task-button" onClick={() => {
          setAddTaskModelOpen(true)
     
         }}>
         <img className="add-icon-img" src={addIcon} alt=""/>
         </button>
       </div>
       )}

     </div>
    </div>
       
    <div class="home-dashboard-container">
       <div class="task-dash-1">
         <div class="highlight-box"> </div>
         <div class="inner-info-container">
         <p class="dash-header-texts">TASK INFORMATION </p>

           <div class="task-info-container">
             <img class="point-img" src={circleIcon} />
             {totalTasks !== null ? (
            <p class="task-info-total-tasks">Total Tasks: {totalTasks}</p>
            ) : (
              <p class="task-info-total-tasks">Total Tasks: 0</p>
            )}
           </div>
           
           <div class="task-info-container">
             <img class="point-img" src={circleIcon} />
             {totalTasks !== null ? (
  <p class="task-info-completed-tasks">Completed Tasks: {completedTasks}</p>
) : (
  <p class="task-info-completed-tasks">Completed Tasks: 0</p>
)}
           
           </div>
           
           <div class="task-info-container">
             <img class="point-img" src={circleIcon} />
             <p class="task-info-created-text"> Created at: </p>
           </div>
           
           
           
       </div>
       </div>
       
       <div class="task-dash-2">
         <div class="highlight-box"> </div>
         <div class="inner-info-container">
         <p class="dash-header-texts"> TASK NOTE </p>
           <p class="task-note-text">Select your tasks info button to view its notes!</p>
       </div>
       </div>
       
       
       <div class="task-dash-3">
         <div class="highlight-box"> </div>
         <div class="inner-info-container">
         <p class="dash-header-texts">FORECAST</p>
         {weatherInfo && weatherInfo.name && (
            <p class="forecast-text">Location: {weatherInfo.name}</p>
        )}
        {weatherInfo && weatherInfo.weather && weatherInfo.weather[0] && (
          <p class="forecast-text">
            Condition: {weatherInfo.weather[0].main}, {weatherInfo.weather[0].description}
          </p>
        )}
        {weatherInfo && weatherInfo.main && (
          <p class="forecast-text">Temperature: {weatherInfo.main.temp}°C</p>
        )}
       </div>
       </div>
       
       
       </div>
     </div>
  
  
    <AnimatePresence mode='wait' >
      {isAddTaskModalOpen && <AddTaskModal mode="add" modeInfo={{listId: selectedList}} closeModal={setAddTaskModelOpen} addTaskMethod={addTask}/>}
      {isEditTaskModalOpen && <AddTaskModal mode="edit" modeInfo={{taskId: selectedTask, listId: selectedList}} closeModal={setEditTaskModelOpen} addTaskMethod={addTask}/>}
      
      {isAddListModalOpen && <AddListModal mode="add" modeInfo={{}} closeModal={setAddListModalOpen} addListMethod={addList}/>}
      {isEditListModalOpen && <AddListModal mode="edit" modeInfo={{listId: selectedList}} closeModal={setEditListModalOpen} addListMethod={addList}/>}
      
      {isLogoutModalOpen && <LogOutReminderModal modalToggle={ setLogoutModal } modalState={isLogoutModalOpen} />}
    </AnimatePresence>
 </motion.div>






    )
}


export default Home;