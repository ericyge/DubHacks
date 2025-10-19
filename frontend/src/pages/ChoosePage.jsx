import React, { useState } from "react";
import "./../styles/ChoosePage.css";
import { useNavigate } from "react-router-dom";
import BranchesModal from "./../components/BranchesModal";

export default function ChoosePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, settitle] = useState("");
  const [bookModal, setBookModal] = useState(null); // holds book object with branches

  // Handles AI or other modes
  const handleChoice = (mode) => {
    if (mode === "custom") {
      // Show popup to enter title
      setShowModal(true);
    } else {
      // Handle AI route directly
      fetch("http://localhost:8000/api/choose-page/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => {
          if (data.status === "success" && data.next) {
            navigate(data.next);
          } else {
            navigate(`/story-editor?mode=${mode}`);
          }
        })
        .catch((err) => console.error("Error sending choice:", err));
    }
  };

  const openBranchesForBook = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/books/${bookId}/`);
      if (!res.ok) throw new Error("Failed to load book");
      const data = await res.json();
      // data should include branches per backend implementation
      setBookModal(data);
    } catch (err) {
      console.error("Error loading branches for book:", err);
      alert("Failed to load branches for this book.");
    }
  };

  const closeBookModal = () => setBookModal(null);

  const openBranch = (branchId) => {
    // Navigate to story editor for the selected branch
    // keep popup open behavior minimal: close modal then navigate
    setBookModal(null);
    navigate(`/story-editor/?branch_id=${branchId}`);
  };

  const handleCreateStory = () => {
    if (!title.trim()) {
      alert("Please enter a title before continuing.");
      return;
    }
    fetch("http://localhost:8000/api/choose-page-popup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        navigate(`/story-editor/?book_id=${data.book_id}&branch_id=${data.branch_id}`);
      })
      .catch((err) => console.error("Error creating story:", err));
  };

  return (
    <div className="choose-container">
      <div className="choose-card">
        <div className="choose-header">
          <button className="return-btn" onClick={() => navigate("/")}>
            Return to My Library
          </button>
        </div>

        <div className="choose-content">
          <h1 className="choose-title">Begin Your Adventure</h1>
          <div className="button-group">
            <button className="story-btn" onClick={() => handleChoice("custom")}>
              Choose Your Own Story
            </button>
            <button className="story-btn" onClick={() => handleChoice("ai")}>
              Generate AI Prompt
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Create Title Name</h2>
            <textarea 
              className="title-input"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              placeholder="Enter your story title..."
              rows="2"
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="go-btn" onClick={handleCreateStory}>
                Go to New Adventure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
