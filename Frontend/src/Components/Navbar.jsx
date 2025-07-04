import { useState, useEffect, useRef } from "react";
import { User, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import sevaLogo from "../assets/seva.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleStartFundraiser = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/start" : "/login");
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow border-b" : "bg-white"}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center px-4 py-3">
        {/* Logo */}
        <a href="/" className="d-flex align-items-center ml-25" style={{ height: "32px" }}>
          <img src={sevaLogo} alt="Seva" style={{ height: "110px", objectFit: "contain" }} />
        </a>

        {/* Hamburger Menu - Mobile */}
        <button
          className="d-md-none text-dark"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Nav Links - Desktop */}
        <nav className="d-none d-md-flex gap-4 align-items-center fw-medium mr-20">
          <a href="/" className="text-decoration-none text-dark px-2 py-1 hover:text-indigo-600">Home</a>
          <a href="/campaigns" className="text-decoration-none text-dark px-2 py-1 hover:text-indigo-600">Campaigns</a>
          <a href="/about" className="text-decoration-none text-dark px-2 py-1 hover:text-indigo-600">About</a>

          <button
            onClick={handleStartFundraiser}
            className="text-blue-400 border-2 border-blue-300 text-lg font-semibold tracking-wide px-3 py-2 rounded-pill shadow-md hover:bg-sky-50"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Start a Fundraiser
          </button>

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/login")}
              className="text-dark text-lg font-medium tracking-wide px-1 py-1 rounded hover:bg-indigo-50"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Sign In
            </button>
          ) : (
            <div className="position-relative" ref={dropdownRef}>
              <button
                className="btn btn-light rounded-circle border d-flex align-items-center justify-content-center p-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User size={20} />
              </button>

              {dropdownOpen && (
                <div className="position-absolute end-0 mt-2 bg-white border shadow rounded px-3 py-2" style={{ zIndex: 1000, minWidth: "160px" }}>
                  <button className="btn btn-link text-dark w-100 text-start p-0 mb-2" onClick={() => { setDropdownOpen(false); navigate("/userprofile"); }}>
                    Profile
                  </button>
                  <button className="btn btn-link text-dark w-100 text-start p-0 mb-2" onClick={() => { setDropdownOpen(false); navigate("/my-campaigns"); }}>
                    My Campaigns
                  </button>
                  <hr className="my-2" />
                  <button className="btn btn-outline-danger w-100 mt-2" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="d-md-none bg-white border-t">
          <nav className="d-flex flex-column px-4 py-3 gap-3">
            <a href="/" className="text-dark text-decoration-none">Home</a>
            <a href="/campaigns" className="text-dark text-decoration-none">Campaigns</a>
            <a href="/about" className="text-dark text-decoration-none">About</a>
            <button onClick={handleStartFundraiser} className="btn btn-outline-primary w-100">Start a Fundraiser</button>

            {!isLoggedIn ? (
              <button
                  onClick={() => {
                    setIsMobileMenuOpen(false); // ✅ Close mobile menu
                    navigate("/login");
                }}
                className="btn btn-primary w-100"
              >
              Sign In
            </button>

            ) : (
              <>
                <button onClick={() => { navigate("/userprofile"); setIsMobileMenuOpen(false); }} className="btn btn-link text-start">Profile</button>
                <button onClick={() => { navigate("/my-campaigns"); setIsMobileMenuOpen(false); }} className="btn btn-link text-start">My Campaigns</button>
                <button onClick={handleLogout} className="btn btn-outline-danger mt-2">Logout</button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
