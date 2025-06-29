import heroImage from "../assets/cancer-patient.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "../Components/CampaignCard";
import Footer from "../Components/Footer";
import FundraiserSteps from "../Components/FundraiserSteps";
import WhySeva from "./Whyseva";
import { useNavigate, Link } from "react-router-dom";

const heroImage = "/cancer-patient.jpg";


export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/campaigns");
        setCampaigns(res.data);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleStartFundraiser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/start");
    } else {
      navigate("/login", { state: { redirectTo: "/start" } });
    }
  };

  const limitedCampaigns = campaigns.slice(0, 6);
  const showSeeAll = campaigns.length > 6;

  return (
    <main className="bg-white text-dark">
      {/* Hero Section */}
      <section
        className="vh-100 d-flex align-items-center justify-content-center position-relative text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
        <div className="position-relative text-center px-4">
          <h1 className="display-4 fw-bold mb-3">
            Support a Life, Fund a Cause
          </h1>
          <p className="lead mb-4">
            Seva is a medical crowdfunding platform helping real people in
            critical need.
          </p>
          <div className="text-center mt-5" data-aos="fade-up">
            <button
              onClick={handleStartFundraiser}
              className="bg-sky-500 text-white text-lg font-semibold tracking-wide px-4 py-3 rounded shadow-md hover:bg-sky-600 transition duration-300 uppercase"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              START A FUNDRAISER FOR FREE
            </button>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4 text-primary">
          Active Campaigns
        </h2>
        {loading ? (
          <p className="text-center text-muted">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-center text-muted">
            No campaigns available right now.
          </p>
        ) : (
          <>
            <div className="row g-4">
              {limitedCampaigns.map((c) => (
                <div className="col-md-6 col-lg-4" key={c._id}>
                  <CampaignCard campaign={c} />
                </div>
              ))}
            </div>
            {showSeeAll && (
              <div className="d-flex justify-content-end mt-4">
                <Link
                  to="/campaigns"
                  className="btn btn-outline-primary rounded-pill d-flex align-items-center gap-2"
                >
                  See All
                  <span className="material-icons">arrow_forward</span>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Fundraiser Steps Section */}
      <FundraiserSteps />

      {/* Why Seva Section */}
      <WhySeva />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
