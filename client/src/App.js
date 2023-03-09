//import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import CardList from "./components/cardList";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<CardList />} />
      </Routes>
    </div>
  );
}

export default App;
