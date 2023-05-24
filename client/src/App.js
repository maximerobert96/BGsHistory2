//import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import CardList from "./components/cardList";
import MinionInfo from './components/minionInfo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<CardList />} />
        <Route path="/minion/:id" element={<MinionInfo />} />
      </Routes>
    </div>
  );
}

export default App;
