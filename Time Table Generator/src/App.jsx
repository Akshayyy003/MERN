import { useState } from 'react'
import Home from '../components/Home'
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import TimetableCard from '../components/TimetableCard';
function App() {
  
  return <RouterProvider router={router} />;
  // return <TimetableCard />
  
}

export default App
