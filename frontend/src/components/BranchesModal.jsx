import React from "react";
import "./../styles/BranchesModal.css";

export default function BranchesModal({ book, onClose, onOpenBranch }) {
  if (!book) return null;

  const branches = book.branches || [];

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
      </div>
    </div>
  );
}
