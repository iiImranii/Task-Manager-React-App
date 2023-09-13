import './App.css';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import AnimationRoutes from './components/AnimationRoutes';



const App = () => {
  
  return (
    <div className="App">
        <BrowserRouter>
          <AnimationRoutes/>
        </BrowserRouter>
    </div>

  );
};




export default App;
