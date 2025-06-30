import { Link } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";

// ✅ Access environment variable the Vite way
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function CampaignCard({ campaign }) {
  const {
    _id,
    title = "Untitled Campaign",
    description = "",
    image,
    goal = 0,
    raised = 0,
    totalAmount,
    beneficiaryName,
    medicalCondition,
  } = campaign || {};

  const progress = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  // ✅ Correctly construct image URL
  const imageUrl = image?.startsWith("http")
    ? image
    : `${serverUrl}/uploads/${image}`;

  const handleShare = () => {
    const url = `${window.location.origin}/campaign/${_id}`;
    const shareData = {
      title: title,
      text: `Support ${beneficiaryName || "this campaign"} on Seva!\n\nClick the link to know more and donate: ${url}`,
      url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.error("Sharing failed", err));
    } else {
      navigator.clipboard.writeText(url);
      alert("Campaign link copied to clipboard!");
    }
  };

  return (
    <div className="card shadow-sm rounded-4 overflow-hidden border-0 h-100">
      <img
        src={imageUrl}
        alt={title}
        className="card-img-top object-cover"
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x200?text=No+Image"; // ✅ more reliable than via.placeholder.com
        }}
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title fw-bold text-dark">{title}</h5>
          <p className="card-text text-secondary small">
            {medicalCondition ? `For: ${beneficiaryName} - ${medicalCondition}` : description}
          </p>
        </div>

        <div className="mt-3">
          <div className="w-100 bg-light rounded-pill h-4 mb-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-100 rounded-pill"
              style={{ width: `${(totalAmount / goal) * 100}%` }}
            ></div>
          </div>
          <p className="text-muted small mb-3">
            ₹{totalAmount} raised of ₹{goal}
          </p>

          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary w-50 rounded-pill d-flex align-items-center justify-content-center gap-2"
              onClick={handleShare}
              title="Share this campaign"
            >
              <FaShareAlt /> Share
            </button>

            <Link
              to={`/campaign/${_id}`}
              className="btn btn-primary w-50 rounded-pill d-flex align-items-center justify-content-center"
            >
              View Campaign
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
