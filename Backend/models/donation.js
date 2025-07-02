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
  },
  { timestamps: true }
);

const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);
export default Donation;
