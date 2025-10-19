import React from "react";
import "./../styles/ChoosePage.css";
import { useNavigate } from "react-router-dom";

export default function ChoosePage() {
  const navigate = useNavigate();
  

  const handleChoice = (mode) => {
  fetch("http://localhost:8000/api/choose-page/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      // Navigate to the URL returned by Django
      if (data.status === "success" && data.next) {
        navigate(data.next);
      } else {
        console.warn("No next URL provided by backend, fallback to default");
        navigate(`/story-editor?mode=${mode}`);
      }
    })
    .catch((err) => {
      console.error("Error sending choice:", err);
    });
};


  return (
    <div className="choose-container">
      <div className="choose-card">
        <div className="choose-header">
          <button
            className="return-btn"
            onClick={() => navigate("/")}
          >
            Return to My Library
          </button>
        </div>

        <div className="choose-content">
          <h1 className="choose-title">Begin Your Adventure</h1>
          <div className="button-group">
            <button
              className="story-btn"
              onClick={() => handleChoice("custom")}
            >
              Choose Your Own Story
            </button>
            <button
              className="story-btn"
              onClick={() => handleChoice("ai")}
            >
              Generate AI Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
