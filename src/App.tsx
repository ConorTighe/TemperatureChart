import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home';
import Dashboard from './components/dashboard';

function App() {
    return (
    <div>
          <Routes>
              <Route index
              key={"/home"} 
                  element={<Home/>}/>
              <Route key={"/dashboard"}   path="/dashboard"
                  element={<Dashboard/>}/>
          </Routes>
      </div>
      );
  }
  
  export default App;