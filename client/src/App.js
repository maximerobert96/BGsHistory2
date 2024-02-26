//import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./components/cardList";
import DisplayCardInfo from './components/cardInfo';
import Practice from './components/practice';
import PatchChanges from './components/PatchChanges';
import CardPool from './components/cardPoolPage';
import MainPage2 from './components/cardList2';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Practice />} />
        <Route path="/cards/:id" element={<DisplayCardInfo />} />
        <Route path="/:patchId/cards/" element={<MainPage  />}>
          <Route path="/:patchId/cards/:id" element={<DisplayCardInfo />} />
        </Route>
        <Route path="/patch-changes/:patchId" element={<PatchChanges />} />
        <Route path="/:patchId/card-pool/:poolId" element={<CardPool />} />
        <Route path="/:patchId/cards2/" element={<MainPage2  />}>
          <Route path="/:patchId/cards2/:id" element={<DisplayCardInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;