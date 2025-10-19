import React, { useState, useRef, useEffect } from "react";
import "./../styles/StoryEditor.css";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

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
  const [storyEnded, setStoryEnded] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // Helper to extract query params
  const getQueryParam = (param) => new URLSearchParams(location.search).get(param);

  // Fetch book title
  useEffect(() => {
    const branchId = getQueryParam("branch_id");
    if (!branchId) return;

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

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const before = storyText.slice(0, start);
      const after = storyText.slice(end);
      const newValue = before + "\n" + after;
      setStoryText(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 1;
      });
    }
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.max(32, ta.scrollHeight) + "px";
  };
  useEffect(() => adjustTextareaHeight(), [storyText]);

  // Submit story
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyText.trim() || isProcessing || storyEnded) return;

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

      const response = await fetch(
        `http://localhost:8000/api/story-editor/?branch_id=${branchId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Prompt: storyText }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate image");
      const data = await response.json();

      setTurns((prev) =>
        prev.map((t) =>
          t.id === newTurn.id
            ? { ...t, userImage: data.image_url, aiText: data.text }
            : t
        )
      );
    } catch (err) {
      console.error("Error submitting story:", err);
      setTurns((prev) =>
        prev.map((t) =>
          t.id === newTurn.id ? { ...t, aiText: "Error generating image." } : t
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // End story handler
  const handleEndStory = () => {
    exportToPDF(); // Export PDF when ending story
    setStoryEnded(true);
    setShowCongrats(true);

    setTimeout(() => {
      setShowCongrats(false);
      navigate("/");
    }, 2500);
  };

  // PDF export helper
  const exportToPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(bookTitle, pageWidth / 2, y, { align: "center" });
    y += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    for (const t of turns) {
      if (y > 260) {
        pdf.addPage();
        y = margin;
      }

      pdf.setFont("helvetica", "bold");
      pdf.text("You:", margin, y);
      y += 6;
      pdf.setFont("helvetica", "normal");

      const userLines = pdf.splitTextToSize(t.userText, pageWidth - 2 * margin);
      pdf.text(userLines, margin, y);
      y += userLines.length * 6 + 4;

      if (t.userImage) {
        try {
          const img = await loadImage(t.userImage);
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (img.height * imgWidth) / img.width;
          if (y + imgHeight > 280) {
            pdf.addPage();
            y = margin;
          }
          pdf.addImage(img, "PNG", margin, y, imgWidth, imgHeight);
          y += imgHeight + 6;
        } catch (err) {
          console.error("Failed to add image:", err);
        }
      }

      pdf.setFont("helvetica", "bold");
      pdf.text("AI:", margin, y);
      y += 6;
      pdf.setFont("helvetica", "normal");

      const aiLines = pdf.splitTextToSize(t.aiText || "No response", pageWidth - 2 * margin);
      pdf.text(aiLines, margin, y);
      y += aiLines.length * 6 + 10;
    }

    pdf.save(`${bookTitle.replace(/\s+/g, "_")}.pdf`);
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // Measure CSS variables
  useEffect(() => {
    const measure = () => {
      const el = linedPaperRef.current;
      if (!el) return;
      const cs = window.getComputedStyle(el);
      const lhVar = cs.getPropertyValue("--line-height") || cs.lineHeight || "32px";
      const loVar = cs.getPropertyValue("--line-offset") || "8px";
      setLineMetrics({ lineHeight: parseFloat(lhVar) || 32, lineOffset: parseFloat(loVar) || 8 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="story-editor-container">
      <div className="story-editor-card">
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

        <div className="story-editor-content">
          <div className="lined-paper" ref={linedPaperRef}>
            {turns.map((t) => (
              <div key={t.id} className="story-line-block fade-in-up">
                <div className="turn-wrapper">
                  <div className="line user-text">{t.userText}</div>
                  <div className="image-placeholder-wrapper">
                    {t.userImage ? (
                      <img src={t.userImage} alt="Generated scene" className="generated-image" />
                    ) : (
                      <div className="image-placeholder empty" />
                    )}
                  </div>
                  <div className="line ai-text">{t.aiText || <span className="empty-line">&nbsp;</span>}</div>
                </div>
              </div>
            ))}

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
                disabled={storyEnded}
              />
              {!storyEnded && (
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
              )}
            </form>
          </div>
        </div>

        <div className="bottom-buttons">
          <button
            className="story-editor-btn"
            onClick={handleEndStory}
            disabled={storyEnded}
          >
            The End
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="overlay-menu" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => navigate("/choose-page")}>Return to Menu</button>
            <button onClick={() => navigate("/sidequest/new")}>Start a SideQuest</button>
            <button onClick={exportToPDF}>Export to PDF</button>
          </div>
        </div>
      )}

      {showCongrats && (
        <div className="congrats-overlay">
          <div className="congrats-message">
            🎉 Congratulations on finishing an exciting adventure! 🎉
          </div>
        </div>
      )}
    </div>
  );
}
