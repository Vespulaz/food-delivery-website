// back-end/controllers/orderController.js
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET;
const stripeClient = stripeSecret ? new Stripe(stripeSecret) : null;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";

// Tạo đơn và tạo Stripe Checkout session
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body || {};
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: "items must be a non-empty array" });
    }
    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "amount must be a positive number" });
    }
    if (!address || typeof address !== "object") {
      return res.status(400).json({ success: false, message: "address is required" });
    }

    const newOrder = await Order.create({
      userId: req.user.id,
      items,
      amount,
      address
    });

    // clear cart
    await User.findByIdAndUpdate(req.user.id, { $set: { cartData: {} } });

    // line items (giảm 20%)
    const line_items = items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: String(item.name || "Item") },
        unit_amount: Math.round(Number(item.price) * 100 * 0.8)
      },
      quantity: Math.max(1, Number(item.quantity) || 1)
    }));

    // phí giao hàng ví dụ 5$
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Fee" },
        unit_amount: Math.round(5 * 100 * 0.8)
      },
      quantity: 1
    });

    // nếu chưa cấu hình Stripe secret, trả URL mock để test flow
    if (!stripeClient) {
      return res.json({
        success: true,
        session_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}&mock=stripe`
      });
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendURL}/verify?success=false&orderId=${newOrder._id}`
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ success: false, message: `Server error` });
  }
};

// Xác minh kết quả thanh toán từ frontend
export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body || {};
  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }
    if (String(success) === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed, order cancelled" });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// user order for frontend
export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


//listing orders for admin
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};