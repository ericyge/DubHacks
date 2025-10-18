import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChoosePage from "./pages/ChoosePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChoosePage />} />
      </Routes>
    </Router>
  );
}

export default App;
