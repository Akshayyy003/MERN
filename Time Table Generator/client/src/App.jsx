import { useState } from 'react'
import Home from '../components/Home'
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
function App() {
  
  return <RouterProvider router={router} />;
  
}

export default App
