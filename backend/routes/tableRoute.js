import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get all tables for a restaurant
router.get("/tables/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const tables = await prisma.table.findMany({ where: { restaurantId } });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new table
router.post("/tables", async (req, res) => {
  try {
    const table = await prisma.table.create({ data: req.body });
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: "Error creating table", error });
  }
});

// Delete a table and update restaurant
router.delete("/tables/:tableId", async (req, res) => {
  const { tableId } = req.params;
  try {
    const deletedTable = await prisma.table.delete({ where: { id: tableId } });
    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found." });
    }
    await prisma.restaurant.update({
      where: { id: deletedTable.restaurantId },
      data: { tables: { disconnect: [{ id: tableId }] } },
    });
    res.json({ message: "Table deleted successfully.", table: deletedTable });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Get QR code data for a table
router.get("/tables/:tableId/qrcode", async (req, res) => {
  try {
    const { tableId } = req.params;
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }
    res.json({ qrData: table.qrData });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Request QR code for a table
router.post("/requestQR", async (req, res) => {
  try {
    const { tableId, description, restaurantId } = req.body;
    const newRequest = await prisma.request.create({
      data: { tableId, description, restaurantId },
    });
    res.status(201).json({ message: "Request saved successfully", newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error saving request", error });
  }
});

export default router;