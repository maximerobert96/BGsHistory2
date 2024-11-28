//import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage, { BuddyPage, PutriPage } from "./components/cardList";
import DisplayCardInfo from './components/cardInfo';
import Practice from './components/practice';
// import PatchChangesArchive from './components/PatchChangesArchive';
import CardPool from './components/cardPoolPage';
import PatchChanges from './components/PatchChanges';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Practice />} />
        <Route path="/:patchId/cards/" element={<MainPage  />} />
        {/* <Route path="/:patchId/putricide-pool/" element={<PutriPage  />} />
        <Route path="/:patchId/buddy-pool/" element={<BuddyPage  />} /> */}
        {/* <Route path="/:patchId/patch-changes/" element={<PatchChanges />} /> */}
        <Route path="/:patchId/patch-changes/" element={<PatchChanges />} />
        <Route path="/:patchId/card-pool/:poolId" element={<CardPool />} />
      </Routes>
    </div>
  );
}

export default App;