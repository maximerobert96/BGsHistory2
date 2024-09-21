//import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage, { PutriPage } from "./components/cardList";
import DisplayCardInfo from './components/cardInfo';
import Practice from './components/practice';
import PatchChanges from './components/PatchChanges';
import CardPool from './components/cardPoolPage';
import PatchChanges2 from './components/PatchChanges2';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Practice />} />
        <Route path="/cards/:id" element={<DisplayCardInfo />} />
        <Route path="/:patchId/cards/" element={<MainPage  />}>
          <Route path="/:patchId/cards/:id" element={<DisplayCardInfo />} />
        </Route>
        <Route path="/:patchId/putricide-pool/" element={<PutriPage  />}>
          <Route path="/:patchId/putricide-pool/:id" element={<DisplayCardInfo />} />
        </Route>
        <Route path="/patch-changes/:patchId" element={<PatchChanges />} />
        <Route path="/patch-changes2/:patchId" element={<PatchChanges2 />} />
        <Route path="/:patchId/card-pool/:poolId" element={<CardPool />} />
      </Routes>
    </div>
  );
}

export default App;