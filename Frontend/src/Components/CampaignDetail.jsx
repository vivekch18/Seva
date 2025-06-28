import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DonateModal from "./DonateModal";
import Footer from "./Footer";

export default function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        setCampaign(res.data);
      } catch (err) {
        setError("Failed to fetch campaign.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleDonateClick = () => setDonateModalOpen(true);

  const handleShare = () => {
    const url = `${window.location.origin}/campaign/${campaign._id}`;
    const shareData = {
      title: campaign.title,
      text: `Support ${campaign.beneficiaryName || "this campaign"} on Seva!\n\nClick the link to know more and donate: ${url}`,
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Sharing failed", err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Campaign link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-lg text-indigo-600">Loading campaign...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 flex justify-center items-center min-h-screen">
        <div className="text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6 text-center text-gray-700 min-h-screen">
        <div className="text-xl">Campaign not found</div>
      </div>
    );
  }

  const raised = Number(campaign.totalAmount) || 0;
  const goal = Number(campaign.goal) || 0;
  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100).toFixed(2) : 0;

  const organizer = campaign.organizer || "Anonymous";
  const beneficiary = campaign.beneficiaryName || "Anonymous";

  return (
    <main>
      <div className="pt-24 px-4 sm:px-6 lg:px-20 bg-gray-100 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            <img
              src={
                campaign.image?.startsWith("http")
                  ? campaign.image
                  : `http://localhost:5000/uploads/${campaign.image}`
              }
              alt={campaign.title}
              className="w-full h-96 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
              }}
            />
            <div className="text-gray-800">
              <h2 className="text-xl font-semibold mb-2">About the Fundraiser</h2>
              <p className="text-lg whitespace-pre-line">{campaign.description}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <button
              onClick={handleDonateClick}
              className="w-full bg-teal-600 text-white text-lg py-3 rounded font-semibold hover:bg-teal-700 transition duration-200"
            >
              💚 Contribute Now
            </button>

            <button
              onClick={handleShare}
              className="w-full mt-3 border border-teal-600 text-teal-600 text-lg py-2 rounded font-semibold hover:bg-teal-50 transition duration-200"
            >
              📤 Share this Campaign
            </button>

            {/* Donation Stats */}
            <div className="text-2xl font-bold text-gray-900 mt-6 mb-1">
              ₹{raised.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              raised of ₹{goal.toLocaleString()} goal
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="h-3 bg-teal-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Offer */}
            <div className="mt-6 text-sm text-green-600 bg-green-50 border border-green-200 p-2 rounded-md">
              🎁 Seva charges 0% platform fee!
            </div>

            {/* Organizer Info */}
            <div className="mt-6 border-t pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {organizer.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Campaigner</div>
                  <div className="font-medium text-gray-800">{organizer}</div>
                </div>
              </div>

              {/* Beneficiary Info */}
              <div className="flex items-center space-x-3 mt-6">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {beneficiary.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Beneficiary</div>
                  <div className="font-medium text-gray-800">{beneficiary}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donate Modal */}
        {donateModalOpen && (
          <DonateModal
            campaign={campaign}
            closeModal={() => setDonateModalOpen(false)}
          />
        )}
      </div>

      <Footer />
    </main>
  );
}
