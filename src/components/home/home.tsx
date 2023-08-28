import React from 'react';
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { Button, Title, Text } from '@mantine/core';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <Title order={1}>Meteo charts</Title>
      <Text fz="md">Get meteorology data on your location!</Text>
      <img src={process.env.PUBLIC_URL + '/kite.gif'} className="App-logo" alt="logo" />
      <Button onClick={() => navigate('/dashboard')}> Show Dashboard </Button>
    </div>
  );
}

export default Home;
