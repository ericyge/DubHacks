import React, { useState, useEffect } from "react";
import "./../styles/Library.css";
import { useNavigate } from "react-router-dom";
import BranchesModal from "./../components/BranchesModal";

export default function Library() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [bookHeights, setBookHeights] = useState({});
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [spineDesigns, setSpineDesigns] = useState({});
  const [bookColors, setBookColors] = useState({});
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
/*
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setCurrentPage(0);
    setIsClosing(false);
  };
*/
  // Open branches in a modal grid instead of navigating away
  const handleBookClick = (book) => {
    // book object already contains `branches` from the list_books API
    setSelectedBook(book);
    setCurrentPage(0);
    setIsClosing(false);
  };

  const openBranchFromModal = (branchId) => {
    // Close modal and navigate to story-editor for the chosen branch
    setSelectedBook(null);
    navigate(`/story-editor/?branch_id=${branchId}`);
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

  // Assign each fetched book a color from a palette if it doesn't already have one.
  // This mapping is stable (deterministic) based on book.id.
  useEffect(() => {
    if (!books || books.length === 0) return;

    const palette = [
      "#8B4513", "#2F4F4F", "#191970", "#228B22", "#8B0000",
      "#B22222", "#4B0082", "#006400", "#483D8B",
      "#2E8B57", "#556B2F", "#CD5C5C", "#4682B4"
    ];

    const hash = (v) => {
      const s = String(v);
      let h = 0;
      for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
      return Math.abs(h);
    };

    const mapped = {};
    books.forEach((b) => {
      // preserve color if backend already provides one
      if (b.color) mapped[b.id] = b.color;
      else mapped[b.id] = palette[hash(b.id) % palette.length];
    });
    setBookColors(mapped);
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
    // If there's only one shelf worth of books, never show the scroll indicator
    if (!books || books.length <= perShelf || selectedBook) {
      setShowScrollIndicator(false);
      return;
    }

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
  }, [selectedBook, books.length, perShelf]);

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
                         backgroundColor: book.color || bookColors[book.id] || "#777",
                         height: bookHeights[book.id] || "16rem", // fallback
                       }}
                     >
                        <div className="book-shade" />
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

      {/* Book Popup / Branches Modal */}
      {selectedBook && (
        <BranchesModal
          book={selectedBook}
          onClose={handleCloseBook}
          onOpenBranch={openBranchFromModal}
        />
      )}
    </div>
  );
}
