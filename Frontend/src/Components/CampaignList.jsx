import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";
import DonateModal from "../Components/DonateModal";
import Footer from "../Components/Footer";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/campaigns`);
        const data = res.data;

        if (Array.isArray(data)) {
          setCampaigns(data);
        } else {
          console.warn("API did not return an array:", data);
          setCampaigns([]);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonateClick = (campaign) => {
    setSelectedCampaign(campaign);
    setDonateModalOpen(true);
  };

  const handleShareClick = (campaign) => {
    const url = `${window.location.origin}/campaign/${campaign._id}`;
    const shareData = {
      title: campaign.title,
      text: "Support this cause on Seva!",
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) =>
        console.error("Sharing failed", err)
      );
    } else {
      navigator.clipboard.writeText(url);
      alert("Campaign link copied to clipboard!");
    }
  };

  return (
    <main className="pt-24 bg-gray-50 min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="w-full">
        <div className="bg-gradient-to-r from-cyan-700 to-blue-500 p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Save A Child Every Month</h1>
            <p className="mb-6 text-base sm:text-lg">
              Join <span className="font-semibold">421,908</span> monthly contributors with Social Impact Plan & start saving needy children every month
            </p>
            <button className="bg-white text-cyan-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100">
              Start Giving Monthly
            </button>
          </div>
          <img
            src="https://images.pexels.com/photos/3933022/pexels-photo-3933022.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300"
            alt="Child"
            className="rounded-xl shadow-lg w-full max-w-xs lg:max-w-md object-cover"
          />
        </div>
      </div>

      {/* Campaign Cards */}
      <div className="max-w-7xl mx-auto pt-12 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-indigo-600">
            Loading campaigns...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48 text-red-600">
            {error}
          </div>
        ) : Array.isArray(campaigns) && campaigns.length === 0 ? (
          <p className="text-gray-500 text-center">No campaigns found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(campaigns) &&
              campaigns.map((campaign) => {
                const imageUrl =
                  campaign.image?.startsWith("http") || campaign.image?.includes("base64")
                    ? campaign.image
                    : `${import.meta.env.VITE_SERVER_URL}/uploads/${campaign.image}`;

                const goal = Number(campaign.goal) || 0;
                const raised = Number(campaign.totalAmount) || 0;
                const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
                const deadline = campaign.deadline
                  ? Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <div
                    key={campaign._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col min-h-[420px]"
                  >
                    <Link to={`/campaign/${campaign._id}`}>
                      <img
                        src={imageUrl}
                        alt={campaign.title}
                        className="w-full h-36 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                        }}
                      />
                    </Link>

                    <div className="flex flex-col justify-between flex-grow p-4 space-y-2">
                      <div>
                        <h2 className="text-md font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
                          {campaign.title}
                        </h2>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                          {campaign.medicalCondition}
                        </p>

                        <div className="flex justify-between text-sm text-gray-700 mb-2">
                          <div>
                            <p className="text-gray-500">Raised</p>
                            <p className="font-semibold text-green-600">₹{raised.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Goal</p>
                            <p className="font-semibold">₹{goal.toLocaleString()}</p>
                          </div>
                          {deadline !== null && (
                            <div>
                              <p className="text-gray-500">Ends In</p>
                              <p className="text-red-500 font-semibold">{deadline} Days</p>
                            </div>
                          )}
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleShareClick(campaign)}
                          className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded bg-white hover:text-sky-700 w-1/2"
                        >
                          <FaShareAlt />
                          Share
                        </button>
                        <button
                          onClick={() => handleDonateClick(campaign)}
                          className="px-3 py-2 text-sm font-medium text-white bg-sky-500 rounded hover:bg-sky-600 w-1/2"
                        >
                          Contribute
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Donate Modal */}
      {donateModalOpen && selectedCampaign && (
        <DonateModal
          campaignId={selectedCampaign._id}
          campaignTitle={selectedCampaign.title}
          onClose={() => setDonateModalOpen(false)}
        />
      )}
      <Footer />
    </main>
  );
}
