import React from 'react';
import '../App.css';
// import useGeolocation from "react-hook-geolocation";
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <img src={process.env.PUBLIC_URL + '/datahow.png'} className="App-logo" alt="logo" />
      <button onClick={() => navigate('/dashboard')}> Show Dashboard </button>
    </div>
  );
}

export default Home;
