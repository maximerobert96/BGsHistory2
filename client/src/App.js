//import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/cardList";
import CardInfo from './components/cardInfo';
import Practice from './components/practice';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Practice />} />
        <Route path="/cards/:id" element={<CardInfo />} />
        <Route path="/:patchId/cards/" element={<MainPage  />}>
          <Route path="/:patchId/cards/:id" element={<CardInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;