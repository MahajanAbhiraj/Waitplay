import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Fetch products with optional filtering
router.get("/products", async (req, res) => {
  try {
    const { type, category } = req.query;
    let where = {};

    if (type && type !== "all") where.type = type.toLowerCase();
    if (category && category !== "all") where.category = category.toLowerCase();

    const products = await prisma.menuItem.findMany({ where });
    res.json(products);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// Fetch distinct categories based on type
router.get("/categories", async (req, res) => {
  try {
    const { type } = req.query;
    let where = {};

    if (type && type !== "all") where.type = type.toLowerCase();

    const categories = await prisma.menuItem.findMany({
      where,
      select: { category: true },
      distinct: ["category"],
    });

    res.json(categories.map(item => item.category));
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

// Search for products by title
router.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    const results = await prisma.menuItem.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
      },
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results", error: error.message });
  }
});

export default router;
