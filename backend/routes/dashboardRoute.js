import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const orders = await prisma.orderlog.findMany({
      where: {
        resId: restaurantId,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      include: { items: true },
    });

    const totalOrders = orders.length;
    let totalRevenue = 0;
    let revenueSplit = { dineIn: 0, delivery: 0, takeOut: 0 };
    let itemCount = {};
    let itemRevenue = {};
    let totalRatings = [];
    let uniqueCustomers = new Set();
    let newCustomers = 0;
    let existingCustomers = 0;

    for (const order of orders) {
      totalRevenue += order.totalPrice;

      if (order.orderType === "Dine-In") revenueSplit.dineIn += order.totalPrice;
      else if (order.orderType === "Delivery") revenueSplit.delivery += order.totalPrice;
      else if (order.orderType === "Takeout") revenueSplit.takeOut += order.totalPrice;

      for (const item of order.items) {
        itemCount[item.name] = (itemCount[item.name] || 0) + item.quantity;
        itemRevenue[item.name] = (itemRevenue[item.name] || 0) + item.price;
      }

      if (order.userid) {
        uniqueCustomers.add(order.userid);
      }

      const rating = await prisma.rating.findFirst({ where: { orderId: order.id } });
      if (rating && rating.totalRating !== undefined) {
        totalRatings.push(rating.totalRating);
      }
    }

    const previousCustomers = await prisma.orderlog.findMany({
      where: { resId: restaurantId, createdAt: { lt: startOfMonth } },
      select: { userid: true },
    });

    for (const customer of uniqueCustomers) {
      if (previousCustomers.some((prev) => prev.userid === customer)) {
        existingCustomers++;
      } else {
        newCustomers++;
      }
    }

    const overallRating =
      totalRatings.length > 0
        ? (totalRatings.reduce((sum, r) => sum + r, 0) / totalRatings.length).toFixed(1)
        : "N/A";

    const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    const sortedItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
    const topSellingItems = sortedItems.slice(0, 5).map(([name, quantity]) => ({
      name,
      quantity,
      rev: itemRevenue[name],
    }));

    res.json({
      totalOrders,
      totalRevenue,
      avgOrderValue,
      revenueSplit,
      topSellingItems,
      overallRating,
      customers: uniqueCustomers.size,
      existingCustomers,
      newCustomers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch Monthly Sales
router.get("/sales/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const selectedYear = req.query.year;

    const monthlySales = await prisma.orderlog.groupBy({
      by: ["createdAt"],
      where: {
        resId: restaurantId,
        createdAt: {
          gte: new Date(`${selectedYear}-01-01`),
          lt: new Date(`${selectedYear}-12-31`),
        },
      },
      _sum: { totalPrice: true },
    });

    const formattedData = monthlySales.map((sale) => ({
      month: new Date(sale.createdAt).toLocaleString("en-US", { month: "short" }),
      Sales: sale._sum.totalPrice,
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Compare Orders Over Two Periods
router.post("/compare-orders", async (req, res) => {
  try {
    const { startDate1, endDate1, startDate2, endDate2, restaurantId } = req.body;

    const ordersCount1 = await prisma.orderlog.count({
      where: { resId: restaurantId, createdAt: { gte: new Date(startDate1), lte: new Date(endDate1) } },
    });

    const ordersCount2 = await prisma.orderlog.count({
      where: { resId: restaurantId, createdAt: { gte: new Date(startDate2), lte: new Date(endDate2) } },
    });

    const totalRevenue1 = await prisma.orderlog.aggregate({
      where: { resId: restaurantId, createdAt: { gte: new Date(startDate1), lte: new Date(endDate1) } },
      _sum: { totalPrice: true },
    });

    const totalRevenue2 = await prisma.orderlog.aggregate({
      where: { resId: restaurantId, createdAt: { gte: new Date(startDate2), lte: new Date(endDate2) } },
      _sum: { totalPrice: true },
    });

    const revenueDifference = (totalRevenue1._sum.totalPrice || 0) - (totalRevenue2._sum.totalPrice || 0);

    res.json({
      ordersCount1,
      ordersCount2,
      orderDifference: ordersCount1 - ordersCount2,
      totalRevenue1: totalRevenue1._sum.totalPrice || 0,
      totalRevenue2: totalRevenue2._sum.totalPrice || 0,
      revenueDifference,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch Ratings for a Restaurant
router.get("/ratings/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: { resId: restaurantId },
    });

    res.json({
      qualityRating: ratings.length ? (ratings.reduce((sum, r) => sum + (r.quality || 0), 0) / ratings.length).toFixed(2) : "N/A",
      serviceRating: ratings.length ? (ratings.reduce((sum, r) => sum + (r.service || 0), 0) / ratings.length).toFixed(2) : "N/A",
      pricingRating: ratings.length ? (ratings.reduce((sum, r) => sum + (r.pricing || 0), 0) / ratings.length).toFixed(2) : "N/A",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/sales1/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    let { startDate, endDate, interval, calculationType } = req.query;

    // Convert string dates to Date objects
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Define the groupBy format based on the interval (daily, weekly, monthly)
    let dateFormat = "YYYY-MM"; // Default: monthly
    if (interval === "daily") {
      dateFormat = "YYYY-MM-DD";
    } else if (interval === "weekly") {
      dateFormat = "YYYY-WW";
    }

    const salesData = await prisma.orderlog.groupBy({
      by: ["createdAt"],
      where: {
        resId: restaurantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalPrice: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Transform data for the frontend
    const formattedData = salesData.map((sale) => ({
      date: sale.createdAt.toISOString().split("T")[0], // Format date
      revenue: calculationType === "average" ? sale._sum.totalPrice / salesData.length : sale._sum.totalPrice,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
