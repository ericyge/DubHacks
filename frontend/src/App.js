import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChoosePage from "./pages/ChoosePage";
import StoryEditor from "./pages/StoryEditor"; // 👈 updated import

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<ChoosePage />} />

        {/* Story Editor route */}
        <Route path="/story-editor" element={<StoryEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
