import React, { useEffect, useState } from "react";
import axios from "axios";
import CampaignCard from "./CampaignCard";

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/campaigns/my-campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(res.data)) {
        setCampaigns(res.data);
      } else {
        console.error("Unexpected response:", res.data);
        setCampaigns([]);
        setError("Unexpected data format from server.");
      }
    } catch (err) {
      console.error("Error fetching my campaigns:", err);
      setError("Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Campaigns</h2>
      {campaigns.length === 0 ? (
        <p>You haven't created any campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCampaigns;
