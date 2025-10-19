import React, { useState } from "react";
import "./../styles/BranchesModal.css";

export default function BranchesModal({ book, onClose, onOpenBranch }) {
  // ✅ Hooks must always be called at top level
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [frameCount, setFrameCount] = useState(""); // 👈 new input state
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!book) return null;

  const branches = book.branches || [];

  const handleCreateSideQuest = () => {
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewName("");
    setFrameCount("");
  };

  const handleSubmit = async () => {
    if (!newName.trim()) return alert("Please enter a name.");
    if (!frameCount || isNaN(frameCount) || frameCount <= 0)
      return alert("Please enter a valid number of frames.");

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/create-sidequest/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: book.id,
          name: newName,
          frames_to_keep: parseInt(frameCount, 10), // 👈 send frame count
        }),
      });

      if (!response.ok) throw new Error(`Server error ${response.status}`);
      const data = await response.json();

      // Optionally update local branches list
      if (book.branches) {
        book.branches.push(data);
      }

      setIsCreating(false);
      setNewName("");
      setFrameCount("");
    } catch (err) {
      console.error("Error creating SideQuest:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="branches-modal-overlay">
      <div className="branches-modal-card">
        <div className="branches-modal-header">
          <h2>Branches for "{book.title}"</h2>
          <button className="branches-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="branches-grid">
          {branches.length === 0 && (
            <div className="no-branches">No branches yet</div>
          )}
          {branches.map((b) => (
            <div key={b.id} className="branch-tile">
              <div className="branch-name">{b.name || `Branch ${b.id}`}</div>
              <div className="branch-actions">
                <button
                  className="open-branch-btn"
                  onClick={() => onOpenBranch(b.id)}
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Bottom-right controls */}
        <div className="sidequest-controls">
          {isCreating ? (
            <div className="create-sidequest-form">
              <input
                type="text"
                placeholder="Enter sidequest name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isSubmitting}
              />
              <input
                type="number"
                min="1"
                placeholder="Frames to keep"
                value={frameCount}
                onChange={(e) => setFrameCount(e.target.value)}
                disabled={isSubmitting}
                style={{ width: "130px" }}
              />
              <button
                className="confirm-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Confirm"}
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ) : (
          <div className="sidequest-controls">
            <button
              className="create-sidequest-btn"
              onClick={handleCreateSideQuest}
            >
              Create SideQuest
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
