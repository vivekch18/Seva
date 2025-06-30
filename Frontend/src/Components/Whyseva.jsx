import {
  FaChartLine,
  FaUsers,
  FaTools,
  FaCreditCard,
  FaHeadset,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaGlobe,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const features = [
  {
    icon: <FaChartLine size={28} />,
    title: "Best Success Rate",
    desc: "Industry’s best fundraising success rate",
  },
  {
    icon: <FaUsers size={28} />,
    title: "10+ Contributors",
    desc: "Supported by 10+ contributors",
  },
  {
    icon: <FaTools size={28} />,
    title: "Easy Tools",
    desc: "Easy-to-manage tools to boost results",
  },
  {
    icon: <FaCreditCard size={28} />,
    title: "All Payment Modes",
    desc: "Receive contributions via all major payment methods",
  },
  {
    icon: <FaHeadset size={28} />,
    title: "24/7 Expert Support",
    desc: "Get expert support whenever you need it",
  },
  {
    icon: <FaTachometerAlt size={28} />,
    title: "Smart Dashboard",
    desc: "A dedicated smart dashboard for every user",
  },
  {
    icon: <FaMoneyBillWave size={28} />,
    title: "Hassle-free Withdrawals",
    desc: "Withdraw funds easily to your bank account",
  },
  {
    icon: <FaGlobe size={28} />,
    title: "International Support",
    desc: "Accept donations from around the globe",
  },
];

const WhySeva = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const [supportClicked, setSupportClicked] = useState(false);

  const toggleSupport = () => {
    setSupportClicked((prev) => !prev);
  };

  return (
    <section className="bg-white py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-5" data-aos="fade-up">
          Why <span className="text-primary">Seva?</span>
        </h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {features.map((item, index) => {
            const isSupport = item.title === "24/7 Expert Support";
            const isClicked = isSupport && supportClicked;

            return (
              <div
                className="col"
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div
                  className={`bg-light rounded-4 p-4 shadow-sm h-100 d-flex flex-column align-items-center justify-content-center text-center transition-all duration-300 hover:shadow-lg ${
                    isSupport ? "cursor-pointer" : ""
                  }`}
                  onClick={isSupport ? toggleSupport : undefined}
                  style={{ minHeight: "200px", position: "relative" }}
                >
                  {!isClicked ? (
                    <>
                      <div className="text-primary mb-3">{item.icon}</div>
                      <h6 className="fw-semibold mb-1">{item.title}</h6>
                      <p className="text-muted small mb-0">{item.desc}</p>
                      <div className="w-25 mt-2 border-2 border-warning border-top rounded" />
                    </>
                  ) : (
                    <div
                      className="text-dark d-flex flex-column justify-content-center align-items-center h-100"
                      style={{ padding: "20px" }}
                    >
                      <h6 className="fw-bold mb-2">Need Help?</h6>
                      <p className="text-muted mb-2 small">
                        Our experts are available 24/7.
                      </p>
                      <p className="fw-semibold mb-0">
                        Call us at{" "}
                        <a
                          href="tel:7360904330"
                          className="text-primary text-decoration-none"
                        >
                          7360758960
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySeva;
