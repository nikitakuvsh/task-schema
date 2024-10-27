import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskManager from "./components/TaskManager/TaskManager";
import Task from "./components/Task/Task";
import './main.css';
import './reset.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>init project</h2>} />
        <Route path="/tasks-manager" element={<TaskManager />} />
        <Route path="/task" element={<Task />} />
      </Routes>
    </Router>
  );
}

export default App;
