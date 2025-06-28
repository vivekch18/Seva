import { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import sevaLogo from "../assets/seva.png"; // Adjust path if necessary
import profile from "./UserProfile";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
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
    if (!token) {
      navigate("/login");
    } else {
      navigate("/start");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-100 z-50 transition-all duration-300 ${
        scrolled ? "bg-white border-b border-gray-200" : "bg-white"
      }`}
    >
      <div className="container d-flex justify-content-between align-items-center py-3">
        <a
          href="/"
          className="text-decoration-none d-flex align-items-center"
          style={{ height: "32px" }}
        >
          <img
            src={sevaLogo}
            alt="Seva"
            style={{
              height: "110px",
              objectFit: "contain",
              display: "block",
              maxHeight: "120px",
            }}
          />
        </a>

        <nav className="d-none d-md-flex gap-4 align-items-center fw-medium">
          <a
            href="/"
            className="text-decoration-none text-dark px-2 py-1 hover:text-indigo-600"
          >
            Home
          </a>
          <a
            href="/campaigns"
            className="text-decoration-none text-dark px-2 py-1 hover:text-indigo-600"
          >
            Campaigns
          </a>
          <a
            href="/about"
            className="text-decoration-none text-dark px-2 py-1 hover:text-indigo-600"
          >
            About
          </a>

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
                <div
                  className="position-absolute end-0 mt-2 bg-white border shadow rounded px-3 py-2"
                  style={{ zIndex: 1000, minWidth: "160px" }}
                >
                  <button
                    className="btn btn-link text-dark w-100 text-start p-0 mb-2"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/userprofile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="btn btn-link text-dark w-100 text-start p-0 mb-2"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-campaigns");
                    }}
                  >
                    My Campaigns
                  </button>
                  <hr className="my-2" />
                  <button
                    className="btn btn-outline-danger w-100 mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
