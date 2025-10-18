import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChoosePage from "./pages/ChoosePage";
import StoryEditor from "./pages/StoryEditor"; // 👈 updated import
import Library from "./pages/Library";

function App() {
  return (
    <Router>
      <Routes>
        {/* ChoosePage route */}
        <Route path="/ChoosePage" element={<ChoosePage />} />

        {/* Story Editor route */}
        <Route path="/story-editor" element={<StoryEditor />} />

        {/* Default route */}
        <Route path="/" element={<Library />} />
      </Routes>
    </Router>
  );
}

export default App;
