import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* About Section */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">About Seva</h5>
            <p className="text-unmuted">
              Seva is a crowdfunding platform for selfless giving. We empower people to support causes they care about, from medical emergencies to education.
            </p>
          </div>

          {/* Causes Section */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Causes</h5>
            <ul className="list-unstyled text-unmuted">
              <li>❤️ Medical Crowdfunding</li>
              <li>🎗️ Cancer Crowdfunding</li>
              <li>🫀 Transplant Crowdfunding</li>
              <li>📘 Education Crowdfunding</li>
              <li>🏅 Sports Crowdfunding</li>
              <li>👶 Child Welfare</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p className="mb-1">📍 123 Giving Lane, Mumbai, India</p>
            <p className="mb-1">📞 +91 98765 43210</p>
            <p className="mb-1">✉️ support@seva.org</p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-light fs-5"><FaFacebookF /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaLinkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">🏠 Home</Link></li>
              <li><Link to="/campaigns" className="text-light text-decoration-none">🎯 All Campaigns</Link></li>
              <li><Link to="/start" className="text-light text-decoration-none">➕ Start a Campaign</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">ℹ️ About Us</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">📬 Contact</Link></li>
            </ul>
          </div>

        </div>

        <hr className="border-light" />
        <p className="text-center text-align-center small mb-0">
          © {new Date().getFullYear()} Seva. All rights reserved by ~Vivek Raj
        </p>
      </div>
    </footer>
  );
};

export default Footer;
