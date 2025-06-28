import { useEffect } from "react";
import { FaPlay, FaShareAlt, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PhoneImg from "../assets/phone-preview.png";

import AOS from "aos";
import "aos/dist/aos.css";

const steps = [
  {
    icon: <FaPlay className="text-white" />,
    title: "Start your fundraiser",
    description:
      "It’ll take only 2 minutes. Just tell us a few details about you and the ones you are raising funds for.",
  },
  {
    icon: <FaShareAlt className="text-white" />,
    title: "Share your fundraiser",
    description:
      "Share the fundraiser with friends and family. In no time, support will start pouring in. You can share directly from your dashboard.",
  },
  {
    icon: <FaMoneyBillWave className="text-white" />,
    title: "Withdraw funds",
    description:
      "The funds raised can be withdrawn without hassle directly to your bank account. It takes only 5 minutes to withdraw on Seva.",
  },
];

const FundraiserSteps = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleStartFundraiser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/start");
    }
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        {/* Section Heading */}
        <h2 className="fw-bold text-center mb-5 display-6" data-aos="fade-up">
          Start a fundraiser in{" "}
          <span className="text-primary">3 simple steps</span>
        </h2>

        {/* Steps and Image */}
        <div className="d-flex flex-column flex-lg-row align-items-center gap-5">
          {/* Left - Steps */}
          <div className="flex-1" data-aos="fade-up">
            {steps.map((step, index) => (
              <div
                className="d-flex align-items-start mb-4"
                key={index}
                data-aos="fade-right"
                data-aos-delay={index * 200}
              >
                <div
                  className="rounded-circle bg-primary d-flex justify-content-center align-items-center me-3"
                  style={{ width: "40px", height: "40px" }}
                >
                  {step.icon}
                </div>
                <div>
                  <h5 className="fw-semibold mb-1">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Phone Image */}
          <div className="flex-1 d-flex justify-content-center" data-aos="zoom-in">
            <img
              src={PhoneImg}
              alt="Phone preview"
              style={{ maxHeight: "550px" }}
            />
          </div>
        </div>

        {/* Call-to-Action Button */}
        <div className="text-center mt-5" data-aos="fade-up">
          <button
            onClick={handleStartFundraiser}
            className="bg-sky-500 text-white text-lg font-semibold tracking-wide px-5 py-3 rounded shadow-md hover:bg-sky-600 transition duration-300 uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            START A FUNDRAISER FOR FREE
          </button>
        </div>
      </div>
    </section>
  );
};

export default FundraiserSteps;
