import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loadRazorpay from "../utils/loadRazorpay";

const DonateModal = ({ campaignId, campaignTitle, onClose, onDonationSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalRaised, setTotalRaised] = useState(0);

  useEffect(() => {
    const fetchTotalRaised = async () => {
      try {
        const res = await fetch(`/api/donations/total/${campaignId}`);
        const data = await res.json();
        setTotalRaised(data.total || 0);
      } catch (error) {
        console.error("Error fetching total donations:", error);
      }
    };

    fetchTotalRaised();
  }, [campaignId]);

  const handleDonate = async () => {
    if (!name.trim() || !phone.trim() || !amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter valid details.");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create Razorpay order");
      }

      const { order } = await orderRes.json();

      const options = {
        key: "rzp_test_tgAbLTfLMKWcwU", // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Seva Fundraiser",
        description: `Donation for ${campaignTitle}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const donationRes = await fetch("/api/donations/donate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                campaignId,
                amount,
                name,
                email,
                phone,
                razorpay_payment_id: response.razorpay_payment_id,
              }),
            });

            if (!donationRes.ok) {
              const errorData = await donationRes.json().catch(() => ({}));
              throw new Error(errorData.message || "Failed to save donation details.");
            }

            alert("Thank you for your donation!");

            // 🔁 Trigger refresh on parent
            if (typeof onDonationSuccess === "function") {
              await onDonationSuccess();
            }

            onClose();
            navigate("/campaigns");
          } catch (err) {
            console.error("Error saving donation:", err);
            alert("Payment succeeded but failed to record donation. Please contact support.");
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: { color: "#4CAF50" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Donation failed:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Donate to {campaignTitle}</h2>
        <p className="text-sm text-gray-600 mb-4">
          ₹{totalRaised} raised so far
        </p>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          type="email"
          placeholder="Your Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
        <input
          type="number"
          placeholder="Donation Amount (INR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 rounded text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleDonate}
            disabled={loading}
            className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
          >
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;
