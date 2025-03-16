import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Get tables with active orders
router.get("/tables-with-orders/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const tableIdsWithOrders = await prisma.order.findMany({
      select: { table: true },
      distinct: ['table'],
    });

    const tableIds = tableIdsWithOrders.map(order => order.table);

    const tables = await prisma.table.findMany({
      where: {
        restaurantId,
        id: { in: tableIds },
      },
      select: { tableId: true },
    });

    res.status(200).json(tables.map(table => table.tableId));
  } catch (error) {
    console.error("Error fetching tables with orders:", error);
    res.status(500).json({ error: "Failed to fetch tables with orders." });
  }
});

// Fetch order details for a specific table
router.get('/fetchOrder/:tableId', async (req, res) => {
  const { tableId } = req.params;
  try {
    const table = await prisma.table.findUnique({ where: { tableId } });
    if (!table) {
      console.error(`Table with ID ${tableId} not found.`);
      return res.status(404).json({ message: 'No table found for the provided ID.' });
    }

    const order = await prisma.order.findFirst({
      where: { tableId: table.id },
      include: { items: true },
    });

    if (order) {
      const formattedItems = order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));
      res.json({ items: formattedItems, totalPrice: order.totalPrice });
    } else {
      res.status(404).json({ message: 'No bill found for this table.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bill details.' });
  }
});

export default router;