import React, { useState, useRef, useEffect } from "react";
import "./../styles/StoryEditor.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function StoryEditor() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [turns, setTurns] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookTitle, setBookTitle] = useState("Loading title...");
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to extract query params
  const getQueryParam = (param) => {
    return new URLSearchParams(location.search).get(param);
  };

  useEffect(() => {
    const branchId = getQueryParam("branch_id");
    if (!branchId) return;

    // Fetch the book title from backend
    fetch(`http://localhost:8000/api/book-title/${branchId}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch title");
        return res.json();
      })
      .then((data) => setBookTitle(data.book_title))
      .catch((err) => {
        console.error("Error fetching title:", err);
        setBookTitle("Untitled Story");
      });
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyText.trim() || isProcessing) return;

    const newTurn = {
      id: Date.now(),
      userText: storyText.trim(),
      userImage: null,
      aiText: null,
    };

    setTurns((prev) => [...prev, newTurn]);
    setStoryText("");
    setIsProcessing(true);

    await delay(600);
    setTurns((prev) =>
      prev.map((t) =>
        t.id === newTurn.id ? { ...t, userImage: "placeholder" } : t
      )
    );

    await delay(800);
    setTurns((prev) =>
      prev.map((t) =>
        t.id === newTurn.id
          ? {
              ...t,
              aiText:
                "The night deepened, and the candles flickered softly under the full moon.",
            }
          : t
      )
    );

    setIsProcessing(false);
  };

  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  return (
    <div className="story-editor-container">
      <div className="story-editor-card">
        {/* Header */}
        <div className="story-editor-header">
          <div className="header-left">
            <button className="return-btn" onClick={() => navigate("/")}>
              Return to My Library
            </button>
            <h1 className="story-editor-title">{bookTitle}</h1>
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

        {/* Lined paper area */}
        <div className="story-editor-content">
          <div className="lined-paper">
            {turns.map((t) => (
              <div key={t.id} className="story-line-block fade-in-up">
                <div className="turn-wrapper">
                  <div className="line user-text">{t.userText}</div>
                  <div className="image-placeholder-wrapper">
                    {t.userImage ? (
                      <div className="image-placeholder">[User Image Placeholder]</div>
                    ) : (
                      <div className="image-placeholder empty" />
                    )}
                  </div>
                  <div className="line ai-text">
                    {t.aiText || <span className="empty-line">&nbsp;</span>}
                  </div>
                </div>
              </div>
            ))}

            {/* Input line */}
            <form className="line-input-row" onSubmit={handleSubmit}>
              <textarea
                ref={textareaRef}
                className="story-line-input"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Continue the story..."
                rows={1}
                style={{ lineHeight: "32px" }}
              />
              <button className="submit-btn" type="submit" disabled={isProcessing}>
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="bottom-buttons">
          <button className="story-editor-btn">The End</button>
          <button className="story-editor-btn">To Be Continued</button>
        </div>
      </div>

      {/* Overlay menu */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="overlay-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navigate("/ChoosePage")}>Return to Menu</button>
            <button onClick={() => navigate("/sidequest/new")}>Start a SideQuest</button>
            <button onClick={() => alert("Exporting to PDF...")}>Export to PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
