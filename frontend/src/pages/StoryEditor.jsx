import React, { useState } from "react";
import "./../styles/StoryEditor.css";
import { useNavigate } from "react-router-dom";

export default function StoryEditor() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="story-editor-container">
      <div className="story-editor-card">
        {/* Header with title and hamburger */}
        <div className="story-editor-header">
          <h1 className="story-editor-title">The night of Halloween...</h1>

          <div className="menu-container">
            <button
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/library")}>
                  Back to Menu
                </button>
                <button onClick={() => navigate("/sidequest/new")}>
                  Create a new SideQuest
                </button>
                <button onClick={() => alert("Exporting to PDF...")}>
                  Export to PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button className="story-editor-btn">The End</button>
          <button className="story-editor-btn">To Be Continued</button>
        </div>
      </div>
    </div>
  );
}
