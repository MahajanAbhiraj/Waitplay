import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get all notifications for a restaurant
router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { restaurantId },
      orderBy: { time: "desc" },
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

// Get unread notifications count
router.get("/:restaurantId/unread-count", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const unreadCount = await prisma.notification.count({
      where: { restaurantId, read: false },
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread count", error: error.message });
  }
});

// Mark a notification as read
router.put("/:restaurantId/:id/mark-as-read", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    res.json({ success: true, message: "Notification marked as read", notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error marking notification as read", error: error.message });
  }
});

// Create a new notification
router.post("/", async (req, res) => {
  try {
    const { eventName, description, restaurantId } = req.body;

    if (!eventName || !description || !restaurantId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newNotification = await prisma.notification.create({
      data: { eventName, description, restaurantId },
    });

    res.status(201).json({ message: "Notification created successfully", notification: newNotification });
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
});

export default router;
