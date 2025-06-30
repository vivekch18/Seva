// routes/donationRoutes.js
import express from "express";
import Campaign from "../models/Campaign.js";
import Donation from "../models/donation.js";    //its import the donation model
import twilio from "twilio";

const router = express.Router();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

console.log("SID:", process.env.TWILIO_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("PHONE:", process.env.TWILIO_PHONE);

if (!accountSid || !authToken || !twilioPhone) {
  throw new Error("Twilio credentials are missing in donationRoutes.js");
}

const client = twilio(accountSid, authToken);

// @route   POST /api/donations/donate
// @desc    Process donation and send thank-you SMS
router.post("/donate", async (req, res) => {
  const { campaignId, amount, name, phone, email, razorpay_payment_id } = req.body;

  if (!campaignId || !amount || !name || !phone) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    // 1. Find campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    // 2. Save donation
    const donation = new Donation({
      campaign: campaignId,
      name,
      amount,
      phone,
      email,
      razorpay_payment_id,
    });
    await donation.save();

    // 3. Update campaign raised amount
    campaign.raised += Number(amount);
    await campaign.save();

    // 4. Send SMS
    const message = `🙏 Thank you ${name} for your generous donation of ₹${amount} to "${campaign.title}". Your support means the world! - Team Seva`;

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: `+91${phone}`, // For Indian phone numbers
    });

    // 5. Respond with success
    res.status(200).json({ message: "Donation successful and SMS sent." });
  } catch (err) {
    console.error("❌ Donation error:", err.message || err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// @route   GET /api/donations/total/:campaignId
// @desc    Get total amount donated to a campaign
router.get("/total/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;

    const result = await Donation.aggregate([
      { $match: { campaign: campaignId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const total = result[0]?.total || 0;
    res.status(200).json({ total });
  } catch (error) {
    console.error("❌ Error fetching total donations:", error.message || error);
    res.status(500).json({ message: "Failed to fetch total donations." });
  }
});

export default router;
