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
  const [submitHover, setSubmitHover] = useState(false);
  const linedPaperRef = useRef(null);
  const [lineMetrics, setLineMetrics] = useState({ lineHeight: 32, lineOffset: 8 });
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
  
  // Insert newline on Enter (plain Enter) and allow submit with Ctrl/Cmd+Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Ctrl/Cmd + Enter -> submit
      if (e.ctrlKey || e.metaKey) {
        // allow form submit to proceed (or call handleSubmit programmatically)
        return;
      }

      // Plain Enter -> insert newline into the textarea and prevent form submission
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = storyText.slice(0, start);
      const after = storyText.slice(end);
      const newValue = before + "\n" + after;
      setStoryText(newValue);
      // place cursor after the inserted newline
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 1;
      });
    }
  };

  // Auto-resize textarea to fit content, preventing internal scrolling
  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto"; // reset
    // add a small extra so the caret isn't cut off
    ta.style.height = Math.max(32, ta.scrollHeight) + "px";
  };

  // adjust whenever storyText changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [storyText]);

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

    try {
      const branchId = getQueryParam("branch_id");

      const response = await fetch(`http://localhost:8000/api/story-editor/?branch_id=${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Prompt: storyText }),
      });

      if (!response.ok) throw new Error("Failed to generate image");
      const data = await response.json();

      // Update turn with image
      setTurns((prev) =>
        prev.map((t) =>
          t.id === newTurn.id
            ? {
                ...t,
                userImage: data.image_url,
                aiText: "The story continues...",
              }
            : t
        )
      );
    } catch (err) {
      console.error("Error submitting story:", err);
      setTurns((prev) =>
        prev.map((t) =>
          t.id === newTurn.id
            ? { ...t, aiText: "Error generating image." }
            : t
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  // Measure CSS variables from the lined paper so we can snap heights to exact line multiples
  useEffect(() => {
    const measure = () => {
      const el = linedPaperRef.current;
      if (!el) return;
      const cs = window.getComputedStyle(el);
      // CSS variable might be set as '32px' — parseFloat will extract the number
      const lhVar = cs.getPropertyValue('--line-height') || cs.lineHeight || '32px';
      const loVar = cs.getPropertyValue('--line-offset') || '8px';
      const lineHeight = parseFloat(lhVar) || 32;
      const lineOffset = parseFloat(loVar) || 8;
      setLineMetrics({ lineHeight, lineOffset });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

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
          <div className="lined-paper" ref={linedPaperRef}>
            {turns.map((t) => (
              <div key={t.id} className="story-line-block fade-in-up">
                <div className="turn-wrapper">
                  <div className="line user-text">{t.userText}</div>
                  <div className="image-placeholder-wrapper">
                    {t.userImage ? (
                      <img
                        src={t.userImage}
                        alt="Generated scene"
                        className="generated-image"
                      />
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
                onKeyDown={handleKeyDown}
                placeholder="Continue the story..."
                rows={1}
                style={{ lineHeight: "32px" }}
              />
              <button
                className="submit-btn"
                type="submit"
                disabled={isProcessing}
                onMouseEnter={() => setSubmitHover(true)}
                onMouseLeave={() => setSubmitHover(false)}
                style={{ backgroundColor: submitHover ? "#FFBDBD" : undefined }}
              >
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
            <button onClick={() => navigate("/choose-page")}>Return to Menu</button>
            <button onClick={() => navigate("/sidequest/new")}>Start a SideQuest</button>
            <button onClick={() => alert("Exporting to PDF...")}>Export to PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}
