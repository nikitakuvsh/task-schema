import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskManager from "./components/TaskManager/TaskManager";
import Task from "./components/Task/Task";
import './main.css';
import './reset.css';
import { Buffer } from "buffer";
global.Buffer = Buffer;


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><h2>url</h2> <p>Доска с задачами - /tasks-manager</p> <p>Задача - /task ~ /task/task_id</p></>} />
        <Route path="/tasks-manager" element={<TaskManager />} />
        <Route path="/task" element={<Task />} />
      </Routes>
    </Router>
  );
}

export default App;
