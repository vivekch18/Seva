// src/pages/MyCampaigns.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CampaignCard from './CampaignCard';

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/campaigns/my-campaigns', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCampaigns(res.data);
    } catch (error) {
      console.error('Error fetching my campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

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
