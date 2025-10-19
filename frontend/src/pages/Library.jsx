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

  // how many books per shelf (increase to show more books per row)
  const perShelf = 8; // change to 6/8/10 depending on desired density

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
    { id: 13, title: "Vampire Chronicles", color: "#8B0000", chapters: 16 },
    { id: 14, title: "Ancient Ruins", color: "#CD853F", chapters: 9 },
    { id: 15, title: "Sky Kingdom", color: "#87CEEB", chapters: 11 },
    { id: 16, title: "Underground City", color: "#4B4B4B", chapters: 13 },
    { id: 17, title: "Fairy Tales", color: "#FF69B4", chapters: 10 },
    { id: 18, title: "Shadow Realm", color: "#2C2C2C", chapters: 14 },
    { id: 19, title: "Crystal Caverns", color: "#9370DB", chapters: 8 },
    { id: 20, title: "Storm Chasers", color: "#4682B4", chapters: 12 },
    { id: 21, title: "Lost Civilization", color: "#8B7355", chapters: 15 },
    { id: 22, title: "Ghost Town", color: "#696969", chapters: 7 },
    { id: 23, title: "Arctic Expedition", color: "#B0E0E6", chapters: 10 },
    { id: 24, title: "Volcano Island", color: "#FF4500", chapters: 11 },
    { id: 25, title: "Midnight Garden", color: "#2F4F4F", chapters: 9 },
    { id: 26, title: "Golden Empire", color: "#FFD700", chapters: 13 },
    { id: 27, title: "Alien Encounter", color: "#00FF00", chapters: 12 },
    { id: 28, title: "Cursed Treasure", color: "#8B4513", chapters: 14 },
    { id: 29, title: "Lightning Strikes", color: "#FFD700", chapters: 8 },
    { id: 30, title: "Mystic Forest", color: "#228B22", chapters: 10 },
    { id: 31, title: "Warrior's Path", color: "#B22222", chapters: 16 },
    { id: 32, title: "Star Voyager", color: "#191970", chapters: 15 },
    { id: 33, title: "Haunted Castle", color: "#4B0082", chapters: 11 },
    { id: 34, title: "River Journey", color: "#4682B4", chapters: 9 },
    { id: 35, title: "Secret Society", color: "#800000", chapters: 13 },
    { id: 36, title: "Wild West", color: "#D2691E", chapters: 12 },
    { id: 37, title: "Ninja Academy", color: "#2F4F4F", chapters: 14 },
    { id: 38, title: "Phoenix Rising", color: "#FF6347", chapters: 10 },
    { id: 39, title: "Frozen Kingdom", color: "#ADD8E6", chapters: 11 },
    { id: 40, title: "Samurai Legend", color: "#8B0000", chapters: 15 },
  ];

  // group into shelves
  // If the user has typed into the search bar, show only titles that start with the query
  // (case-insensitive). Otherwise show all books. Then split into shelves of size `perShelf`.
  const query = searchQuery.trim().toLowerCase();
  const booksToShow = query
    ? mockBooks.filter((b) => b.title.toLowerCase().startsWith(query))
    : mockBooks;

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
    }, 300); // Match animation duration
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

  // generate/design assignment once (deterministic per id)
  useEffect(() => {
    const designs = {};
    mockBooks.forEach((b, i) => {
      // deterministic-ish assignment by id (so it doesn't reshuffle on re-render)
      const seed = b.id;
      designs[b.id] = seed % 2 === 0 ? "spine-style-1" : "spine-style-2";
    });
    setSpineDesigns(designs);
  }, [/* run once */]);

  // generate natural-looking random heights for each book once
  useEffect(() => {
    const minRem = 13;
    const maxRem = 18;
    const heights = {};
    mockBooks.forEach((b) => {
      const val = (Math.random() * (maxRem - minRem) + minRem).toFixed(2);
      heights[b.id] = `${val}rem`;
    });
    setBookHeights(heights);
  }, []);

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
            {/* Top Shelf */}
            <div className="shelf-top">
              <div className="shelf-base" />
              <div className="shelf-wood" />
            </div>

            {/* Books */}
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
                         height: bookHeights[book.id] || "16rem", // fallback
                       }}
                     >
                       <p className="book-spine-title">{book.title}</p>
                       <div className="book-glow" />
                     </div>
                   </div>
                 );
               })}
            </div>

            {/* Bottom Shelf */}
            <div className="shelf-bottom">
              <div className="shelf-wood" />
              <div className="shelf-base" />
            </div>
          </div>
        ))}
      </div>

      {/* No results message when a search yields nothing */}
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
            {/* Close Button */}
            <button 
              onClick={handleCloseBook} 
              className="close-btn"
              style={{ backgroundColor: selectedBook.color }}
            >
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
              <h2 
                className="book-popup-title"
                style={{ color: selectedBook.color }}
              >
                {selectedBook.title}
              </h2>
            </div>

            {/* Chapters Grid */}
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
                      e.currentTarget.style.backgroundColor = '#f9f9f9';
                    }}
                  >
                    <h3 
                      className="chapter-title"
                      style={{ color: selectedBook.color }}
                    >
                      Chapter {chapterNum}
                    </h3>
                    <p 
                      className="chapter-subtitle"
                      style={{ color: selectedBook.color }}
                    >
                      Click to read...
                    </p>
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
                style={{ 
                  backgroundColor: currentPage === 0 ? undefined : selectedBook.color 
                }}
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

              <span 
                className="page-counter"
                style={{ color: selectedBook.color }}
              >
                Page {currentPage + 1} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`nav-btn ${
                  currentPage === totalPages - 1 ? "disabled" : ""
                }`}
                style={{ 
                  backgroundColor: currentPage === totalPages - 1 ? undefined : selectedBook.color 
                }}
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