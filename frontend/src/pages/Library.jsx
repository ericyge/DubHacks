import React, { useState } from "react";
import "./../styles/Library.css";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with database data
  const mockBooks = [
    { id: 1, title: "The Dragon's Quest", color: "#8B4513", chapters: 12 },
    { id: 2, title: "Mystery Manor", color: "#2F4F4F", chapters: 8 },
    { id: 3, title: "Space Odyssey", color: "#191970", chapters: 15 },
    { id: 4, title: "Enchanted Forest", color: "#228B22", chapters: 10 },
    { id: 5, title: "Pirate Adventures", color: "#8B0000", chapters: 14 },
    { id: 6, title: "Time Traveler", color: "#4B0082", chapters: 11 },
    { id: 7, title: "Robot Rebellion", color: "#708090", chapters: 9 },
    { id: 8, title: "Wizard Academy", color: "#800080", chapters: 13 },
    { id: 9, title: "Jungle Expedition", color: "#556B2F", chapters: 7 },
    { id: 10, title: "Ocean Deep", color: "#006994", chapters: 10 },
    { id: 11, title: "Mountain Peak", color: "#A0522D", chapters: 6 },
    { id: 12, title: "Desert Mirage", color: "#DAA520", chapters: 8 },
  ];

  const booksPerShelf = 6;
  const shelves = [];
  for (let i = 0; i < mockBooks.length; i += booksPerShelf) {
    shelves.push(mockBooks.slice(i, i + booksPerShelf));
  }

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setCurrentPage(0);
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
    setCurrentPage(0);
  };

  const chaptersPerPage = 6;
  const totalPages = selectedBook
    ? Math.ceil(selectedBook.chapters / chaptersPerPage)
    : 0;

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getCurrentChapters = () => {
    if (!selectedBook) return [];
    const start = currentPage * chaptersPerPage;
    return Array.from(
      {
        length: Math.min(
          chaptersPerPage,
          selectedBook.chapters - start
        ),
      },
      (_, i) => start + i + 1
    );
  };

  return (
    <div className="library-container">
      {/* Header */}
      <div className="library-header">
        <h1 className="library-title">Jacob's Library</h1>

        <div className="library-actions">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {/* New Story Button */}
          <button
            onClick={() => navigate("/choose-page")}
            className="new-story-btn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Story
          </button>
        </div>
      </div>

      {/* Shelves */}
      <div className="shelves-container">
        {shelves.map((shelf, shelfIndex) => (
          <div key={shelfIndex} className="shelf-section">
            {/* Books */}
            <div className="books-row">
              {shelf.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="book-spine"
                >
                  <div
                    className="book-spine-inner"
                    style={{ backgroundColor: book.color }}
                  >
                    <p className="book-spine-title">{book.title}</p>
                    <div className="book-glow" />
                  </div>
                </div>
              ))}
            </div>

            {/* Shelf */}
            <div className="shelf-wood" />
            <div className="shelf-base" />
          </div>
        ))}
      </div>

      {/* Book Popup */}
      {selectedBook && (
        <div className="book-popup-overlay">
          <div className="book-popup">
            {/* Close Button */}
            <button onClick={handleCloseBook} className="close-btn">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Book Title */}
            <div className="book-popup-header">
              <h2 className="book-popup-title">{selectedBook.title}</h2>
            </div>

            {/* Chapters Grid */}
            <div className="chapters-container">
              <div className="chapters-grid">
                {getCurrentChapters().map((chapterNum) => (
                  <div key={chapterNum} className="chapter-box">
                    <h3 className="chapter-title">Chapter {chapterNum}</h3>
                    <p className="chapter-subtitle">Click to read...</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="book-popup-footer">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`nav-btn ${currentPage === 0 ? "disabled" : ""}`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <span className="page-counter">
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`nav-btn ${
                  currentPage === totalPages - 1 ? "disabled" : ""
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}