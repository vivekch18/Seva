// models/Donation.js
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    email: { type: String },
    phone: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// const Donation = mongoose.model("Donation", donationSchema);
const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);
export default Donation;
