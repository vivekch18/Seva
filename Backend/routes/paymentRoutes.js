// routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// Initialize Razorpay instance with your keys
const razorpay = new Razorpay({
  key_id: "rzp_test_tgAbLTfLMKWcwU",
  key_secret: "dRAJesVPClSyuxpgSu0MdHUC",
});

router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  // Validate amount - must be positive number
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Invalid amount provided" });
  }

  const options = {
    amount: Number(amount) * 100, // Razorpay expects amount in paisa (integer)
    currency,
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", order);
    // Respond with order object wrapped inside { order }
    res.status(200).json({ order });
  } catch (error) {
    console.error("❌ Order creation failed:", error);
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
});

export default router;
