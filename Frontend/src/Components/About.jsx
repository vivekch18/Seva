import React from "react";
import { FaHeart, FaBullseye, FaUsers } from "react-icons/fa";
import founderImage from "../assets/founder.jpg";
import Footer from "../Components/Footer";


const About = () => {
  return (
    <section className="bg-light py-5 mt-5"> {/* Added top margin for navbar */}
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-3">About <span className="text-primary">Seva</span></h1>
          <p className="lead text-muted">
            Empowering communities through selfless giving. Discover our mission and vision.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="row text-center mb-5">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <FaBullseye className="text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Our Mission</h5>
              <p className="text-muted">
                To connect generous individuals with those in urgent need, fostering a culture of compassion and community support.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <FaHeart className="text-danger fs-1 mb-3" />
              <h5 className="fw-bold">Our Vision</h5>
              <p className="text-muted">
                A world where no one struggles alone — where collective action turns small donations into powerful impact.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <FaUsers className="text-success fs-1 mb-3" />
              <h5 className="fw-bold">Our Values</h5>
              <p className="text-muted">
                Integrity, transparency, empathy, and innovation drive every campaign hosted on Seva.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3">How Seva Began</h2>
            <p className="text-muted">
              Born from a desire to make giving accessible and impactful, Seva started as a humble idea and grew into a powerful platform
              that enables people to support urgent causes in real-time. Whether it’s funding life-saving medical treatments or supporting education,
              our goal is simple — empower hope through community.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="bg-primary rounded-4 p-5 text-white text-center shadow">
              <h4 className="mb-3">"Giving is not just about making a donation. It's about making a difference."</h4>
              <p className="mb-0">— Seva Team</p>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded shadow-sm text-center ">
              <h4 className="fw-semibold mb-4">Meet the Developer</h4>
              <img 
                src={founderImage}
                alt="Founder Vivek Raj"
                className="img-fluid rounded mb-4 shadow mx-auto d-block"
                style={{ width: "300px", height: "200px", objectFit: "cover" }}
              />
              <h5 className="fw-bold mb-1">Vivek Raj</h5>
              <p className="text-muted">
                Vivek Raj, the developer of Seva, envisioned a world where selfless giving could be streamlined through technology. With a passion for service and innovation,
                he built Seva to help people contribute meaningfully to causes that truly matter.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
    
  );
};

export default About;
