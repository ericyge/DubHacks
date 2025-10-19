import React, { useState, useEffect } from "react";
import "./../styles/Library.css";
import { useNavigate } from "react-router-dom";

export default function Library() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [bookHeights, setBookHeights] = useState({});
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [spineDesigns, setSpineDesigns] = useState({});
  const [books, setBooks] = useState([]); // ✅ added missing state

  const perShelf = 8; // how many books per shelf

  // ✅ Mock fallback data (optional)
  const mockBooks = [
    { id: 1, title: "The Dragon's Quest", color: "#8B4513", chapters: 12 },
    { id: 2, title: "Mystery Manor", color: "#2F4F4F", chapters: 8 },
    { id: 3, title: "Space Odyssey", color: "#191970", chapters: 15 },
    { id: 4, title: "Enchanted Forest", color: "#228B22", chapters: 10 },
  ];

  // ✅ Fetch from backend (fallback to mock data if fails)
  useEffect(() => {
    fetch("http://localhost:8000/api/books/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => setBooks(data))
      .catch((err) => {
        console.error("Error loading books:", err);
        setBooks(mockBooks); // fallback to mock if backend not available
      });
  }, []);

  // ✅ Filtered books based on search
  const query = searchQuery.trim().toLowerCase();
  const booksToShow = query
    ? books.filter((b) => b.title.toLowerCase().startsWith(query))
    : books;

  // ✅ Group into shelves
  const shelves = [];
  for (let i = 0; i < booksToShow.length; i += perShelf) {
    shelves.push(booksToShow.slice(i, i + perShelf));
  }

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setCurrentPage(0);
    setIsClosing(false);
  };

  const handleCloseBook = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedBook(null);
      setCurrentPage(0);
      setIsClosing(false);
    }, 300);
  };

  const chaptersPerPage = 6;
  const totalPages = selectedBook
    ? Math.ceil(selectedBook.chapters / chaptersPerPage)
    : 0;

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const getCurrentChapters = () => {
    if (!selectedBook) return [];
    const start = currentPage * chaptersPerPage;
    return Array.from(
      {
        length: Math.min(chaptersPerPage, selectedBook.chapters - start),
      },
      (_, i) => start + i + 1
    );
  };

  // ✅ Generate spine designs once
  useEffect(() => {
    const designs = {};
    books.forEach((b) => {
      const seed = b.id;
      designs[b.id] = seed % 2 === 0 ? "spine-style-1" : "spine-style-2";
    });
    setSpineDesigns(designs);
  }, [books]);

  // ✅ Random heights for each book
  useEffect(() => {
    const minRem = 13;
    const maxRem = 18;
    const heights = {};
    books.forEach((b) => {
      const val = (Math.random() * (maxRem - minRem) + minRem).toFixed(2);
      heights[b.id] = `${val}rem`;
    });
    setBookHeights(heights);
  }, [books]);

  useEffect(() => {
    const checkScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 48;
      setShowScrollIndicator(!atBottom && !selectedBook);
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [selectedBook]);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="library-container">
      {/* Header */}
      <div className="library-header">
        <h1 className="library-title">Jacob's Library</h1>

        <div className="library-actions">
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

          <button onClick={() => navigate("/choose-page")} className="new-story-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <div className="shelf-top">
              <div className="shelf-base" />
              <div className="shelf-wood" />
            </div>

            <div className="books-row">
              {shelf.map((book) => {
                const designClass = spineDesigns[book.id] || "spine-style-1";
                return (
                  <div
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className="book-spine"
                  >
                    <div
                      className={`book-spine-inner ${designClass}`}
                      style={{
                        backgroundColor: book.color,
                        height: bookHeights[book.id] || "16rem",
                      }}
                    >
                      <p className="book-spine-title">{book.title}</p>
                      <div className="book-glow" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="shelf-bottom">
              <div className="shelf-wood" />
              <div className="shelf-base" />
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {query && booksToShow.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "2rem", color: "#fff" }}>
          No books match "{searchQuery}"
        </div>
      )}

      {/* Scroll Indicator */}
      <div
        className={`scroll-indicator ${!showScrollIndicator ? "hidden" : ""}`}
        onClick={scrollToBottom}
        role="button"
        aria-label="Scroll to bottom"
      >
        <div className="scroll-text">More books</div>
        <div className="scroll-arrow">↓</div>
      </div>

      {/* Book Popup */}
      {selectedBook && (
        <div className={`book-popup-overlay ${isClosing ? "closing" : ""}`}>
          <div className="book-popup">
            <button 
              onClick={handleCloseBook} 
              className="close-btn"
              style={{ backgroundColor: selectedBook.color }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="book-popup-header">
              <h2 className="book-popup-title" style={{ color: selectedBook.color }}>
                {selectedBook.title}
              </h2>
            </div>

            <div className="chapters-container">
              <div className="chapters-grid">
                {getCurrentChapters().map((chapterNum) => (
                  <div 
                    key={chapterNum} 
                    className="chapter-box"
                    style={{ borderColor: selectedBook.color }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = selectedBook.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9f9f9";
                    }}
                  >
                    <h3 className="chapter-title" style={{ color: selectedBook.color }}>
                      Chapter {chapterNum}
                    </h3>
                    <p className="chapter-subtitle" style={{ color: selectedBook.color }}>
                      Click to read...
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="book-popup-footer">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`nav-btn ${currentPage === 0 ? "disabled" : ""}`}
                style={{ backgroundColor: currentPage === 0 ? undefined : selectedBook.color }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <span className="page-counter" style={{ color: selectedBook.color }}>
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`nav-btn ${currentPage === totalPages - 1 ? "disabled" : ""}`}
                style={{ backgroundColor: currentPage === totalPages - 1 ? undefined : selectedBook.color }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
