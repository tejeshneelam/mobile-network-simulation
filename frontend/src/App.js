// src/App.js
import React from 'react';
import Navbar from './components/Navbar';
import CreateNetwork from './components/CreateNetwork';
import AddTower from './components/AddTower';
import AddUser from './components/AddUser';
import MakeCall from './components/MakeCall';
import NetworkCanvas from './components/NetworkCanvas'; // <-- new import

function App() {
  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <Navbar />
      <CreateNetwork />
      <hr />
      <AddTower />
      <hr />
      <AddUser />
      <hr />
      <MakeCall />
      <hr />
      <NetworkCanvas /> {/* <-- show visual graph */}
    </div>
  );
}

export default App;
