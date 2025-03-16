import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password, mobileNumber, restaurantVisits } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobileNumber,
        restaurantVisits: {
          create: restaurantVisits?.map((visit) => ({
            restaurantId: visit.restaurantId,
            orders: visit.orders,
          })),
        },
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Add a restaurant visit
router.post("/:userId/visit", async (req, res) => {
  const { userId } = req.params;
  const { restaurantId, orderId } = req.body;

  try {
    const existingVisit = await prisma.restaurantVisit.findFirst({
      where: { userId, restaurantId },
    });

    if (existingVisit) {
      await prisma.restaurantVisit.update({
        where: { id: existingVisit.id },
        data: { orders: { push: orderId } },
      });
    } else {
      await prisma.restaurantVisit.create({
        data: {
          userId,
          restaurantId,
          orders: [orderId],
        },
      });
    }

    res.status(200).json({ message: "Visit added successfully" });
  } catch (error) {
    console.error("Error adding visit:", error);
    res.status(500).json({ message: "Error adding visit", error });
  }
});

// Get a user with populated restaurant visits
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { restaurantVisits: true },
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Error fetching user details", error });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users details", error);
    res.status(500).json({ message: "Error fetching all users details", error });
  }
});

// Get visit details for a user
router.get("/visit-details/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const visits = await prisma.restaurantVisit.findMany({
      where: { userId },
      select: {
        restaurantId: true,
        orders: true,
      },
    });

    const visitDetails = visits.map((visit) => ({
      restaurantId: visit.restaurantId,
      visitCount: visit.orders.length,
    }));

    res.status(200).json({ visitDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
