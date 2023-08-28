import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './components/home/home';
import { BrowserRouter } from "react-router-dom";
import GeoChart from './components/chart/chart';

test('Home screen to load and navigation to work', () => {
  render(
  <BrowserRouter>
    <App />
  </BrowserRouter>);

  const title = screen.getByText(/Meteo charts/i);
  const text = screen.getByText(/Get meteorology data on your location!/i);
  expect(title).toBeInTheDocument();
  expect(text).toBeInTheDocument();

  const button = screen.getByRole("button");
  expect(button).toBeInTheDocument();

  fireEvent.click(button);

  expect(window.location.href).toEqual('http://localhost/dashboard')
});

const datasource = {
  label: 'Daily Max Tempature',
  data: [{ x: 1, y: "12-01-1995"}],
  fill: false,
  borderColor: '#F47174',
  tension: 0.1
}