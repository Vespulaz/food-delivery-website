import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import foodModel from "../models/foodModel.js";

// Tính đường dẫn đến thư mục uploads: back-end/uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

// ADD
export const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required with field name 'image'",
      });
    }
    const { name, description, price, category } = req.body;

    const doc = new foodModel({
      name,
      description,
      price: Number(price),
      image: req.file.filename, // lưu filename giống video
      category,
    });

    const saved = await doc.save();
    const data = saved.toObject();
    data.imageUrl = `${req.protocol}://${req.get("host")}/image/${saved.image}`;
    return res
      .status(201)
      .json({ success: true, message: "Food item added successfully", data });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to add food item" });
  }
};

// LIST
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({}).sort({ createdAt: -1 });
    const data = foods.map((f) => {
      const o = f.toObject();
      o.imageUrl = `${req.protocol}://${req.get("host")}/image/${o.image}`;
      return o;
    });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching food list:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch food list" });
  }
};

// REMOVE
export const removeFood = async (req, res) => {
  try {
    // nhận id từ JSON hoặc form
    const id = req.body?.id || req.query?.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const doc = await foodModel.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // xóa ảnh nếu tồn tại
    const imgPath = path.join(uploadDir, doc.image || "");
    try {
      if (fs.existsSync(imgPath)) await fs.promises.unlink(imgPath);
    } catch (e) {
      console.warn("Cannot delete file:", imgPath, e.message);
    }

    await doc.deleteOne();
    return res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error("Remove error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove food" });
  }
};