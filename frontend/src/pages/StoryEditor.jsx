import React, { useState } from "react";
import "./../styles/StoryEditor.css";
import { useNavigate } from "react-router-dom";

export default function StoryEditor() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [buttonPosition, setButtonPosition] = useState({ top: 40, left: 80 });
  const textareaRef = React.useRef(null);
  const navigate = useNavigate();

  const updateButtonPosition = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = storyText.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    const currentLine = lines.length;
    
    // Calculate position based on line number
    // Line height is 32px, starting at 8px padding
    const top = 8 + (currentLine * 32);
    
    // Keep button at left margin
    const left = 80;
    
    setButtonPosition({ top, left });
  };

  const handleTextChange = (e) => {
    setStoryText(e.target.value);
  };

  const handleKeyUp = () => {
    updateButtonPosition();
  };

  const handleClick = () => {
    updateButtonPosition();
  };

  const handleSubmit = () => {
    console.log("Story submitted:", storyText);
    alert("Story submitted!");
  };

  React.useEffect(() => {
    updateButtonPosition();
  }, [storyText]);

  return (
    <div className="story-editor-container">
      <div className="story-editor-card">
        {/* Header with return button and menu */}
        <div className="story-editor-header">
          <div className="header-left">
            <button className="return-btn" onClick={() => navigate("/")}>
              Return to My Library
            </button>
            <h1 className="story-editor-title">The night of Halloween...</h1>
          </div>
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
          <div className="lined-paper">
            <textarea
              ref={textareaRef}
              className="story-textarea"
              value={storyText}
              onChange={handleTextChange}
              onKeyUp={handleKeyUp}
              onClick={handleClick}
              placeholder="Once upon a time..."
              spellCheck="true"
            />
            <button 
              className="submit-btn"
              onClick={handleSubmit}
              style={{
                top: `${buttonPosition.top}px`,
                left: `${buttonPosition.left}px`
              }}
            >
              Submit
            </button>
          </div>
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
            <button onClick={() => navigate("/ChoosePage")}>
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