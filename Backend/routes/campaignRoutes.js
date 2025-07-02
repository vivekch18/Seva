import express from "express";
import multer from "multer";
import Campaign from "../models/Campaign.js";
import Donation from "../models/donation.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { storage } from '../utils/cloudinary.js'; // Cloudinary setup

const router = express.Router();
const uploads = multer({ storage });

// ----------------------
// Create Campaign
// ----------------------
router.post(
  "/",
  verifyToken,
  uploads.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        goal,
        organizer,
        beneficiaryName,
        medicalCondition,
        email,
        phone,
        story,
      } = req.body;

      if (
        !title || !description || !goal || !organizer ||
        !beneficiaryName || !medicalCondition || !email || !phone || !story
      ) {
        return res.status(400).json({ error: "Please fill in all required fields." });
      }

      const goalNum = Number(goal);
      if (isNaN(goalNum) || goalNum <= 0) {
        return res.status(400).json({ error: "Goal must be a positive number." });
      }

      const image = req.files["image"]?.[0]?.path || null;
      const documents = req.files["documents"]?.map(file => file.path) || [];

      const campaign = new Campaign({
        title,
        description,
        goal: goalNum,
        organizer,
        beneficiaryName,
        medicalCondition,
        email,
        phone,
        story,
        image,
        documents,
        createdBy: req.user.id,
      });

      await campaign.save();

      res.status(201).json(campaign);
    } catch (err) {
      console.error("Error creating campaign:", err);
      res.status(500).json({ error: "Server error. Please try again." });
    }
  }
);

// The rest of your routes (get all, get by id, update, etc.) remain the same.

// ----------------------
// Get All Campaigns
// ----------------------
router.get("/", async (req, res) => {
  try {
    // const campaigns = await Campaign.find().sort({ createdAt: -1 });
    // res.json(campaigns);
    const campaigns = await Campaign.find().sort({ createdAt: -1 });

// 2. Extract campaign IDs
const campaignIds = campaigns.map(c => c._id);

// 3. Fetch all donations for these campaigns
const totalDonations = await Donation.find({ campaign: { $in: campaignIds } });

// 4. Create a map of total donation amount per campaign
const donationSumMap = {};
totalDonations.forEach(donation => {
  const id = donation.campaign.toString();
  donationSumMap[id] = (donationSumMap[id] || 0) + donation.amount;
});

// 5. Attach totalAmount to each campaign
const campaignsWithAmount = campaigns.map(campaign => {
  return {
    ...campaign.toObject(),
    totalAmount: donationSumMap[campaign._id.toString()] || 0,
  };
});

// 6. Send response
res.json(campaignsWithAmount);
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
});

// ----------------------
// Get campaigns of logged-in user
// ----------------------
router.get("/my-campaigns", verifyToken, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    const campaignIds = campaigns.map(c => c._id);

// Find all donations for those campaigns
const totalDonations = await Donation.find({ campaign: { $in: campaignIds } });
// console.log(totalDonations);
    // res.json(campaigns);
    const donationSumMap = {};
totalDonations.forEach(donation => {
  const id = donation.campaign.toString();
  donationSumMap[id] = (donationSumMap[id] || 0) + donation.amount;
});

// Attach total donation amount to each campaign
const campaignsWithAmount = campaigns.map(campaign => {
  return {
    ...campaign.toObject(),
    totalAmount: donationSumMap[campaign._id.toString()] || 0,
  };
});

res.json(campaignsWithAmount);

  } catch (err) {
    console.error("Error fetching user campaigns:", err);
    res.status(500).json({ error: "Failed to fetch your campaigns." });
  }
});

// ----------------------
// Get single campaign by ID
// ----------------------
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
if (!campaign) {
  return res.status(404).json({ error: "Campaign not found" });
}

// Find all donations for this campaign
const totalDonations = await Donation.find({ campaign: campaign._id });

// Calculate total amount
const totalAmount = totalDonations.reduce((sum, donation) => sum + donation.amount, 0);

// Convert to object and attach totalAmount
const campaignWithAmount = {
  ...campaign.toObject(),
  totalAmount,
};

res.json(campaignWithAmount);
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({ error: "Failed to fetch campaign." });
  }
});

// ----------------------
// Update campaign by ID
// ----------------------
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // Only owner can update
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this campaign" });
    }

    // Validate goal if it's included in update
    if (req.body.goal !== undefined) {
      const updatedGoal = Number(req.body.goal);
      if (isNaN(updatedGoal) || updatedGoal <= 0) {
        return res.status(400).json({ error: "Goal must be a positive number." });
      }
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // make sure Mongoose schema validation runs on update
    });

    res.json(updatedCampaign);
  } catch (err) {
    console.error("Error updating campaign:", err);
    res.status(500).json({ error: "Failed to update campaign." });
  }
});

export default router;
