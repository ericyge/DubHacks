import React, { useState } from "react";
import "./../styles/StoryEditor.css";
import { useNavigate } from "react-router-dom";

export default function StoryEditor() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="story-editor-container">
      <div className="story-editor-card">
        {/* Header with return button and menu */}
        <div className="story-editor-header">
          <button className="return-btn" onClick={() => navigate("/library")}>
            Return to My Library
          </button>
          <div className="menu-container">
            <button
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="story-editor-content">
          <h1 className="story-editor-title">The night of Halloween...</h1>
        </div>

        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button className="story-editor-btn">The End</button>
          <button className="story-editor-btn">To Be Continued</button>
        </div>
      </div>

      {/* Full-screen overlay menu */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="overlay-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navigate("/library")}>
              Return to Menu
            </button>
            <button onClick={() => navigate("/sidequest/new")}>
              Start a SideQuest
            </button>
            <button onClick={() => alert("Exporting to PDF...")}>
              Export to PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}