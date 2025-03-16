import express from "express";
import multer from "multer";
import path from "path";
import fs from 'fs';
import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/saveMenuItem", upload.single("image"), async (req, res) => {
  try {
    const { title, description, isVeg, halfPrice, fullPrice, category, prepTime } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const savedMenuItem = await prisma.menuItem.create({
      data: {
        title,
        description,
        image,
        isVeg: isVeg === "true",
        halfPrice: parseFloat(halfPrice),
        fullPrice: parseFloat(fullPrice),
        category,
        prepTime: parseInt(prepTime),
      },
    });

    res.status(201).json(savedMenuItem);
  } catch (error) {
    console.error("Error saving menu item:", error);
    res.status(500).json({ error: "Failed to save menu item" });
  }
});

router.get("/getMenuItems", async (req, res) => {
  try {
    const menuItems = await prisma.menuItem.findMany();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

router.delete("/deleteMenuItem/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({ where: { id: parseInt(id) } });

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    if (menuItem.image) {
      const imagePath = path.resolve("uploads", path.basename(menuItem.image.replace(/^\/+/, '')));
      fs.unlinkSync(imagePath);
    }

    await prisma.menuItem.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

router.put("/updateMenuItem/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isVeg, halfPrice, fullPrice, category, prepTime } = req.body;

    let updateData = {
      title,
      description,
      isVeg: isVeg === "true",
      halfPrice: parseFloat(halfPrice),
      fullPrice: parseFloat(fullPrice),
      category,
      prepTime: parseInt(prepTime),
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Failed to update menu item" });
  }
});

export default router;