import React from "react";
import "./../styles/ChoosePage.css";
import { useNavigate } from "react-router-dom";

export default function ChoosePage() {
  const navigate = useNavigate();

  return (
    <div className="choose-container">
      <div className="choose-card">
        <div className="choose-header">
          <button className="return-btn" onClick={() => {}}>
            Return to My Library
          </button>
        </div>

        <div className="choose-content">
          <h1 className="choose-title">Begin Your Adventure</h1>
          <div className="button-group">
            <button
              className="story-btn"
              onClick={() => navigate("/story-editor?mode=custom")}
            >
              Choose Your Own Story
            </button>
            <button
              className="story-btn"
              onClick={() => navigate("/story-editor?mode=ai")}
            >
              Generate AI Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
